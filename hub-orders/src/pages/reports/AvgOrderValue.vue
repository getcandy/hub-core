<template>
  <div>
    <toolbar heading="Avg. Order Value Report" />
    <div class="bg-white">
      <order-average-report :show-controls="true" :show-graph="true" />
    </div>
  </div>
</template>

<script>
import OrderAverageReport from '../../components/OrderAverageReport.vue'
export default {
  components: {
    OrderAverageReport
  },
  head () {
    return {
      title: 'Average Order Report'
    }
  }
}
</script>

<style scoped>

</style>
