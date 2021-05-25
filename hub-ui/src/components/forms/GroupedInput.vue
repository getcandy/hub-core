<template>
  <div>
    <div class="relative mt-1 rounded-md shadow-sm">
      <input :value="value" @input="$emit('input', $event.target.value)" :type="inputType" class="block w-full pr-16 form-input sm:text-sm sm:leading-5 disabled:bg-gray-100"/>
      <div class="absolute inset-y-0 right-0 flex items-center mr-2">
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
        default: null,
      },
      inputType: {
        type: String,
        default: 'text'
      }
    }
  }
</script>
