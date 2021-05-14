<template>
  <div>
    <div class="px-6 py-3 text-sm font-semibold bg-white border-b shadow-sm">
      <div class="flex items-center justify-between">
        <div v-if="status">
          <span :style="getStatusStyles(order.status)" class="px-3 py-2 rounded">{{ status.label }}</span>
        </div>
        <div>
          <div class="flex">
            <div v-for="(component, index) in toolbarSlot" :key="index" class="mx-4">
              <component :is="component" :order="order" />
            </div>
            <div class="mx-4" v-if="user">
              <nuxt-link :to="{
                name: 'users-id',
                params: {
                  id: user.id
                }
              }" class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out border border-transparent border-gray-400 rounded-md disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none hover:bg-gray-200 focus:border-gray-700 focus:shadow-outline-gray disabled:bg-red-500">
                View User
              </nuxt-link>
            </div>
            <div>
              <update-order-status :current-status="order.status" :statuses="settings.statuses.options" :order-id="order.id" size="is-small" @save="updateStatus" />
            </div>
            <div class="mx-4">
              <add-order-note :order-id="order.id" size="is-small" />
            </div>
            <div>
              <gc-button @click="download">
                {{ $t('Download Invoice') }}
              </gc-button>
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
        <div v-for="(block, blockIndex) in topDetails" :key="blockIndex">
          <strong class="text-xs text-gray-600">{{ $t(block.title) }}</strong><br>
          {{ block.value(order) }}
        </div>
        <div>
          <strong class="text-xs text-gray-600">{{ $t('Customer Reference') }}</strong><br>
          <template v-if="order.customer_reference">
            {{ order.customer_reference }} <click-to-copy :text="order.customer_reference" />
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
            {{ billing.firstname }} {{ billing.lastname }} <br>
            <span v-if="billing.company_name">{{ billing.company_name }}<br></span>
            {{ billing.address }} <br>
            {{ billing.address_two }} <br>
            <template v-if="billing.address_three">
              {{ billing.address_three }} <br>
            </template>
            {{ billing.city }} <br>
            {{ billing.county }} <br>
            {{ billing.country }} <br>
            {{ billing.zip }} <br>
            {{ billing.phone }} <br>
            {{ billing.email }} <br>
          </div>
        </div>
        <div class="w-1/3">
          <strong class="text-xs text-gray-600">{{ $t('Shipping Info') }}</strong>
          <div class="text-sm">
            {{ shipping.firstname }} {{ shipping.lastname }} <br>
            <span v-if="shipping.company_name">{{ shipping.company_name }}<br></span>
            {{ shipping.address }} <br>
            {{ shipping.address_two }} <br>
            <template v-if="shipping.address_three">
              {{ shipping.address_three }} <br>
            </template>
            {{ shipping.city }} <br>
            {{ shipping.county }} <br>
            {{ shipping.country }} <br>
            {{ shipping.zip }} <br>
            {{ shipping.phone }} <br>
            {{ shipping.email }}
          </div>
        </div>

        <div class="w-1/3">
          <strong class="text-xs text-gray-600">{{ $t('Contact Information') }}</strong><br>
          {{ $t('Email') }}: {{ order.contact_details.email }} <br>
          {{ $t('Phone') }}: {{ order.contact_details.phone }}
          <hr>
          <strong class="text-xs text-gray-600">{{ $t('Tracking No.') }}</strong>
          <gc-input v-model="order.tracking_no" />
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
const get = require('lodash/get')

export default {
  components: {
    UpdateOrderStatus,
    AddOrderNote
  },
  mixins: [
    InteractsWithOrders
  ],
  props: {
    settings: {
      type: Object,
      default: () => {}
    },
    order: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      additionalActions: [],
      topDetails: []
    }
  },
  computed: {
    toolbarSlot () {
      return this.additionalActions
    },
    billing () {
      return this.order.billing_details
    },
    shipping () {
      return this.order.shipping_details
    },
    status () {
      return this.settings.statuses.options[this.order.status] || null
    },
    user () {
      return get(this.order, 'user.data', null)
    }
  },
  mounted () {
    this.$nuxt.context.app.$hooks.callHook('order.details.toolbar', this.additionalActions)
    this.$nuxt.context.app.$hooks.callHook('order.details.topdetails', this.topDetails)
  },
  methods: {
    async download () {
      const response = await this.$axios.get(`orders/${this.order.id}/invoice`, {
        responseType: 'blob'
      })
      const file = new Blob([response.data], { type: 'application/pdf' })
      // Build a URL from the file
      const fileURL = URL.createObjectURL(file)
      // Open the URL on new Window
      window.open(fileURL)
    },
    async updateStatus (data) {
      await this.$gc.orders.updateStatus(
        this.order.id,
        data.status,
        data.send_emails,
        data.text
      )

      this.$notify.queue('success', this.$t('Order status updated'))

      this.order.status = data.status

      this.$emit('statusUpdate', data.status)
    }
  }
}
</script>

<style scoped>

</style>
