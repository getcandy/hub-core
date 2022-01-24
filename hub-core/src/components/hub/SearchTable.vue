<template>
  <div class="search-table">
    <div v-if="hideSearch === false" class="search-field">
      <div class="flex">
        <div class="w-full mr-6">
          <gc-input v-model="searchTerm" :placeholder="$t(searchPlaceholder)" />
        </div>
        <gc-button type="button" theme="gray" @click="refresh">
          Search
        </gc-button>
      </div>
    </div>
    <div v-if="largeDataSet" class="p-4 text-xs font-medium text-white bg-red-500">
      Large data set returned, showing the first <strong class="text-white">{{ total }}</strong> results, use search and filters to find products.
    </div>
    <div>
      <gc-table
        :columns="columns"
        :loading="loading"
        :data="data"
        :meta="meta"
        @changePage="changePage"
      >
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </gc-table>
    </div>
  </div>
</template>

<script>
const debounce = require('lodash/debounce')
export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    filters: {
      type: Object,
      default: () => {}
    },
    checkable: {
      type: Boolean,
      default: false
    },
    externalTerm: {
      type: String,
      default: null
    },
    updateQueryString: {
      type: Boolean,
      default: true
    },
    hoverable: {
      type: Boolean,
      default: false
    },
    includes: {
      type: [String, Array],
      default: null
    },
    limit: {
      type: [String, Number],
      default: 30
    },
    searchPlaceholder: {
      type: String,
      default: 'Search by keyword'
    },
    hideSearch: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: true,
      data: [],
      sort: null,
      searchTerm: this.externalTerm,
      largeDataSet: false,
      meta: {},
      perPage: this.limit,
      page: 1
    }
  },
  watch: {
    externalTerm: debounce(function () {
      if (!this.externalTerm || this.externalTerm.length >= 3) {
        this.searchTerm = this.externalTerm
        this.refresh()
      }
    }, 300),
    filters: {
      deep: true,
      handler () {
        this.loadData()
      }
    }
  },
  mounted () {
    const query = this.$route.query
    this.searchTerm = query.keywords || null
    this.page = parseInt(query.page) || 1
    this.sort = query.sort || null
    this.loadData()
  },
  methods: {
    refresh: debounce(function () {
      this.loadData(false)
    }, 400),
    changePage (page) {
      this.page = page
      this.loadData()
    },
    onSort (val, dir) {
      this.sort = val + '-' + dir

      this.loadData()
    },
    handleMouseEnter (e) {
      this.$emit('mouseenter', e)
    },
    async loadData () {
      this.loading = true

      // channel, category, page, searchType, keywords, rank, idsOnly, include, sort, options = {

      try {
        const response = await this.$getcandy.on('search', 'getSearch',
          this.channel,
          null,
          this.page,
          this.type,
          this.externalTerm || this.searchTerm,
          false,
          false,
          this.includes,
          this.sort,
          true,
          {
            query: {
              limit: this.limit
            }
          }
        )

        this.data = response.data.data
        this.meta = response.data.meta
        this.total = this.meta.total
        this.perPage = this.meta.per_page
        this.page = this.meta.current_page

        this.$emit('loaded', response.data)

        if (this.updateQueryString) {
        // Push everything to the query string
          this.$router.push({
            path: this.$route.path,
            query: {
              keywords: this.searchTerm,
              sort: this.sort,
              page: this.page
            }
          })
        }
      } catch (e) {
      }
      this.loading = false
    }
  }
}
</script>
