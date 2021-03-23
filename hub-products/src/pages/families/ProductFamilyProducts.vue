<template>
  <div>
    <product-family-products-manager v-model="family.products.data" />
  </div>
</template>

<script>
import ProductFamilyProductsManager from '../../components/ProductFamilyProductsManager.vue'

export default {
  layout: 'product-family',
  components: {
    ProductFamilyProductsManager
  },
  computed: {
    family () {
      return this.$store.state.productFamily.model
    }
  }
}
</script>
