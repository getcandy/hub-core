<template>
  <div>
    <div class="px-6 py-4">
      <strong>{{ $t('Purchase History for the past year') }}</strong>
    </div>
    <gc-table
      :data="products"
      :columns="[
        {label: 'Product', field: 'product'},
        {label: 'SKU', field: 'sku'},
        {label: 'Quantity', field: 'quantity'},
        {label: 'Revenue', field: 'revenue'},
        {label: 'No. of orders', field: 'order_count'},
        {label: 'Month of last order', field: 'last_ordered'},
      ]"
    >
      <template v-slot:product="{ row }">
        {{ row.description }}
      </template>
      <template v-slot:sku="{ row }">
        {{ row.sku }}
      </template>
      <template v-slot:quantity="{ row }">
        {{ row.quantity }}
      </template>
      <template v-slot:revenue="{ row }">
        {{ $format.currency(row.sub_total) }}
      </template>
      <template v-slot:order_count="{ row }">
        {{ row.order_count }}
      </template>
      <template v-slot:last_ordered="{ row }">
        {{ $format.date(row.last_ordered, 'DD MMMM YYYY') }}
      </template>
    </gc-table>
  </div>
</template>

<script>
export default {
  props: {
    products: {
      type: Array,
      required: true
    }
  }
}
</script>
