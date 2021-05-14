<template>
  <div>
    <textarea class="w-full px-3 py-2" rows="4" @input="$emit('input', $event.target.value)" :value="value"></textarea>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null,
    }
  }
}
</script>
