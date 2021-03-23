<template>
    <div class="relative">
      <select :disabled="disabled" @change="handleChange" :value="value" class="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <slot />
      </select>
    </div>
</template>

<script>
export default {
  props: ['value', 'disabled'],
  methods: {
    handleChange ($event) {
      this.$emit('input', $event.target.value)
      this.$emit('change', $event.target.value)
    }
  }
}
</script>
