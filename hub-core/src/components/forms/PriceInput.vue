<template>
  <!-- <b-input
    :value="formattedValue"
    @input="input"
    type="number"
    step="any"
  /> -->
  <div class="mt-1 relative rounded-md shadow-sm">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <span class="text-gray-500 sm:text-sm sm:leading-5">
        {{ currency.format.replace('{price}', '') }}
      </span>
    </div>
    <input :value="formattedValue" class="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5" placeholder="0.00" aria-describedby="price-currency" @blur="input">
    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
      <span id="price-currency" class="text-gray-500 sm:text-sm sm:leading-5">
        {{ currency.code }}
      </span>
    </div>
  </div>
</template>

<script>
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
  computed: {
    formattedValue () {
      return this.$format.currency(this.value, null, this.isCents, false)
    }
  },
  methods: {
    input (event) {
      this.$emit('input', this.isCents ? event.target.value * 100 : event.target.value)
    }
  }
}
</script>
