<template>
  <div>
    <toolbar heading="Product Stock Report" />
    <gc-table
      :data="products"
      :columns="[
        {label: $t('Product'), field: 'product'},
        {label: $t('Stock Level'), field: 'stock_level'},
        {label: $t('Stock Value (Excl. Tax)'), field: 'stock_value'},
      ]"
    >
    </gc-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      products: []
    }
  }
}
</script>