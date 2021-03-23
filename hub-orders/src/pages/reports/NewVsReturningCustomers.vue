<template>
  <div>
    <toolbar heading="New Vs Returning Customers" />
    <div class="bg-white">
      <customer-report :show-controls="true" />
    </div>
  </div>
</template>

<script>
import CustomerReport from '../../components/CustomerReport.vue'

export default {
  components: {
    CustomerReport
  },
  head () {
    return {
      title: 'New Vs Returning Customers'
    }
  }
}
</script>

<style scoped>

</style>
