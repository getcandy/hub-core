<template>
    <button
      :type="type"
      :class="`${btnClass} inline-flex items-center`"
      :disabled="loading || disabled"
      @click="$emit('click')"
    >
      <div v-if="!loading" class="inline-flex items-center">
        <gc-icon :icon="iconLeft"  class="mr-1 -ml-1" size="sm" v-if="iconLeft" />
        <slot />
        <gc-icon :icon="iconRight"  class="w-4 ml-1 -mr-1" theme="red" v-if="iconRight" />
      </div>
      <gc-loading-spinner v-if="loading" />
    </button>
</template>

<script>
const themes = {
  base: 'disabled:cursor-not-allowed disabled:opacity-50 border border-transparent font-medium rounded-md  focus:outline-none transition ease-in-out duration-150',
  default: 'border-blue-500 bg-white  text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-500 active:text-white',
  green: 'text-green-600 border-green-300 bg-white hover:bg-green-50 focus:border-green-700 focus:shadow-outline-green active:bg-white',
  gray: 'text-gray-700 border-gray-400 hover:bg-gray-200 focus:border-gray-700 focus:shadow-outline-gray',
  danger: 'text-red-600 border-red-300 hover:bg-red-50 focus:border-red-700 focus:shadow-outline-red active:bg-red-10',
  outline: 'border border-gray-300 text-gray-700 bg-white hover:text-gray-500 focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50'
}
const sizes = {
  default: 'px-3 py-2 text-sm',
  'x-small': 'px-3 py-2 text-xs',
  small: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}
export default {
  props: {
    iconLeft: {
      type: String,
      default: null
    },
    iconRight: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
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
        themes['base'],
        themes[this.theme],
        sizes[this.size]
      ]
      return classes.join(' ')
    }
  }
}
</script>
