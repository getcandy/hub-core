<template>
  <gc-input :value="value" @input="sanitize" />
</template>

<script>
const snakeCase = require('lodash/snakeCase')

export default {
  props: {
    value: {
      type: null,
      required: true
    }
  },
  methods: {
    sanitize (value) {
      const sanitized = snakeCase(value)

      this.$emit('input', sanitized)
      this.$emit('raw', value)
    }
  }
}
</script>
