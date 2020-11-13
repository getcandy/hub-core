<template>
  <div>
    <slot v-if="active" />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      required: true
    }
  },
  data () {
    return {
      active: false
    }
  }
}
</script>

<style lang="postcss" scoped>

</style>
