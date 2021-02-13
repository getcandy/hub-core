<template>
  <!-- <b-input
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
    <input :value="formattedValue" @blur="input" class="block w-full pr-12 form-input pl-7 sm:text-sm sm:leading-5" placeholder="0.00" aria-describedby="price-currency" />
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <span class="text-gray-500 sm:text-sm sm:leading-5" id="price-currency">
        {{ currency.code }}
      </span>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import HasCurrencies from '@getcandy/hub-core/src/mixins/HasCurrencies.js'
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
      this.$emit('input', this.isCents ? event.target.value * 100 : event.target.value)
    }
  },
  computed: {
    formattedValue () {
      return this.$format.currency(this.value, this.currency, this.isCents, false)
    }
  }
}
</script>
