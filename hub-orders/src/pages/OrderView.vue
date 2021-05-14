<template>
  <div v-if="!$fetchState.pending">
    <toolbar heading="Order Details" :sub-heading="order.reference" />
    <div class="bg-white">
      <order-details-view :order="order" :settings="settings"/>
    </div>
  </div>
</template>

<script>
import OrderDetailsView from '../components/OrderDetailsView.vue'
import AddOrderNote from '../components/AddOrderNote.vue'
import UpdateOrderStatus from '../components/UpdateOrderStatus.vue'

export default {
  components: {
    AddOrderNote,
    UpdateOrderStatus,
    OrderDetailsView
  },
  async fetch () {
    const { params } = this.$route
    const orderResponse = await this.$gc.orders.find(params.id, {
      includes: 'user.customer,lines,transactions,discounts,shipping'
    })
    const settingResponse = await this.$gc.settings.fetch('orders');
    this.order = orderResponse.data.data,
    this.settings = settingResponse.data.data
  },
  data () {
    return {
      order: {},
      settings: {}
    }
  },
  head () {
    return {
      title: this.$t('Order {reference}', {
        reference: this.order.reference
      })
    }
  }
}
</script>
