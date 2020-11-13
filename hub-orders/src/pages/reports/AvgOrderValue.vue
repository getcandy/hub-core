<template>
  <div>
    <toolbar heading="Avg. Order Value Report" />
    <div class="bg-white p-6">
      <order-average-report :show-controls="true" :show-graph="true"  />
    </div>
  </div>
</template>

<script>
  import OrderAverageReport from '../../components/OrderAverageReport.vue'
  export default {
    components: {
      OrderAverageReport
    }
  }
</script>

<style scoped>

</style>
