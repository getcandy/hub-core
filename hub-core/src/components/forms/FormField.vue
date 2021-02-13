<template>
  <div class="mb-4">
    <header v-if="label" class="mb-1 text-gray-700 text-sm">
      <label class="font-bold ">{{ $t(label) }} <sup v-if="required" class="text-red-500">*</sup></label>
      <p v-if="instructions" class="text-xs text-gray-600 my-1">
        {{ instructions }}
      </p>
    </header>
    <div>
      <slot />
      <p v-if="error" class="text-red-600 leading-tight text-xs font-normal mt-1">
        {{ error }}
      </p>
      <p v-for="(message, index) in errors" :key="index" class="text-red-600 leading-tight text-xs font-normal mt-1">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    instructions: {
      type: String,
      default: null
    },
    error: {
      type: String,
      default: null
    },
    errors: {
      type: Array,
      default: () => []
    }
  }
}
</script>
