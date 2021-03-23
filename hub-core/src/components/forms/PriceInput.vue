<template>
  <div class="relative mt-1 rounded-md shadow-sm">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <span class="text-gray-500 sm:text-sm sm:leading-5">
        {{ currency.format.replace('{price}', '') }}
      </span>
    </div>
    <input :value="formattedValue" class="block w-full pr-12 form-input pl-7 sm:text-sm sm:leading-5" placeholder="0.00" aria-describedby="price-currency" @blur="input">
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
