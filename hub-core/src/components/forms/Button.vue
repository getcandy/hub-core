<template>
  <span class="inline-flex rounded-md shadow-sm">
    <button
      :type="type"
      :class="btnClass"
      :disabled="loading"
      @click="$emit('click')"
    >
      <template v-if="!loading">
        <i v-if="iconLeft" class="w-5 h-5 mr-3 -ml-1 text-lg" :class="`ri-${iconLeft}`" />
        <slot />
      </template>
      <i v-if="loading" class="ri-loader-4-line spin" />
    </button>
  </span>
</template>

<script>
const themes = {
  base: 'disabled:cursor-not-allowed inline-flex items-center border border-transparent font-medium rounded-md  focus:outline-none transition ease-in-out duration-150',
  default: 'text-green-600 border-green-300 bg-white hover:bg-green-50 focus:border-green-700 focus:shadow-outline-green active:bg-white',
  gray: 'text-gray-700 border-gray-400 hover:bg-gray-200 focus:border-gray-700 focus:shadow-outline-gray',
  danger: 'text-red-600 border-red-300 hover:bg-red-50 focus:border-red-700 focus:shadow-outline-red active:bg-red-10',
  outline: 'border border-gray-300 text-gray-700 bg-white hover:text-gray-500 focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50'
}
const sizes = {
  default: 'px-4 py-2 text-sm leading-6',
  'x-small': 'px-3 py-2 text-xs leading-4',
  small: 'px-4 py-2 text-sm leading-5',
  lg: 'px-6 py-3 text-base leading-6'
}
export default {
  props: {
    iconLeft: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'submit'
    },
    theme: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    btnClass () {
      const classes = [
        themes.base,
        themes[this.theme],
        sizes[this.size]
      ]
      return classes.join(' ')
    }
  }
}
</script>
