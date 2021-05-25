<template>
  <div class="px-8 mx-auto max-w-8xl 3xl:px-0">
    <header class="py-12">
      <h1 class="text-2xl font-medium">
        {{ storename }}
      </h1>
    </header>

    <!--<h4 class="block">Hello, {{ $auth.user.email }}</h4>
    <h6 >{{ $format.date(undefined, 'dddd, MMMM Do YYYY, h:mma') }}</h6>-->

    <div class="flex">
      <div class="w-1/2 mr-4">
        <div class="flex mb-4">
          <div class="w-1/2 mr-2">
            <div class="flex items-center p-4 bg-white rounded shadow-md">
              <div class="mr-4">
                <gc-icon icon="credit-card" class="text-gray-600" />
                <!-- <i class="text-xl text-purple-500 ri-bank-card-line" /> -->
              </div>
              <div class="w-full">
                <span class="block mb-2 text-sm font-medium text-gray-700">{{ $t('Sales today') }}</span>
                <metric-badge :top="parseInt(salesMetrics.today)" :bottom="parseInt(salesMetrics.yesterday)" :money="true" :loading="loadingSalesMetrics" />
              </div>
            </div>
          </div>
          <div class="w-1/2 ml-2">
            <div class="flex items-center p-4 bg-white rounded shadow-md">
              <div class="mr-4">
                <gc-icon icon="credit-card" class="text-gray-600" />
                <!-- <i class="text-xl text-purple-500 ri-bank-card-line" /> -->
              </div>
              <div class="w-full">
                <span class="block mb-2 text-sm font-medium text-gray-700">{{ $t('Sales this week') }}</span>
                <metric-badge :top="parseInt(salesMetrics.current_week)" :bottom="parseInt(salesMetrics.previous_week)" :money="true" :loading="loadingSalesMetrics" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex mb-4">
          <div class="w-1/2 mr-2">
            <div class="flex items-center p-4 bg-white rounded shadow-md">
              <div class="mr-4">
                <gc-icon icon="credit-card" class="text-gray-600" />
                <!-- <i class="text-xl text-purple-500 ri-bank-card-line" /> -->
              </div>
              <div class="w-full">
                <span class="block mb-2 text-sm font-medium text-gray-700">{{ $t('Sales this month') }}</span>
                <metric-badge :top="parseInt(salesMetrics.current_month)" :bottom="parseInt(salesMetrics.previous_month)" :money="true" :loading="loadingSalesMetrics" />
              </div>
            </div>
          </div>
          <div class="w-1/2 ml-2">
            <div class="flex items-center p-4 bg-white rounded shadow-md">
              <div class="mr-4">
                <gc-icon icon="shopping-cart" class="text-gray-600" />
                <!-- <i class="text-xl text-purple-500 ri-shopping-cart-line" /> -->
              </div>
              <div class="w-full">
                <span class="block mb-2 text-sm font-medium text-gray-700">{{ $t('Orders today') }}</span>
                <metric-badge :top="parseInt(orderMetrics.today)" :bottom="parseInt(orderMetrics.yesterday)" :loading="loadingOrderMetrics" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex mb-6">
          <div class="w-1/2 mr-2">
            <div class="flex items-center p-4 bg-white rounded shadow-md">
              <div class="mr-4">
                <gc-icon icon="shopping-cart" class="text-gray-600" />
                <!-- <i class="text-xl text-purple-500 ri-shopping-cart-line" /> -->
              </div>
              <div class="w-full">
                <span class="block mb-2 text-sm font-medium text-gray-700">{{ $t('Orders this week') }}</span>
                <metric-badge :top="parseInt(orderMetrics.current_week)" :bottom="parseInt(orderMetrics.previous_week)" :loading="loadingOrderMetrics" />
              </div>
            </div>
          </div>
          <div class="w-1/2 ml-2">
            <div class="flex items-center p-4 bg-white rounded shadow-md">
              <div class="mr-4">
                <gc-icon icon="shopping-cart" class="text-gray-600" />
                <!-- <i class="text-xl text-purple-500 ri-shopping-cart-line" /> -->
              </div>
              <div class="w-full">
                <span class="block mb-2 text-sm font-medium text-gray-700">{{ $t('Orders this month') }}</span>
                <metric-badge :top="parseInt(orderMetrics.current_month)" :bottom="parseInt(orderMetrics.previous_month)" :loading="loadingOrderMetrics" />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded shadow-md">
          <div class="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <strong class="text-sm font-medium">
                {{ $t('Order totals for the past year') }}
              </strong>
            </div>
            <div>
              <nuxt-link
                :to="{
                  name: 'reports.orders',
                }"
                class="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                See full report
              </nuxt-link>
            </div>
          </div>
          <orders-report
            :show-controls="false"
            :show-graph="true"
            :to="orderToDate"
            initial-style="bar"
            :from="orderReportFromDate"
            mode="monthly"
          />
        </div>
      </div>
      <div class="w-1/2 ml-2">
        <div class="bg-white rounded shadow-md">
          <div class="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <strong class="text-sm font-medium">
                {{ $t('Orders / Sales Report') }}
              </strong>
            </div>
            <div>
              <nuxt-link
                :to="{
                  name: 'reports.sales',
                }"
                class="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                See full report
              </nuxt-link>
            </div>
          </div>
          <div class="p-2">
            <sales-report :show-controls="false" :to="orderToDate" initial-style="bar" :from="orderFromDate" mode="monthly" />
          </div>
        </div>
        <div class="mt-4 bg-white rounded shadow-md">
          <div class="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <strong class="text-sm font-medium">
                {{ $t('Average order value') }}
              </strong>
            </div>
            <div>
              <nuxt-link
                :to="{
                  name: 'reports.orders.avg-order-value',
                }"
                class="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                See full report
              </nuxt-link>
            </div>
          </div>
          <order-average-report
            :show-controls="false"
            :show-graph="false"
            :to="orderToDate"
            initial-style="bar"
            :from="orderFromDate"
            mode="monthly"
          />
        </div>
        <div class="mt-4 bg-white rounded shadow-md">
          <div class="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <strong class="text-sm font-medium">
                {{ $t('New Vs Returning Customers') }}
              </strong>
            </div>
            <div>
              <nuxt-link
                :to="{
                  name: 'reports.customers.new-vs-returning',
                }"
                class="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                See full report
              </nuxt-link>
            </div>
          </div>
          <customer-report :show-table="false" />
        </div>
      </div>
    </div>
    <div class="mt-4 bg-white rounded shadow-md">
      <div class="flex items-center justify-between p-4 border-b border-gray-100">
        <div>
          <h3 class="font-medium">
            {{ $t('This months best sellers') }}
          </h3>
          <p class="text-xs text-gray-600">
            {{ $t('These figures are based on the number of times a product appears on an order, not the quantity ordered.') }}
          </p>
        </div>
        <div>
          <nuxt-link
            :to="{
              name: 'reports.products.best-sellers',
            }"
            class="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
          >
            See full report
          </nuxt-link>
        </div>
      </div>
      <best-sellers-report
        :use-query-string="false"
        :from="bestSellersFromDate"
        :show-controls="false"
        :to="bestSellersToDate"
        v-if="bestSellersFromDate && bestSellersToDate"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import MetricBadge from '../components/MetricBadge.vue'
import OrdersReport from '../components/OrdersReport.vue'
import SalesReport from '../components/SalesReport.vue'
import CustomerReport from '../components/CustomerReport.vue'
import OrderAverageReport from '../components/OrderAverageReport.vue'
import BestSellersReport from '../components/BestSellersReport.vue'

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
      orderToDate: null
    }
  },
  computed: {
    storename () {
      return this.$config.storename || 'GetCandy Store'
    }
  },
  mounted () {
    this.orderFromDate = moment().subtract(6, 'months')
    this.bestSellersFromDate = moment().startOf('month')
    this.bestSellersToDate = moment()
    this.orderReportFromDate = moment().subtract(12, 'months')
    this.orderToDate = moment()
    this.$gc.reports.metrics('orders').then((response) => {
      this.loadingOrderMetrics = false
      this.orderMetrics = response.data
    })
    this.$gc.reports.metrics('sales').then((response) => {
      this.loadingSalesMetrics = false
      this.salesMetrics = response.data
    })
  },
  head () {
    return {
      title: this.$t('Dashboard')
    }
  }
}
</script>
