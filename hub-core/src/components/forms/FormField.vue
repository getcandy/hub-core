<template>
  <div class="mb-4">
    <header class="mb-1 text-gray-700 text-sm" v-if="label">
      <label class="font-bold ">{{ $t(label) }} <sup v-if="required" class="text-red-500">*</sup></label>
      <p v-if="instructions" class="text-xs text-gray-600 my-1" v-html="instructions"></p>
    </header>
    <div>
      <slot />
      <p v-if="error" class="text-red-600 leading-tight text-xs font-normal mt-1">{{ error }}</p>
      <p v-for="(error, index) in errors" :key="index" class="text-red-600 leading-tight text-xs font-normal mt-1">
        {{ error }}
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
