<template>
  <div class="max-w-8xl mx-auto px-8 3xl:px-0">
    <header class="py-12">
      <div class="flex justify-between">
        <div>
          <h1 class="text-2xl font-medium">{{ storename }}</h1>
        </div>
        <div class="text-right">
          <h4 class="block text-sm">{{ $auth.user.email }}</h4>
          <h6 class="text-sm font-medium">{{ $format.date(undefined, 'dddd, MMMM Do YYYY') }}</h6>
        </div>
      </div>

    </header>

    <!--<h4 class="block">Hello, {{ $auth.user.email }}</h4>
    <h6 >{{ $format.date(undefined, 'dddd, MMMM Do YYYY, h:mma') }}</h6>-->

    <div class="flex">
      <div class="w-1/2 mr-4">
        <div class="flex mb-4">
          <div class="w-1/2 mr-2">
            <div class="flex rounded shadow-md bg-white p-4 items-center">
              <div class="mr-4">
                <i class="ri-bank-card-line text-purple-500 text-xl"></i>
              </div>
              <div class="w-full">
                <span class="font-medium block mb-2 text-sm text-gray-700">{{ $t('Sales today')}}</span>
                <metric-badge  :top="parseInt(salesMetrics.today)" :bottom="parseInt(salesMetrics.yesterday)" :money="true" v-if="!loadingSalesMetrics" />
                <b-icon icon="loader-4-line" class="spin" v-else />
              </div>
            </div>
          </div>
          <div class="w-1/2 ml-2">
            <div class="flex rounded shadow-md bg-white p-4 items-center">
              <div class="mr-4">
                <i class="ri-bank-card-line text-purple-500 text-xl"></i>
              </div>
              <div class="w-full">
                <span class="font-medium block mb-2 text-sm text-gray-700">{{ $t('Sales this week')}}</span>
                <metric-badge :top="parseInt(salesMetrics.current_week)" :bottom="parseInt(salesMetrics.previous_week)" :money="true" v-if="!loadingSalesMetrics" />
                <b-icon icon="loader-4-line" class="spin" v-else />
              </div>
            </div>
          </div>
        </div>
        <div class="flex mb-4">
          <div class="w-1/2 mr-2">
            <div class="flex rounded shadow-md bg-white p-4  items-center">
              <div class="mr-4">
                <i class="ri-bank-card-line text-purple-500 text-xl"></i>
              </div>
              <div class="w-full">
                <span class="font-medium block mb-2 text-sm text-gray-700">{{ $t('Sales this month')}}</span>
                <metric-badge :top="parseInt(salesMetrics.current_month)" :bottom="parseInt(salesMetrics.previous_month)" :money="true" v-if="!loadingSalesMetrics" />
                <b-icon icon="loader-4-line" class="spin" v-else />
              </div>
            </div>
          </div>
          <div class="w-1/2 ml-2">
            <div class="flex rounded shadow-md bg-white p-4 items-center">
              <div class="mr-4">
                <i class="ri-shopping-cart-line text-purple-500 text-xl"></i>
              </div>
              <div class="w-full">
                <span class="font-medium block mb-2 text-sm text-gray-700">{{ $t('Orders today')}}</span>
                <metric-badge :top="parseInt(orderMetrics.today)" :bottom="parseInt(orderMetrics.yesterday)" v-if="!loadingOrderMetrics" />
                <b-icon icon="loader-4-line" class="spin" v-else />
              </div>
            </div>
          </div>
        </div>

        <div class="flex mb-6">
          <div class="w-1/2 mr-2">
            <div class="flex rounded shadow-md bg-white p-4  items-center">
              <div class="mr-4">
                <i class="ri-shopping-cart-line text-purple-500 text-xl"></i>
              </div>
              <div class="w-full">
                <span class="font-medium block mb-2 text-sm text-gray-700">{{ $t('Orders this week')}}</span>
                <metric-badge :top="parseInt(orderMetrics.current_week)" :bottom="parseInt(orderMetrics.previous_week)" v-if="!loadingOrderMetrics" />
                <b-icon icon="loader-4-line" class="spin" v-else />
              </div>
            </div>
          </div>
          <div class="w-1/2 ml-2">
            <div class="flex rounded shadow-md bg-white p-4  items-center">
              <div class="mr-4">
                <i class="ri-shopping-cart-line text-purple-500 text-xl"></i>
              </div>
              <div class="w-full">
                <span class="font-medium block mb-2 text-sm text-gray-700">{{ $t('Orders this month')}}</span>
                <metric-badge :top="parseInt(orderMetrics.current_month)" :bottom="parseInt(orderMetrics.previous_month)" v-if="!loadingOrderMetrics" />
                <b-icon icon="loader-4-line" class="spin" v-else />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-md rounded p-6">
          <div class="flex mb-4 justify-between items-center">
            <div>
              <h3 class="font-medium">Order totals for past year</h3>
            </div>
            <div>
              <nuxt-link :to="{
                name: 'reports.orders',
              }" class="bg-gray-300 text-gray-700 text-xs py-2 px-3 font-medium rounded hover:bg-gray-400"
              >See full report</nuxt-link>

            </div>
          </div>
          <orders-report
            :show-controls="false"
            :show-graph="true"
            :to="orderToDate"
            initial-style="line"
            :from="orderReportFromDate"
            mode="monthly"
          >
          </orders-report>
        </div>
      </div>
      <div class="w-1/2 ml-2">
        <div class="bg-white shadow-md rounded p-6">
          <div class="flex mb-4 justify-between items-center">
            <div>
              <h3 class="font-medium">{{ $t('Orders / Sales Report') }}</h3>
            </div>
            <div>
              <nuxt-link :to="{
                name: 'reports.sales',
              }" class="bg-gray-300 text-gray-700 text-xs py-2 px-3 font-medium rounded hover:bg-gray-400"
              >See full report</nuxt-link>

            </div>
          </div>
          <sales-report :show-controls="false" :to="orderToDate" initial-style="line" :from="orderFromDate" mode="monthly" />
        </div>
        <div class="bg-white shadow-md mt-4 rounded p-6">
          <div class="flex mb-4 justify-between items-center">
            <div>
              <h3 class="font-medium">{{ $t('Average order value') }}</h3>
            </div>
            <div>
              <nuxt-link :to="{
                name: 'reports.orders.avg-order-value',
              }" class="bg-gray-300 text-gray-700 text-xs py-2 px-3 font-medium rounded hover:bg-gray-400"
              >See full report</nuxt-link>
            </div>
          </div>
          <order-average-report :show-controls="false" :show-graph="false" :to="orderToDate" initial-style="line" :from="orderFromDate" mode="monthly" />
        </div>
        <div class="bg-white mt-6 shadow-md rounded p-6">
          <div class="flex mb-4 justify-between items-center">
            <div>
              <h3 class="font-medium">{{ $t('New Vs Returning Customers') }}</h3>
            </div>
            <div>
              <nuxt-link :to="{
                name: 'reports.customers.new-vs-returning',
              }" class="bg-gray-300 text-gray-700 text-xs py-2 px-3 font-medium rounded hover:bg-gray-400"
              >See full report</nuxt-link>
            </div>
          </div>
          <customer-report :show-table="false" />

        </div>
      </div>
    </div>
    <div class="bg-white shadow-md mt-4 rounded p-6">
      <div class="flex mb-4 justify-between items-center">
        <div>
          <h3 class="font-medium">{{ $t('This months best sellers') }}</h3>
          <p class="text-gray-600 mb-4 text-xs">{{ $t('These figures are based on the number of times a product appears on an order, not the quantity ordered.') }}</p>
        </div>
        <div>
          <nuxt-link :to="{
            name: 'reports.products.best-sellers',
          }" class="bg-gray-300 text-gray-700 text-xs py-2 px-3 font-medium rounded hover:bg-gray-400"
          >See full report</nuxt-link>
        </div>
      </div>

      <best-sellers-report
        :from="bestSellersFromDate"
        :show-controls="false"
        :to="bestSellersToDate"
      />
    </div>
    <!--<div class="p-6">
      <div class="flex">
        <div>

        </div>
        <div>
          <div class="w-1/6">
            <span>{{ $t('Sales this week') }}</span>
            <metric-badge :top="0" :bottom="500" :money="true" v-if="!loadingSalesMetrics" />
            <b-loading :is-full-page="false" :active.sync="loadingSalesMetrics" v-else />
          </div>
        </div>
        <div>
          <div class="w-1/6">
            <span>{{ $t('Sales this month') }}</span>
            <metric-badge :top="salesMetrics.current_month" :bottom="salesMetrics.previous_month" :money="true" v-if="!loadingSalesMetrics" />
            <b-loading :is-full-page="false" :active.sync="loadingSalesMetrics" v-else />
          </div>
        </div>
        <div>
          <div class="w-1/6">
            <span>{{ $t('Orders today') }}</span>
            <metric-badge :top="orderMetrics.today" :bottom="orderMetrics.yesterday" v-if="!loadingOrderMetrics" />
            <b-loading :is-full-page="false" :active.sync="loadingOrderMetrics" v-else />
          </div>
        </div>
        <div>
          <div class="w-1/6">
            <span>{{ $t('Orders this week') }}</span>
            <metric-badge :top="orderMetrics.current_week" :bottom="orderMetrics.previous_week" v-if="!loadingOrderMetrics" />
            <b-loading :is-full-page="false" :active.sync="loadingOrderMetrics" v-else />
          </div>
        </div>
        <div>
          <div >
            <span>{{ $t('Orders this month') }}</span>
            <metric-badge :top="orderMetrics.current_month" :bottom="orderMetrics.previous_month" v-if="!loadingOrderMetrics" />
            <b-loading :is-full-page="false" :active.sync="loadingOrderMetrics" v-else />
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
  import MetricBadge from '../components/MetricBadge.vue'
  import OrdersReport from '../components/OrdersReport.vue'
  import SalesReport from '../components/SalesReport.vue'
  import CustomerReport from '../components/CustomerReport.vue'
  import OrderAverageReport from '../components/OrderAverageReport.vue'
  import BestSellersReport from '../components/BestSellersReport.vue'
  import moment from 'moment'

  export default {
    components: {
      MetricBadge,
      OrdersReport,
      SalesReport,
      CustomerReport,
      OrderAverageReport,
      BestSellersReport
    },
    data () {
      return {
        loadingOrderMetrics: true,
        loadingSalesMetrics: true,
        orderMetrics: () => {},
        salesMetrics: () => {},
        orderFromDate: null,
        orderReportFromDate: null,
        bestSellersFromDate: null,
        bestSellersToDate: null,
        orderToDate: null,
      }
    },
    mounted () {
      this.orderFromDate = moment().subtract(6, 'months')
      this.bestSellersFromDate = moment().startOf('month')
      this.bestSellersToDate = moment()
      this.orderReportFromDate = moment().subtract(12, 'months')
      this.orderToDate = moment()
      this.$gc.reports.metrics('orders').then((response) => {
        this.loadingOrderMetrics = false;
        this.orderMetrics = response.data
      })
      this.$gc.reports.metrics('sales').then((response) => {
        this.loadingSalesMetrics = false;
        this.salesMetrics = response.data
      })
    },
    computed: {
      storename() {
        return this.$config.storename || 'GetCandy Store'
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "~bulma/sass/utilities/_all";
.top-metrics {
  margin-bottom:20px;
  padding-bottom:20px;
  border-bottom: 1px solid #EEEEEE;
}
.metric-box {
  background-color: #fff;
  position:relative;
  padding: 10px 20px;
  box-shadow: 0 5px 5px -5px $grey-lighter;
  border-radius:5px;
  &__label {
    font-size: $size-small;
    font-weight: $weight-medium;
    text-transform:uppercase;
    color: $grey-light;
  }
  &__value {
    font-weight: $weight-medium;
    font-size: $size-medium;
  }
}
</style>
