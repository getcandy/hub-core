<template>
    <div class="relative">
      <select :disabled="disabled" @change="handleChange" :value="value" class="w-full pr-8 leading-tight rounded appearance-none disabled:opacity-75 disabled:cursor-not-allowed form-input" id="grid-state">
        <slot />
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
        <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
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
