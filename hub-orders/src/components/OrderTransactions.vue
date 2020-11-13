<template>
  <div class="p-6">
    <div
      v-for="t in transactions"
      :key="t.id"
      class="border rounded overflow-hidden mb-2 shadow-sm"
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
        class="flex justify-between items-center text-xs border-b py-2 px-4"
      >
        <div
          :class="{
            'text-green-700': t.success,
            'text-red-700':  !t.success,
          }"
          class="font-bold"
        >
          <span class="mr-2 text-xs py-1 px-2 rounded-md" :class="t.success ? 'bg-green-200' : 'bg-red-200'">{{ $t(t.success ? 'Success' : 'Failed') }}</span> {{ $t(t.refund ? 'Refund' : 'Charge') }} - {{ t.status }} {{ t.notes }}
        </div>

        <div>
          {{ t.merchant }} / {{ t.provider }}
        </div>
      </div>
      <div class="flex items-center justify-between px-4 py-4 text-sm">
        <div class="text-3xl mr-4">
           {{ $format.currency(t.amount) }}
        </div>
        <div>
          <h3 class="font-medium">{{ t.transaction_id }}</h3>
          <span class="text-gray-500">{{ $format.date(t.created_at) }}</span>
        </div>
        <div class="ml-8">
          <div class="flex items-center text-md font-medium">
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
          <refund-transaction v-if="canRefund(t)" :initial="t.amount / 100" :reference="t.transaction_id" :max="maxRefund / 100" :id="t.id" />
        </div>
      </div>
      <div class="text-xs border-t p-4 rounded-b">
        <div class="flex">
          <span class="flex mr-2 items-center font-medium py-1 px-3 rounded" :class="{'bg-blue-100 text-blue-700': t.cvc_matched, 'bg-gray-100 text-gray-500': !t.cvc_matched}">
            <i class="mr-1" :class="`ri-${t.cvc_matched ? 'check-line' : 'close-line'}`" />
            {{ $t('CVC') }}
          </span>
          <span class="flex mr-2 items-center font-medium py-1 px-3 rounded" :class="{'bg-blue-100 text-blue-700': t.address_matched, 'bg-gray-100 text-gray-500': !t.address_matched}">
            <i class="mr-1" :class="`ri-${t.address_matched ? 'check-line' : 'close-line'}`" />
            {{ $t('Address') }}
          </span>
          <span class="flex mr-2 items-center font-medium py-1 px-3 rounded" :class="{'bg-blue-100 text-blue-700': t.postcode_matched, 'bg-gray-100 text-gray-500': !t.postcode_matched}">
            <i class="mr-1" :class="`ri-${t.postcode_matched ? 'check-line' : 'close-line'}`" />
            {{ $t('Postcode') }}
          </span>
          <span class="flex items-center font-medium py-1 px-3 rounded ":class="{'bg-blue-100 text-blue-700': t.threed_secure, 'bg-gray-100 text-gray-500': !t.threed_secure}">
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

  export default {
    components: {
      RefundTransaction
    },
    props: {
      transactions: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      maxRefund() {
        let transactions = 0;
        each(this.transactions, item => {
          if (item.success) {
            transactions += item.amount;
          }
        });
        return transactions;
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
