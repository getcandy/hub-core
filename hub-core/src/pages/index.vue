<template>
<div class="container">

</div>
</template>

<script>
export default {
  created () {
    this.$router.push({
      name: 'order-processing.dashboard'
    })
  },
  computed: {
    sections () {
      return this.$store.state.core.sections
    }
  }
}
</script>
