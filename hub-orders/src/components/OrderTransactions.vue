<template>
  <div class="p-6">
    <div class="mb-4">
      <create-transaction @created="handleTransactionCreated" :order-id="orderId" :initial-amount="remaining" />
    </div>
    <div
      v-for="t in records"
      :key="t.id"
      class="mb-2 overflow-hidden border rounded shadow-sm"
      :class="{
        'border-green-200': t.success,
        'border-red-200':  !t.success,
      }"
    >
      <div
        :class="{
          'bg-green-100 border-green-200': t.success,
          'bg-red-100 border-red-200':  !t.success,
        }"
        class="flex items-center justify-between px-4 py-2 text-xs border-b"
      >
        <div
          :class="{
            'text-green-700': t.success,
            'text-red-700':  !t.success,
          }"
          class="font-bold"
        >
          <span class="px-2 py-1 mr-2 text-xs rounded-md" :class="t.success ? 'bg-green-200' : 'bg-red-200'">{{ $t(t.success ? 'Success' : 'Failed') }}</span> {{ $t(t.refund ? 'Refund' : 'Charge') }} - {{ t.status }} {{ t.notes }}
        </div>

        <div>
          {{ t.merchant }} / {{ t.provider }}
        </div>
      </div>
      <div class="flex items-center justify-between px-4 py-4 text-sm">
        <div class="mr-4 text-3xl">
           {{ $format.currency(t.amount) }}
        </div>
        <div>
          <h3 class="font-medium">{{ t.transaction_id }}</h3>
          <span class="text-gray-500">{{ $format.date(t.created_at) }}</span>
        </div>
        <div class="ml-8">
          <div class="flex items-center font-medium text-md">
            <template v-if="t.last_four">
              <div class="mr-2">
                <div class="flex items-center">
                  <i class="ri-asterisk" v-for="i in 4" :key="i" />
                </div>
              </div>
              <div class="mr-2">
                <div class="flex items-center">
                  <i class="ri-asterisk" v-for="i in 4" :key="i" />
                </div>
              </div>
              <div class="mr-2">
                <div class="flex items-center">
                  <i class="ri-asterisk" v-for="i in 4" :key="i" />
                </div>
              </div>
              <div>{{ t.last_four }}</div>
            </template>
          </div>
          <div :class="{ 'text-gray-500' : !!t.last_four }">
            {{ t.card_type }}
          </div>
        </div>
        <div>
          <refund-transaction v-if="canRefund(t) && !t.manual" @success="handleRefund" :initial="t.amount / 100" :reference="t.transaction_id" :max="maxRefund / 100" :id="t.id" />
        </div>
      </div>
      <div class="p-4 text-xs border-t rounded-b">
        <div class="flex">
          <span class="flex items-center px-3 py-1 mr-2 font-medium rounded" :class="{'bg-blue-100 text-blue-700': t.cvc_matched, 'bg-gray-100 text-gray-500': !t.cvc_matched}">
            <i class="mr-1" :class="`ri-${t.cvc_matched ? 'check-line' : 'close-line'}`" />
            {{ $t('CVC') }}
          </span>
          <span class="flex items-center px-3 py-1 mr-2 font-medium rounded" :class="{'bg-blue-100 text-blue-700': t.address_matched, 'bg-gray-100 text-gray-500': !t.address_matched}">
            <i class="mr-1" :class="`ri-${t.address_matched ? 'check-line' : 'close-line'}`" />
            {{ $t('Address') }}
          </span>
          <span class="flex items-center px-3 py-1 mr-2 font-medium rounded" :class="{'bg-blue-100 text-blue-700': t.postcode_matched, 'bg-gray-100 text-gray-500': !t.postcode_matched}">
            <i class="mr-1" :class="`ri-${t.postcode_matched ? 'check-line' : 'close-line'}`" />
            {{ $t('Postcode') }}
          </span>
          <span class="flex items-center px-3 py-1 font-medium rounded" :class="{'bg-blue-100 text-blue-700': t.threed_secure, 'bg-gray-100 text-gray-500': !t.threed_secure}">
            <i class="mr-1" :class="`ri-${t.threed_secure ? 'check-line' : 'close-line'}`" />
            {{ $t('ThreeD Secure') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const each = require('lodash/each')
  import RefundTransaction from './RefundTransaction.vue'
  import CreateTransaction from './CreateTransaction.vue'

  export default {
    components: {
      RefundTransaction,
      CreateTransaction
    },
    data () {
      return {
        records: []
      }
    },
    props: {
      orderId: {
        type: String,
        required: true
      },
      orderTotal: {
        type: [String, Number],
        default: 0
      },
      currency: {
        type: Object,
        default: () => {}
      },
      transactions: {
        type: Array,
        default() {
          return []
        }
      }
    },
    mounted () {
      this.records = this.transactions || []
    },
    computed: {
      remaining () {
        let transactionTotal = 0;
        each(this.transactions, item => {
          if (item.success) {
            transactionTotal += item.amount;
          }
        });
        return this.orderTotal - transactionTotal;
      },
      maxRefund() {
        let transactions = 0;
        each(this.transactions, item => {
          if (item.success) {
            transactions += item.amount;
          }
        });
        return transactions;
      },
    },
    methods: {
      handleTransactionCreated (transaction) {
        this.records.push(transaction)
      },
      handleRefund (transaction) {
        this.$emit('refunded', transaction)
      },
      canRefund(transaction) {
        return this.maxRefund &&
          !transaction.refund &&
          transaction.success;
      },
    }
  }
</script>

<style scoped>

</style>
