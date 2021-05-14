<template>
  <div>
    <order-details :order="order" :settings="settings" @statusUpdate="handleStatusUpdate" />

    <div class="px-6 border-b border-gray-200">
      <nav class="flex -mb-px">
        <button
          type="button"
          :class="{
            'border-indigo-500 text-indigo-600': view == 'order-lines',
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300': view != 'order-lines'
          }"
          class="px-4 py-4 text-sm font-medium leading-5 whitespace-no-wrap border-b-2 focus:outline-none"
          @click="view = 'order-lines'"
        >
          {{ $t('Order Lines') }} ({{ order.lines.data.length }})
        </button>
        <button
          type="button"
          :class="{
            'border-indigo-500 text-indigo-600': view == 'transactions',
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300': view != 'transactions'
          }"
          class="px-4 py-4 text-sm font-medium leading-5 whitespace-no-wrap border-b-2 focus:outline-none"
          @click="view = 'transactions'"
        >
          {{ $t('Transactions') }} <span>({{ transactions.length }})</span>
        </button>
        <button
          type="button"
          :class="{
            'border-indigo-500 text-indigo-600': view == 'history',
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300': view != 'history'
          }"
          class="px-4 py-4 text-sm font-medium leading-5 whitespace-no-wrap border-b-2 focus:outline-none"
          @click="view = 'history'"
        >
          {{ $t('History') }}
        </button>
        <button
          v-for="(tab, tabKey) in additionalTabs"
          :key="tabKey"
          type="button"
          :class="{
            'border-indigo-500 text-indigo-600': view == tab.view,
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300': view != tab.view
          }"
          class="px-4 py-4 text-sm font-medium leading-5 whitespace-no-wrap border-b-2 focus:outline-none"
          @click="view = tab.view"
        >
          {{ $t(tab.label) }}
        </button>
      </nav>
    </div>
    <div class="bg-white">
      <order-lines v-show="view == 'order-lines'" :currency="currency" :order="order" />
      <order-transactions v-show="view == 'transactions'" :currency="currency" :order-total="order.order_total" :order-id="order.id" :transactions="transactions" @refunded="handleRefund" />
      <order-history :order-id="order.id" v-show="view === 'history'"/>
      <component :is="tab.component" v-for="(tab, tabKey) in additionalTabs" v-show="view == tab.view" :key="tabKey" :order="order" />
    </div>
  </div>
</template>

<script>
import OrderLines from '../components/OrderLines.vue'
import OrderDetails from '../components/OrderDetails.vue'
import OrderTransactions from '../components/OrderTransactions.vue'
import OrderHistory from '../components/OrderHistory.vue'
const find = require('lodash/find')

export default {
  components: {
    OrderLines,
    OrderDetails,
    OrderTransactions,
    OrderHistory
  },
  props: {
    settings: {
      type: Object,
      required: true
    },
    order: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      view: 'order-lines',
      additionalTabs: []
    }
  },
  computed: {
    transactions () {
      return this.order.transactions.data
    },
    currencies () {
      return this.$store.state.core.currencies
    },
    currency () {
      const currency = find(this.currencies, (item) => {
        return item.code == this.order.currency
      })
    }
  },
  async mounted () {
    await this.$nuxt.context.app.$hooks.callHook('order.view.tabs', this.additionalTabs)
  },
  methods: {
    handleStatusUpdate (status) {
      this.$emit('statusUpdate', status)
    },
    handleRefund (transaction) {
      this.order.transactions.data.unshift(transaction)
    }
  }
}
</script>

<style scoped>

</style>
