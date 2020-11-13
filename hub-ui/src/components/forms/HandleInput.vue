<template>
  <b-input :value="value" @input="sanitize" />
</template>

<script>
  const snakeCase = require('lodash/snakeCase')

  export default {
    props: ['value'],
    methods: {
      sanitize (value) {
        const sanitized = snakeCase(value);

        this.$emit('input', sanitized)
        this.$emit('raw', value)
      }
    },
  }
</script>
