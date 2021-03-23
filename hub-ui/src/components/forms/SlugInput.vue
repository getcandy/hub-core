<template>
  <div>
    <gc-input v-model="text" @input="update" @keypress="manual = true" />
  </div>
</template>

<script>
const kebabCase = require('lodash/kebabCase')

export default {
  props: {
    value: {
      type: String,
    },
    initial: {
      type: String,
      default: null,
    }
  },
  data () {
    return {
      text: null,
      manual: false,
    }
  },
  watch: {
    value (val) {
      this.text = val
    },
    initial () {
      if (!this.manual) {
        this.text = this.$format.slug(this.initial)
        this.update()
      }
    }
  },
  methods: {
    update () {
      this.text = kebabCase(this.$format.slug(this.text))
      this.$emit('input', this.text)
    }
  }
}
</script>
