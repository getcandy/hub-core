<template>
  <div class="search-table">
    <div class="search-field" v-if="hideSearch === false">
      <b-input v-model="searchTerm" @input="refresh" :placeholder="$t(searchPlaceholder)"></b-input>
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
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"><slot :name="slot" v-bind="scope"/></template>
      </gc-table>
      <!-- <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th v-for="(column, index) in columns" :key="index" class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-600 uppercase bg-gray-50">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr :class="{'bg-white': index % 2 === 0, 'bg-gray-50': index % 2 !== 0 }" v-for="(row, index) in data" :key="index">
            <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-no-wrap" v-for="(column, colIndex) in columns" :key="colIndex">
               <slot :name="column.field" v-bind="row"></slot>
            </td>
          </tr>
        </tbody>
      </table>
      <nav class="flex items-center justify-center px-4 pb-3 border-t border-gray-200 sm:px-0">
        <div class="hidden md:flex">
          <a
            href="#"
            v-for="(link, index) in meta.links"
            :key="index"
            @click.prevent="changePage(link)"
            :class="{
              'text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700 border-indigo-500': link.active,
              'text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-400': !link.active,
            }"
            class="inline-flex items-center px-4 pt-4 -mt-px text-sm font-medium leading-5 transition duration-150 ease-in-out border-t-2 border-transparent focus:outline-none"
            v-html="link.label"
          >
          </a>
        </div>
      </nav> -->
    </div>
    <!-- <b-table
      :striped="!hoverable"
      :loading="loading"
      :hoverable="hoverable"
      :data="data"
      :total="total"
      :per-page="perPage"
      :current-page="page"
      backend-sorting
      @sort="onSort"
      sort-icon="arrow-up-s-line"
      paginated
      @mouseenter="handleMouseEnter"
      backend-pagination
      @page-change="changePage"
      :checkable="checkable"
    >
      <template slot-scope="props">
        <slot v-bind="props" />
      </template>
      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>Nothing here.</p>
          </div>
        </section>
      </template>
    </b-table> -->
  </div>
</template>

<script>
  const each = require('lodash/each')
  const debounce = require('lodash/debounce')
  export default {
    props: {
      columns: {
        type: Array,
        required: true,
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
      hoverable: {
        type: Boolean,
        default: false
      },
      includes: {
        type: String|Array
      },
      limit: {
        type: String|Number,
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
    data() {
      return {
        loading: true,
        data: [],
        sort: null,
        searchTerm: this.externalTerm,
        largeDataSet: false,
        meta: {},
        perPage: this.limit,
        page: 1,
      }
    },
    watch: {
      externalTerm (val) {
        this.searchTerm = this.externalTerm
        this.refresh()
      },
      filters: {
        deep: true,
        handler () {
          this.loadData()
        }
      }
    },
    mounted() {
      const query = this.$route.query;
      this.searchTerm = query.keywords || null
      this.page = parseInt(query.page) || 1
      this.sort = query.sort || null
      this.loadData()
    },
    methods: {
      refresh: debounce(function () {
        this.loadData(false)
      }, 400),
      changePage(page) {
        this.page = page;
        this.loadData()
      },
      onSort(val, dir) {
        this.sort = val + '-' + dir

        this.loadData()
      },
      handleMouseEnter(e) {
        this.$emit('mouseenter', e)
      },
      async loadData() {
        this.loading = true;

        // channel, category, page, searchType, keywords, rank, idsOnly, include, sort, options = {

        try {
          const response = await this.$getcandy.on('Search').getSearch(
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
                per_page: this.limit
              }
            }
          )

          this.data = response.data.data
          this.meta = response.data.meta
          this.total = this.meta.total
          this.perPage = this.meta.per_page
          this.page = this.meta.current_page;

          this.$emit('loaded', response.data)

          const query = this.$route.query;
          // Push everything to the query string
          this.$router.push({
            path: this.$route.path,
            query: {
              keywords: this.searchTerm,
              sort: this.sort,
              page: this.page
            }
          })
        } catch (e) {
        }
        this.loading = false
      }
    }
  }
</script>
