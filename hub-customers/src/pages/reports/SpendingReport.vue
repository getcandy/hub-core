<template>
  <div>
    <div v-if="showControls && !loading" class="flex items-center justify-between px-6 py-3 border-b">
      <div class="w-1/3">
        <b-datepicker
          v-model="dates"
          placeholder="Click to select..."
          range
          @input="refresh"
        />
      </div>
      <div>
        <gc-button @click="exportReport">Export Report</gc-button>
      </div>
    </div>
    <div v-show="loading" class="flex h-full p-12">
      <div class="flex items-center text-gray-400">
        <loading-spinner /><span class="ml-2 text-sm font-medium uppercase"> Loading Report</span>
      </div>
    </div>
    <div v-if="data">
      <gc-table
        :data="data.data.data"
        :meta="data.data"
        @changePage="changePage"
        :columns="[
          {label: 'Has Account', field: 'has_account', class: 'w-5'},
          {label: 'Name', field: 'name'},
          {label: 'Email', field: 'email'},
          {label: 'Total Spend (Excl. Tax)', field: 'sub_total'},
        ]"
      >
        <template v-slot:has_account="{ row }">
          <gc-icon icon="circle-check" :class="row.user_id ? 'text-green-500' : 'text-gray-300'" />
        </template>
        <template v-slot:name="{ row }">
          <span v-if="row.company_name">{{ row.company_name }}</span>
          <span v-else>{{ row.firstname }} {{ row.lastname }}</span>
        </template>
        <template v-slot:email="{ row }">
          <template v-if="row.user_id">
              <nuxt-link
              :to="{
                name: 'users-id',
                params: {
                  id: row.user_id
                }
              }"
            >
              {{ row.email }}
            </nuxt-link>
          </template>
          <template v-else>
            {{ row.email }}
          </template>
        </template>
        <template v-slot:sub_total="{ row }">
          {{ $format.currency({
            amount: row.sub_total,
            precision: 0
          }) }}
        </template>
      </gc-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

const map = require('lodash/map')
const find = require('lodash/find')
const Chart = require('chart.js')

export default {
  props: {
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
      default: 'monthly'
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
      default: 'bar'
    }
  },
  data () {
    return {
      chart: null,
      loading: true,
      customerGroup: null,
      dates: [],
      data: null,
      page: 1,
      fromDate: this.from,
      toDate: this.to,
      viewMode: this.mode,
      style: this.initialStyle
    }
  },
  mounted () {
    const { from, to, page } = this.$route.query

    this.page = page || 1

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

    if (this.from && this.to) {
      this.fromDate = this.from
      this.toDate = this.to
    }

    this.dates = [
      this.fromDate,
      this.toDate
    ]

    this.refresh()
  },
  head () {
    return {
      title: 'Customer Spending Report'
    }
  },
  methods: {
    changePage (page) {
      this.page = page
      this.refresh()
    },
    update (event) {
      // this.fromDate = event.start;
      // this.toDate = event.end;
      this.refresh()
    },
    async exportReport () {
      // Get the report we want.
      const from = moment(this.dates[0]).format('YYYY-MM-DD')
      const to = moment(this.dates[1]).format('YYYY-MM-DD')

      await this.$getcandy.on('reports', 'customerSpendingReport', from, to, {
        query: {
          export: 1
        }
      })

      this.$notify.queue('success', 'Report export started. Check your emails')
    },
    async refresh () {
      this.loading = true
      // Get the report we want.
      const from = moment(this.dates[0]).format('YYYY-MM-DD')
      const to = moment(this.dates[1]).format('YYYY-MM-DD')

      const response = await this.$getcandy.on('reports', 'customerSpendingReport', from, to, {
        query: {
          page: this.page
        }
      })
      this.loading = false

      const { data } = response
      this.data = data

      this.$router.push({
        path: this.$route.path,
        query: {
          from,
          to,
          page: this.page
        }
      })

      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
