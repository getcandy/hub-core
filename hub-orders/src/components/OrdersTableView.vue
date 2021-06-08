<template>
  <div>
    <div v-if="checkedRows.length" class="flex items-center px-6 py-2 text-sm bg-gray-50">
      <div class="mr-4" v-for="(action, actionIndex) in extendedOrderActions" :key="actionIndex">
        <component :is="action.component" :order-ids="checkedRows" :statuses="settings.statuses.options" />
      </div>
      <update-order-status :order-id="checkedRows[0]" :statuses="settings.statuses.options" @save="handleStatusChange" />
    </div>
    <div class="flex flex-no-wrap w-full overflow-x-auto text-sm bg-gray-200 border-b no-scrollbar">
      <div class="flex-none" v-for="(status, statusKey) in favouriteStatuses" :key="statusKey">
        <button
          class="p-4 border-none shadow-none outline-none hover:bg-gray-100 focus:outline-none"
          :class="{
            'bg-white border-b border-purple-500': currentFilteredStatus === statusKey
          }"
          @click="filterByStatus(statusKey)"
      >
        {{ status.label }}
      </button>
      </div>
    </div>
    <gc-table
      :data="orders"
      :loading="loading"
      :meta="meta"
      :columns="columns"
      :checkable="true"
      @toggleCheck="toggleRows"
      @changePage="changePage"
    >
      <template v-slot:check="{ row }">
        <input v-model="checkedRows" type="checkbox" :value="row.id">
      </template>
      <template v-slot:new_returning="{ row }">
        <div class="relative new-ret-tooltip cursor-help" v-if="!firstOrder(row)">
          <span class="px-2 py-1 text-xs text-orange-500 rounded-md bg-orange-50" data-toggle="tooltip">R</span>
          <div class="absolute top-0 hidden w-auto px-2 py-1 text-xs text-orange-500 truncate rounded-md bg-orange-50">
            {{ $t('Returning Customer') }}
          </div>
        </div>
        <div class="relative new-ret-tooltip cursor-help" v-else>
          <span class="px-2 py-1 text-xs text-blue-500 rounded-md bg-blue-50" data-toggle="tooltip">N</span>
          <div class="absolute top-0 hidden w-auto px-2 py-1 text-xs text-blue-500 truncate rounded-md bg-blue-50">
            {{ $t('New Customer') }}
          </div>
        </div>
      </template>
      <template v-slot:status="{ row }">
        <span class="tag" :style="getStatusStyles(row.status)">{{ getStatusLabel(row.status) }}</span>
      </template>
      <template v-slot:reference="{ row }">
        <nuxt-link
          :to="{
            name: 'orders.view',
            params: {
              id: row.id
            }
          }"
        >
          {{ row.reference || row.display_id }}
        </nuxt-link>
      </template>
      <template v-slot:name="{ row }">
        {{ row.billing_details.firstname }} {{ row.billing_details.lastname }}
        <span v-if="row.billing_details.company_name" class="block text-xs text-gray-600">{{ row.billing_details.company_name }}</span>
      </template>
      <template v-slot:email="{ row }">
        {{ row.billing_details.email }}
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
        {{ $format.date(row.placed_at || row.created_at) }}
      </template>
    </gc-table>
  </div>
</template>

<script>
import InteractsWithOrders from '../mixins/InteractsWithOrders.js'
import UpdateOrderStatus from './UpdateOrderStatus.vue'
const each = require('lodash/each')
const map = require('lodash/map')
const find = require('lodash/find')
const pickBy = require('lodash/pickBy')

export default {
  components: {
    UpdateOrderStatus
  },
  mixins: [
    InteractsWithOrders
  ],
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    settings: {
      type: Object | Array,
      default: () => {}
    },
    orders: {
      type: Array,
      required: true
    },
    meta: {
      type: Object,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number | String,
      required: true
    }
  },
  data () {
    return {
      checkedRows: [],
      extendedOrderActions: []
    }
  },
  mounted () {
    this.$nuxt.context.app.$hooks.callHook('orders.table.extend-actions', this.extendedOrderActions)
  },
  computed: {
    favouriteStatuses () {
      return pickBy(this.settings.statuses.options, option => option.favourite)
    },
    currentFilteredStatus () {
      return this.$route.query.status
    },
    columns () {
      const columns = [
        { label: null, field: 'check' },
        { label: null, field: 'new_returning', class: 'w-12' },
        { label: 'Status', field: 'status' },
        { label: 'Reference', field: 'reference' },
        { label: 'Name', field: 'name' },
        { label: 'Email', field: 'email' },
        { label: 'Type', field: 'type' },
        { label: 'Guest', field: 'guest' },
        { label: 'Sub Total', field: 'sub_total' },
        { label: 'Date', field: 'date' }
      ]
      this.$nuxt.context.app.$hooks.callHook('orders.table.columns', columns)
      return columns
    }
  },
  methods: {
    changePage (page) {
      this.checkedRows = []
      this.$emit('changePage', page)
    },
    toggleRows (event) {
        this.checkedRows = event ? map(this.orders, order => order.id) : []
    },
    filterByStatus (status) {
      this.$emit('filterStatus', status)
    },
    async handleStatusChange (data) {
      each(this.checkedRows, async (orderId) => {
        const response = await this.$gc.orders.updateStatus(
          orderId,
          data.status,
          data.send_emails,
          data.text
        )
        const orderInRows = find(this.orders, o => o.id == orderId)
        orderInRows.status = data.status
      })

      this.$notify.queue('success', this.$t('Order statuses updated'))

      this.checkedRows = []
    }
  }
}
</script>

<style scoped>
  /* Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .new-ret-tooltip {
    cursor: help;
  }
  .new-ret-tooltip:hover div {
    display:block;
    margin-top:-1px;
  }
</style>
