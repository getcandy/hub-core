<template>
  <div>
    <toolbar heading="Sales Report" />
    <div class="bg-white">
      <sales-report :show-controls="true" />
    </div>
  </div>
</template>

<script>
import SalesReport from '../../components/SalesReport.vue'
export default {
  components: {
    SalesReport
  },
  head () {
    return {
      title: 'Sales Report'
    }
  }
}
</script>

<style scoped>

</style>
