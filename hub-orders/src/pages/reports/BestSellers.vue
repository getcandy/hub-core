<template>
  <div>
    <toolbar heading="Best Sellers" />
      <best-sellers-report />
  </div>
</template>

<script>
  import BestSellersReport from '../../components/BestSellersReport.vue'

  export default {
    components: {
      BestSellersReport
    }
  }
</script>

<style scoped>

</style>
