<template>
  <div>
    <div v-if="showControls" class="flex items-center px-6 py-3 border-b">
      <div class="w-1/3">
        <b-datepicker
          v-model="dates"
          placeholder="Click to select..."
          range
          @input="refresh"
        />
      </div>
      <gc-input v-model="term" class="w-full ml-4" placeholder="Search for products by SKU" @input="handleInput" />
      <div class="w-1/3 ml-4">
        <gc-button :loading="exporting" @click="exportReport">
          Export Report
        </gc-button>
      </div>
    </div>
    <div v-show="loading" class="flex h-full p-12">
      <div class="flex items-center text-gray-400">
        <loading-spinner /><span class="ml-2 text-sm font-medium uppercase"> Loading Report</span>
      </div>
    </div>
    <div v-show="!loading">
      <gc-table
        :data="data"
        :meta="meta"
        :columns="[
          { label: 'SKU', field: 'sku', class: 'w-32'},
          { label: 'Product', field: 'product'},
          { label: 'Quantity', field: 'quantity'},
          { label: 'Revenue', field: 'revenue'},
        ]"
        @changePage="changePage"
      >
        <template v-slot:sku="{ row }">
          {{ row.sku }}
        </template>
        <template v-slot:product="{ row }">
          {{ row.description }}
        </template>
        <template v-slot:quantity="{ row }">
          {{ $format.number(row.quantity) }}
        </template>
        <template v-slot:revenue="{ row }">
          {{ $format.currency(row.sub_total) }}
        </template>
      </gc-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

const debounce = require('lodash/debounce')

export default {
  props: {
    useQueryString: {
      type: Boolean,
      default: true
    },
    to: {
      type: Object,
      default: null
    },
    from: {
      type: Object,
      default: null
    },
    mode: {
      type: String,
      default: 'weekly'
    },
    showControls: {
      type: Boolean,
      default: true
    },
    showGraph: {
      type: Boolean,
      default: true
    },
    showTable: {
      type: Boolean,
      default: true
    },
    initialStyle: {
      type: String,
      default: 'line'
    }
  },

  async fetch () {
    const { from, to, page } = this.$route.query

    if (this.useQueryString) {
      if (from || to) {
        this.fromDate = moment(from, 'YYYY-MM-DD').toDate()
        this.toDate = moment(to, 'YYYY-MM-DD').toDate()
      }

      if (!this.fromDate || !this.toDate) {
        this.fromDate = moment().startOf('month').subtract(1, 'year').toDate()
        this.toDate = moment().toDate()
        if (moment(this.fromDate).isSame(this.toDate, 'day')) {
          this.toDate = moment().add(1, 'day').toDate()
        }
      }
    } else {
      this.fromDate = this.from.toDate()
      this.toDate = this.to.toDate()
    }

    this.page = page || 1

    this.dates = [
      this.fromDate,
      this.toDate
    ]

    await this.refresh()
  },
  data () {
    return {
      loading: true,
      dates: [],
      data: null,
      fromDate: this.from,
      toDate: this.to,
      term: null,
      meta: {},
      page: 1,
      exporting: false
    }
  },
  methods: {
    async exportReport () {
      this.exporting = true
      const from = moment(this.dates[0]).format('YYYY-MM-DD')
      const to = moment(this.dates[1]).format('YYYY-MM-DD')

      await this.$gc.reports.get('products/best-sellers', {
        from,
        to,
        export: 1,
        term: this.term
      })
      this.$notify.queue('success', 'Report export started. Check your emails')
      this.exporting = false
    },
    handleInput: debounce(function () {
      this.refresh()
    }, 300),
    changePage (page) {
      this.page = page
      this.refresh()
    },
    async refresh () {
      this.loading = true
      // Get the report we want.]

      const from = moment(this.dates[0])
      const to = moment(this.dates[1])

      const response = await this.$gc.reports.get('products/best-sellers', {
        from: from.format('YYYY-MM-DD'),
        to: to.format('YYYY-MM-DD'),
        page: this.page,
        term: this.term
      })
      this.loading = false
      this.data = response.data.data
      this.meta = response.data
      this.page = response.data.current_page

      if (this.useQueryString) {
        this.$router.push({
          path: this.$route.path,
          query: {
            from: from.format('YYYY-MM-DD'),
            to: to.format('YYYY-MM-DD'),
            term: this.term,
            page: this.page
          }
        })
      }

    }
  }
}
</script>

<style scoped>

</style>
