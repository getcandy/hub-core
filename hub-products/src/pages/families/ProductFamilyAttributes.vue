<template>
  <div>
    <product-family-attribute-manager v-model="productAttributes" :initial-available="availableAttributes" @input="updateAttributes" />
  </div>
</template>

<script>
import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'
import ProductFamilyAttributeManager from '../../components/ProductFamilyAttributeManager.vue'

const filter = require('lodash/filter')
const map = require('lodash/map')

export default {
  layout: 'product-family',
  components: {
    ProductFamilyAttributeManager
  },
  mixins: [
    NormalizesObjects
  ],
  async asyncData ({ app }) {
    const attributeResponse = await app.$gc.attributes.get({
      per_page: 500
    })
    return {
      attributes: attributeResponse.data.data
    }
  },
  data () {
    return {
      productAttributes: []
    }
  },
  computed: {
    family () {
      return this.$store.state.productFamily.model
    },
    availableAttributes () {
      let attributes = this.attributes
      const existing = map(this.family.attributes.data, att => att.id)
      attributes = filter(attributes, (att) => {
        return !existing.includes(att.id)
      })
      return attributes
    }
  },
  mounted () {
    this.productAttributes = this.normalize(this.family.attributes.data)
  },
  methods: {
    updateAttributes () {
      this.$store.commit('productFamily/setOnModel', {
        field: 'attributes',
        value: {
          data: this.normalize(this.productAttributes)
        }
      })
    }
  }
}
</script>
