<template>
  <div>
    <toolbar heading="Order Report" />
    <div class="bg-white">
      <orders-report
        :show-controls="true"
        :show-graph="true"
      >
          </orders-report>
    </div>
  </div>
</template>

<script>
  import OrdersReport from '../../components/OrdersReport.vue'
  export default {
    components: {
      OrdersReport
    }
  }
</script>

<style scoped>

</style>
