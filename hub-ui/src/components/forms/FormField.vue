<template>
  <div class="mb-4">
    <header v-if="label" class="mb-1 text-sm text-gray-700">
      <label class="font-bold ">{{ $t(label) }} <sup v-if="required" class="text-red-500">*</sup></label>
      <p v-if="instructions" class="my-1 text-xs text-gray-600">
        {{ instructions }}
      </p>
    </header>
    <div>
      <slot />
      <p v-if="error" class="mt-1 text-xs font-normal leading-tight text-red-600">
        {{ error }}
      </p>
      <p v-for="(message, index) in errors" :key="index" class="mt-1 text-xs font-normal leading-tight text-red-600">
        {{ message }}
      </p>
    </div>
    <button class="text-xs text-blue-700 focus:outline-none" v-if="explanation" @click="expandedExplanation = !expandedExplanation">{{ expandedExplanation ? 'Hide' : 'Show' }} explanation</button>
    <!-- This example requires Tailwind CSS v2.0+ -->
    <div class="p-3 mt-1 rounded-md bg-blue-50" v-if="expandedExplanation">
      <p class="text-xs text-blue-700">
        {{ explanation }}
      </p>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      explanation: {
        type: String,
        default: null
      },
      label: {
        type: String,
        default: null
      },
      for: {
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
    },
    data () {
      return {
        expandedExplanation: false
      }
    }
  }
</script>
