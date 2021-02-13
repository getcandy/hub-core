<template>
  <button
    class="inline-flex bg-gray-500 rounded-full disabled:cursor-not-allowed py-1 focus:outline-none transition duration-500 ease-in-out"
    :class="{
      'bg-green-500': value,
      'w-12': !size,
      'w-8' : size == 'small'
    }"
    :disabled="disabled"
    @click="toggle"
  >
    <span
      class="focus:outline-none bg-white rounded-full shadow transition duration-500 ease-in-out"
      :class="{
        'transform translate-x-4/5 ease-in-out mx-2': value,
        'mx-1': !value,
        'w-6 h-6 mx-2' : !size,
        'w-3 h-3': size == 'small'
      }"
    />
  </button>
</template>

<script>
export default {
  props: {
    value: {
      type: null,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: null
    }
  },
  methods: {
    toggle () {
      if (!this.disabled) {
        this.$emit('input', !this.value)
      }
    }
  }
}
</script>
