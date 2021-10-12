<template>
  <!-- <gc-input
    :value="formattedValue"
    @input="input"
    type="number"
    step="any"
  /> -->
  <div class="relative mt-1 rounded-md shadow-sm">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <span class="text-gray-500 sm:text-sm sm:leading-5">
        {{ currency.format.replace('{price}', '') }}
      </span>
    </div>
    <input :value="formattedValue" @blur="input" type="number" class="block w-full pl-10 pr-12 form-input sm:text-sm sm:leading-5" step='0.01' placeholder="0.00" aria-describedby="price-currency" />
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <span class="text-gray-500 sm:text-sm sm:leading-5" id="price-currency">
        {{ currency.code }}
      </span>
    </div>
  </div>
</template>

<script>
import HasCurrencies from '@getcandy/hub-core/src/mixins/HasCurrencies.js'
import currency from 'currency.js'

export default {
  mixins: [
    HasCurrencies
  ],
  props: {
    value: {
      type: [Number, String],
      default: null
    },
    isCents: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    input(event) {
      let value = event.target.value
      const unformatted = currency(this.isCents ? value / 100 : value, {
        decimal: this.currency.decimal || this.currency.decimal_point,
        separator: this.currency.thousand_point || ','
      }).value

      this.$emit('input', unformatted)
    }
  },
  computed: {
    formattedValue () {
      return this.$format.currency(this.value, this.currency, this.isCents, false).replace(',', '')
    }
  }
}
</script>
