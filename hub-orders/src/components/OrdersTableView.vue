<template>
  <div>
    <div class="bg-gray-800 text-sm py-2 px-6" v-if="checkedRows.length">
      <update-order-status :order-id="checkedRows[0].id" @save="handleStatusChange" :statuses="settings.statuses.options" />
    </div>
    <gc-table
      :data="orders"
      :loading="loading"
      :meta="meta"
      @changePage="changePage"
      :columns="[
        {label: null, field: 'new_returning'},
        {label: 'Status', field: 'status'},
        {label: 'Reference', field: 'reference'},
        {label: 'Name', field: 'name'},
        {label: 'Type', field: 'type'},
        {label: 'Guest', field: 'guest'},
        {label: 'Sub Total', field: 'sub_total'},
        {label: 'Date', field: 'date'},
      ]"
    >
      <template v-slot:new_returning="{ row }">
        <span class="text-orange-500" data-toggle="tooltip" :title="$t('Returning Customer')" v-if="!firstOrder(row)">R</span>
        <span class="text-blue-500" data-toggle="tooltip" :title="$t('New Customer')" v-else>N</span>
      </template>
      <template v-slot:status="{ row }">
        <span class="tag" :style="getStatusStyles(row.status)">{{ getStatusLabel(row.status) }}</span>
      </template>
      <template v-slot:reference="{ row }">
        <nuxt-link :to="{
          name: 'orders.view',
          params: {
            id: row.id
          }
        }">
          {{ row.reference || row.display_id }}
        </nuxt-link>
      </template>
      <template v-slot:name="{ row }">
        {{ row.billing_details.firstname }} {{ row.billing_details.lastname }}
      </template>
      <template v-slot:type="{ row }">
        {{ row.type }}
      </template>
      <template v-slot:guest="{ row }">
        {{ row.user.data ? 'No' : 'Yes' }}
      </template>
      <template v-slot:sub_total="{ row }">
        <span v-html="formatSubTotal(row)" />
      </template>
      <template v-slot:date="{ row }">
        {{ $format.date(row.placed_at) }}
      </template>

    </gc-table>
  </div>
</template>

<script>
  const each = require('lodash/each')
  const find = require('lodash/find')
  import InteractsWithOrders from '../mixins/InteractsWithOrders.js'
  import UpdateOrderStatus from './UpdateOrderStatus.vue'

  export default {
    mixins: [
      InteractsWithOrders
    ],
    components: {
      UpdateOrderStatus
    },
    data () {
      return {
        checkedRows: []
      }
    },
    props: {
      loading: {
        type: Boolean,
        default: true
      },
      settings: {
        type: Object|Array,
        default: () => {}
      },
      orders: {
        type: Array,
        required: true,
      },
      meta: {
        type: Object,
        required: true,
      },
      total: {
        type: Number,
        required: true
      },
      perPage: {
        type: Number|String,
        required: true
      }
    },
    methods: {
      changePage (page) {
        this.$emit('changePage', page)
      },
      async handleStatusChange (data) {
        each(this.checkedRows, async (order) => {
          const response = await this.$gc.orders.updateStatus(
            order.id,
            data.status,
            data.send_emails,
            data.text
          )
          const orderInRows = find(this.orders, (o) => o.id == order.id)
          orderInRows.status = data.status
        })

        this.$buefy.toast.open({
          message: 'Order statuses updated',
          type: 'is-success'
        })

        this.checkedRows = []
      }
    }
  }
</script>

<style scoped>

</style>
