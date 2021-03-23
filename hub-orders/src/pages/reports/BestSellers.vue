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
  },
  head () {
    return {
      title: 'Best Selling Products'
    }
  }
}
</script>

<style scoped>

</style>
