<template>
  <div>
    <toolbar heading="Order Details" :sub-heading="order.reference" />
    <div class="bg-white">
      <order-details-view :order="order" :settings="settings"/>
    </div>
  </div>
</template>

<script>
const find = require('lodash/find')
import OrderDetailsView from '../components/OrderDetailsView.vue'
import AddOrderNote from '../components/AddOrderNote.vue'
import UpdateOrderStatus from '../components/UpdateOrderStatus.vue'

export default {
  components: {
    AddOrderNote,
    UpdateOrderStatus,
    OrderDetailsView
  },
  async asyncData({app, params}) {
    const orderResponse = await app.$gc.orders.find(params.id, {
      includes: 'user.customer,lines,transactions,discounts,shipping'
    })
    const settingResponse = await app.$gc.settings.fetch('orders');

    return {
      order: orderResponse.data.data,
      settings: settingResponse.data.data
    }
  },
  head () {
    return {
      title: this.$t('Order {reference}', {
        reference: this.order.reference
      })
    }
  },
  methods: {
    async updateStatus(data) {
      const response = await this.$gc.orders.updateStatus(
        this.order.id,
        data.status,
        data.send_emails,
        data.text
      )

      this.$buefy.toast.open({
        message: 'Order status updated',
        type: 'is-success'
      })
    }
  }
}
</script>

<style scoped>

</style>
