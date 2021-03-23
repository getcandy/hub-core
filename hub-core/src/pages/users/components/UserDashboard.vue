<template>
  <div>
    <div v-show="loading" class="flex h-full p-12">
      <div class="flex items-center text-gray-400">
        <loading-spinner /><span class="ml-2 text-sm font-medium uppercase"> Loading Report</span>
      </div>
    </div>
    <div v-if="!loading" class="px-6 pt-6">
      <div class="grid grid-cols-3 gap-4 grid-gap-3">
        <div class="flex items-center p-4 bg-white rounded shadow">
          <div class="mr-4">
            <gc-icon icon="shopping-cart" />
          </div>
          <div class="w-full">
            <span class="block mb-2 text-sm font-medium text-gray-700">{{ $t('No. of orders processed') }}</span>
            <metric-badge :top="metrics.order_count" :loading="false" />
          </div>
        </div>
        <div class="flex items-center p-4 bg-white rounded shadow">
          <div class="mr-4">
            <gc-icon icon="credit-card" />
          </div>
          <div class="w-full">
            <span class="block mb-2 text-sm font-medium text-gray-700">{{ $t('Total lifetime spend (Excl. Tax)') }}</span>
            <metric-badge :top="metrics.sub_total" :loading="false" :money="true" />
          </div>
        </div>
        <div class="flex items-center p-4 bg-white rounded shadow">
          <div class="mr-4">
            <gc-icon icon="credit-card" />
          </div>
          <div class="w-full">
            <span class="block mb-2 text-sm font-medium text-gray-700">{{ $t('Total Discount Claimed (Excl. Tax)') }}</span>
            <metric-badge :top="metrics.discount_total" :loading="false" :money="true" />
          </div>
        </div>
      </div>
      <div class="mt-6">
        <header class="mb-4">
          <strong>{{ $t('Spending over the past year') }}</strong>
        </header>
        <user-spending :user-id="userId" :data="data.spending ? data.spending.data : {}" :period="data.period || []" />
      </div>
    </div>
    <div class="mt-8">
      <purchase-history :products="data.purchasing_report ? data.purchasing_report.data : []" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import MetricBadge from '@getcandy/hub-orders/src/components/MetricBadge'
import UserSpending from './UserSpending'
import PurchaseHistory from './PurchaseHistory'

const get = require('lodash/get')

export default {
  components: {
    UserSpending,
    PurchaseHistory,
    MetricBadge
  },
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      data: {},
      fromDate: this.from,
      toDate: this.to,
      viewMode: this.mode,
      style: this.initialStyle
    }
  },
  computed: {
    metrics () {
      return get(this.data, 'metrics.data', {})
    }
  },
  mounted () {
    if (!this.fromDate || !this.toDate) {
      const date = new Date()
      this.fromDate = new Date(date.setMonth(date.getMonth() - 12))
      this.toDate = new Date()
    } else {
      this.fromDate = this.from
      this.toDate = this.to
    }

    this.dates = [
      this.fromDate,
      this.toDate
    ]
    this.refresh()
  },
  methods: {
    update (event) {
      // this.fromDate = event.start;
      // this.toDate = event.end;
      this.refresh()
    },
    async refresh () {
      this.loading = true
      // Get the report we want.
      const { data } = await this.$getcandy.on('reports', 'userReport', this.userId, moment(this.dates[0]).format('YYYY-MM-DD'), moment(this.dates[1]).format('YYYY-MM-DD'))
      this.data = data
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
