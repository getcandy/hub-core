<template>
  <div>
    <div class="px-6 py-3 text-sm font-semibold bg-white border-b shadow-sm">
      <div class="flex items-center justify-between">
        <div v-if="status">
          <span :style="getStatusStyles(order.status)" class="px-3 py-2 rounded">{{ status.label }}</span>
        </div>
        <div>
          <div class="flex">
            <div class="mr-4">
              <update-order-status @save="updateStatus" :current-status="order.status" :statuses="settings.statuses.options" :order-id="order.id" size="is-small" />
            </div>
            <div>
              <add-order-note :order-id="order.id" size="is-small"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="flex justify-between px-6 py-6 text-sm border-b">
        <div>
          <strong class="text-xs text-gray-600">{{ $t('Order ID') }}</strong><br>
          <span>{{ order.display_id }} </span>
        </div>
        <div>
          <strong class="text-xs text-gray-600">{{ $t('Order Reference') }}</strong><br>
          <span class="inline-flex items-center">{{ order.reference }} <click-to-copy class="ml-2" :text="order.reference" /></span>
        </div>
        <div>
          <strong class="text-xs text-gray-600">{{ $t('Customer Reference') }}</strong><br>
          <template v-if="order.customer_reference">
            {{ order.customer_reference }} <click-to-copy :text="order.customer_reference"/>
          </template>
          <span v-else>---</span>
        </div>
        <div>
          <strong class="text-xs text-gray-600">{{ $t('Date Created') }}</strong><br>
          {{ $format.date(order.created_at) }}
        </div>
        <div>
          <strong class="text-xs text-gray-600">{{ $t('Payment Date') }}</strong><br>
          {{ $format.date(order.placed_at) }}
        </div>
      </div>
      <div class="flex p-6">
        <div class="w-1/3">
          <strong class="text-xs text-gray-600">{{ $t('Billing Info') }}</strong>
          <div class="text-sm">
            {{ billing.firstname }} {{ billing.lastname }} <br />
            {{ billing.address }} <br />
            {{ billing.address_two }} <br />
            <template v-if="billing.address_three">
              {{ billing.address_three }} <br />
            </template>
            {{ billing.city }} <br />
            {{ billing.county }} <br />
            {{ billing.country }} <br />
            {{ billing.zip }} <br />
            {{ billing.phone }} <br />
            {{ billing.email }} <br />
          </div>
        </div>
        <div class="w-1/3">
          <strong class="text-xs text-gray-600">{{ $t('Shipping Info') }}</strong>
          <div class="text-sm">
          {{ shipping.firstname }} {{ shipping.lastname }} <br />
          {{ shipping.address }} <br />
          {{ shipping.address_two }} <br />
          <template v-if="shipping.address_three">
            {{ shipping.address_three }} <br />
          </template>
          {{ shipping.city }} <br />
          {{ shipping.county }} <br />
          {{ shipping.country }} <br />
          {{ shipping.zip }} <br />
          {{ shipping.phone }} <br />
          {{ shipping.email }}
          </div>
        </div>

        <div class="w-1/3">
          <strong class="text-xs text-gray-600">{{ $t('Contact Information') }}</strong><br />
          {{ $t('Email') }}: {{ order.contact_details.email }} <br />
          {{ $t('Phone') }}: {{ order.contact_details.phone }}
          <hr />
          <strong class="text-xs text-gray-600">{{ $t('Tracking No.') }}</strong>
          <b-input v-model="order.tracking_no" />
        </div>

      </div>
    </div>
    <div v-if="order.notes" class="px-6 py-4 border-t border-b">
      <strong>Order Notes</strong>
      <p>{{ order.notes }}</p>
    </div>


  </div>
</template>

<script>
  import AddOrderNote from '../components/AddOrderNote.vue'
  import UpdateOrderStatus from '../components/UpdateOrderStatus.vue'
  import InteractsWithOrders from '../mixins/InteractsWithOrders.js'

  export default {
    mixins: [
      InteractsWithOrders
    ],
    components: {
      UpdateOrderStatus,
      AddOrderNote
    },
    props: {
      settings: {
        type: Object,
        default: {}
      },
      order: {
        type: Object,
        default() {
          return {}
        }
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

        this.order.status = data.status

        this.$emit('statusUpdate', data.status)
      }
    },
    computed: {
      billing() {
        return this.order.billing_details
      },
      shipping() {
        return this.order.shipping_details
      },
      status() {
        return this.settings.statuses.options[this.order.status] || null
      }
    }
  }
</script>

<style scoped>

</style>
