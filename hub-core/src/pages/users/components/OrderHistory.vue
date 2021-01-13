<template>
  <div>
    <gc-table
      :data="orders"
      :columns="[
        {label: 'Status', field: 'status'},
        {label: 'Display ID', field: 'display_id'},
        {label: 'Reference', field: 'reference'},
        {label: 'Date', field: 'date'},
        {label: 'Type', field: 'type'},
        {label: 'Total', field: 'total'},
        {label: null, field: 'actions'},
      ]"
    >
      <template v-slot:status="{ row }">
        <span class="tag" :style="getStatusStyles(row.status)">{{ getStatusLabel(row.status) }}</span>
      </template>
      <template v-slot:date="{ row }">
        {{ $format.date(row.placed_at || row.created_at)}}
      </template>
      <template v-slot:type="{ row }">
        {{ row.type }}
      </template>
      <template v-slot:display_id="{ row }">
        <nuxt-link
            :to="{
              name: 'orders.view',
              params: {
                id: row.id
              }
            }">
              {{ row.display_id }}
            </nuxt-link>

      </template>
      <template v-slot:reference="{ row }">

        {{ row.reference }}
      </template>
      <template v-slot:total="{ row }">
        {{ $format.currency(row.order_total) }}
      </template>
    </gc-table>
  </div>
</template>

<script>
import InteractsWithOrders from '@getcandy/hub-orders/src/mixins/InteractsWithOrders.js'

export default {
  mixins: [
    InteractsWithOrders
  ],
  props: {
    orders: {
      type: Array,
      required: true
    }
  }
}
</script>
