<template>
  <div>
    <div class="mt-1 relative rounded-md shadow-sm">
      <input :value="value" @input="$emit('input', $event.target.value)" class="form-input block w-full sm:text-sm sm:leading-5 disabled:bg-gray-100 pr-16"/>
      <div class="absolute inset-y-0 right-0 mr-2 flex items-center">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['value']
  }
</script>
