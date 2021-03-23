<template>
  <div>
    <gc-input
      :value="formattedValue"
      type="number"
      step="any"
      @input="input"
    />
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
    }
  },
  computed: {
    formattedValue () {
      return this.$format.currency(this.value, null, true, false)
    }
  },
  methods: {
    input (val) {
      this.$emit('input', val * 100)
    }
  }
}
</script>
