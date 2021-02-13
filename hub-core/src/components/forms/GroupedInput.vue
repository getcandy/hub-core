<template>
  <div>
    <div class="mt-1 relative rounded-md shadow-sm">
      <input :value="value" class="border shadow-inner rounded border-gray-400 py-3 px-4 text-gray-800 block w-full pr-16 sm:text-sm sm:leading-5" @input="$emit('input', $event.target.value)">
      <div class="absolute inset-y-0 right-0 mr-2 flex items-center">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: null,
      required: true
    }
  }
}
</script>
