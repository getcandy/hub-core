<template>
  <div>
    <b-field>
      <gc-input
        :value="formattedValue"
        @input="input"
        type="number"
        step="any"
      />
    </b-field>
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
  methods: {
    input (val) {
      this.$emit('input', val * 100)
    }
  },
  computed: {
    formattedValue () {
      return this.$format.currency(this.value, null, true, false)
    }
  }
}
</script>
