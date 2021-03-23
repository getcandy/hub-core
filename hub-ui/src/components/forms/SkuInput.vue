<template>
  <div>
    <gc-input :value="value" @input="update" />
  </div>
</template>

<script>
const kebabCase = require('lodash/kebabCase')

export default {
  props: {
    value: {
      type: String,
    }
  },
  methods: {
    update (value) {
      this.$emit('input', kebabCase(value.trim()))
    }
  }
}
</script>
