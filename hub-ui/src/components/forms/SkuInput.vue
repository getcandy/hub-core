<template>
  <div>
    <gc-input v-model="text" @input="update" />
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
  data () {
    return {
      text: null
    }
  },
  methods: {
    update () {
      this.text = kebabCase(this.text)
      this.$emit('input', this.text)
    }
  }
}
</script>
