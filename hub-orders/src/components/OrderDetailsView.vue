<template>
  <div>

      <order-details @statusUpdate="handleStatusUpdate" :order="order" :settings="settings" />

      <div class="border-b border-gray-200 px-6">
        <nav class="-mb-px flex">
          <button
            type="button"
            @click="view = 'order-lines'"
            :class="{
              'border-indigo-500 text-indigo-600': view == 'order-lines',
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300': view != 'order-lines'
            }"
            class="whitespace-no-wrap py-4 px-4 border-b-2 font-medium text-sm leading-5  focus:outline-none"
          >
            {{ $t('Order Lines') }} ({{ order.lines.data.length }})
          </button>
          <button
            type="button"
            @click="view = 'transactions'"
            :class="{
              'border-indigo-500 text-indigo-600': view == 'transactions',
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300': view != 'transactions'
            }"
            class="whitespace-no-wrap py-4 px-4 border-b-2 font-medium text-sm leading-5  focus:outline-none"
          >
            {{ $t('Transactions') }} <span>({{ transactions.length }})</span>
          </button>
          <button
            type="button"
            @click="view = 'history'"
            :class="{
              'border-indigo-500 text-indigo-600': view == 'history',
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300': view != 'history'
            }"
            class="whitespace-no-wrap py-4 px-4 border-b-2 font-medium text-sm leading-5 focus:outline-none"
          >
            {{ $t('History') }}
          </button>
        </nav>
      </div>
      <div class="bg-white">
        <order-lines :currency="currency" :order="order" v-show="view == 'order-lines'" />
        <order-transactions :currency="currency" :transactions="transactions" v-show="view == 'transactions'" />
        <activity-log type="order" :id="order.id" v-show="view == 'history'" />
      </div>



  </div>
</template>

<script>
  const find = require('lodash/find')
  import OrderLines from '../components/OrderLines.vue'
  import OrderDetails from '../components/OrderDetails.vue'
  import OrderTransactions from '../components/OrderTransactions.vue'


  export default {
    components: {
      OrderLines,
      OrderDetails,
      OrderTransactions,
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
    data() {
      return {
        view: 'order-lines'
      }
    },
    methods: {
      handleStatusUpdate (status) {
        this.$emit('statusUpdate', status)
      }
    },
    computed: {
      transactions() {
        return this.order.transactions.data
      },
      currencies() {
        return this.$store.state.core.currencies
      },
      currency () {
        const currency = find(this.currencies, item => {
          return item.code == this.order.currency;
        })
      }
    }
  }
</script>

<style scoped>

</style>
