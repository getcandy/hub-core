<template>
  <div class="mt-1 relative rounded-md shadow-sm">
    <input
      :value="value"
      :disabled="disabled"
      :class="{
        'pr-12': $slots.suffix,
        'pl-7': $slots.prefix
      }"
      class="form-input block w-full sm:text-sm sm:leading-5 disabled:bg-gray-100"
      :type="type"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)"
      @blur="$emit('blur', $event.target.value)"
    >
    <slot name="suffix" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: null,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    }
  }
}
</script>
