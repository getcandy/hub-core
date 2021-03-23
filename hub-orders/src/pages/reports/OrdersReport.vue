<template>
  <div>
    <toolbar heading="Order Report" />
    <div class="bg-white">
      <orders-report
        :show-controls="true"
        :show-graph="true"
      />
    </div>
  </div>
</template>

<script>
import OrdersReport from '../../components/OrdersReport.vue'
export default {
  components: {
    OrdersReport
  },
  head () {
    return {
      title: 'Order Total Report'
    }
  }
}
</script>

<style scoped>

</style>
