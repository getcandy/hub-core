<template>
  <svg :class="sizeClass">
    <use :xlink:href="`/icon-sprite.svg#tabler-${icon}`" />
  </svg>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'base',
    },
    spin: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: true
    }
  },
  computed: {
    sizeClass () {
      const sizes = {
        base: 'w-6 h-6',
        lg: 'w-8 h-8',
        sm: 'w-4 h-4',
      }
      const size = sizes[this.size] || sizes['base']

      if (this.spin) {
        return size + ' spin'
      }

      return size
    }
  }
}
</script>

<style scoped>
.spin {
  animation: spin 1s infinite linear;
}
</style>
