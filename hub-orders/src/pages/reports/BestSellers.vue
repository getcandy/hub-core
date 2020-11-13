<template>
  <div>
    <toolbar heading="Best Sellers" />
    <div class="bg-white p-6">
      <best-sellers-report />
    </div>
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
