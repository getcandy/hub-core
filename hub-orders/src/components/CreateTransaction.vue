<template>
  <div>
    <gc-button @click="showCreatePanel = true">Create Transaction</gc-button>
    <quick-view-panel :open="showCreatePanel" heading="Create transaction" @close="showCreatePanel = false">
      <form @submit.prevent="createTransaction" class="p-4">
        <gc-form-field label="Amount" required :error="getFirstFormError('amount')">
          <gc-price-input v-model="amount" :is-cents="false" />
        </gc-form-field>
        <gc-form-field label="Refund">
          <gc-toggle v-model="refund" />
        </gc-form-field>
        <gc-form-field label="Type" v-if="!refund" :error="getFirstFormError('merchant')">
          <gc-select-input v-model="merchant">
            <option value="card">Card Payment</option>
            <option value="bank-transfer">Bank Transfer</option>
          </gc-select-input>
        </gc-form-field>
        <gc-form-field label="Card Type" v-if="merchant === 'card'" :error="getFirstFormError('card_type')">
          <gc-select-input v-model="cardType">
            <option value="American Express">American Express</option>
            <option value="Maestro">Maestro</option>
            <option value="MasterCard">MasterCard</option>
            <option value="Visa">Visa</option>
            <option value="Unknown">Unknown</option>
          </gc-select-input>
        </gc-form-field>
        <gc-form-field label="Last four card digits" v-if="merchant === 'card'" :error="getFirstFormError('last_four')">
          <gc-input type="number" v-model="lastFour" />
        </gc-form-field>
        <gc-button type="submit">Create Transaction</gc-button>
      </form>
    </quick-view-panel>
  </div>
</template>

<script>
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'

export default {
  mixins: [
    HandlesForms
  ],
  props: {
    initialAmount: {
      type: [String, Number],
      default: 0,
    },
    orderId: {
      type: String,
      required: true,
    }
  },
  mounted () {
    this.amount = this.initialAmount / 100
  },
  data () {
    return {
      showCreatePanel: false,
      amount: 0,
      refund: false,
      merchant: 'card',
      cardType: 'Visa',
      lastFour: null
    }
  },
  methods: {
    async createTransaction () {
      try {
        const response = await this.$axios.post('transactions', {
          order_id: this.orderId,
          amount: this.amount * 100,
          refund: this.refund,
          merchant: this.merchant,
          last_four: this.lastFour,
          manual: true,
          status: 'complete',
          card_type: this.cardType,
          driver: 'offline',
          success: true,
        })
        this.$emit('created', response.data.data)
        this.$notify.queue('success', this.$t('Transaction created'))
        this.showCreatePanel = false
      } catch (error) {
        if (error.response) {
          this.setFormErrors(error.response.data.errors)
        }
        this.$notify.queue('error', this.$t('Unable to create transaction'))
      }
    }
  }
}
</script>
