<template>
  <div v-if="family">
    <div class="px-6 py-4 bg-white">
      <form-field :label="$t('Name')" required>
        <gc-input v-model="family.name" @input="updateName" />
      </form-field>
    </div>
    <div class="bg-white">
      <div class="flex mb-2">
        <div class="w-1/2 pl-12 text-sm font-bold text-gray-500 uppercase">
          Selected
        </div>
        <div class="w-1/2 pl-12 text-sm font-bold text-gray-500 uppercase">
          Available
        </div>
      </div>
      <product-family-attribute-manager
        v-model="productAttributes"
        :attributes="attributes"
        :initial-available="availableAttributes"
        :groups="attributeGroups"
        @changed="updateAttributes"
      />
    </div>
  </div>
</template>

<script>
import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'
import ProductFamilyAttributeManager from '../../components/ProductFamilyAttributeManager.vue'

const filter = require('lodash/filter')
const map = require('lodash/map')
const flattenDeep = require('lodash/flattenDeep')

export default {
  layout: 'product-family',
  head () {
    return {
      title: this.family ? this.family.name : null
    }
  },
  components: {
    ProductFamilyAttributeManager
  },
  mixins: [
    NormalizesObjects
  ],
  async asyncData ({ app }) {
    const groupResponse = await app.$gc.attributeGroups.get({
      all_records: true,
      include: 'attributes'
    })

    const groups = groupResponse.data.data

    const attributes = map(groups, group => group.attributes.data)

    return {
      attributes: flattenDeep(attributes),
      attributeGroups: groups
    }
  },
  data () {
    return {
      productAttributes: [],
      family: null
    }
  },
  computed: {
    familyModel () {
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
    this.translateChannel = this.channel
    this.translateLanguage = this.locale
    this.family = this.normalize(this.familyModel)
    this.productAttributes = this.normalize(this.family.attributes.data)
  },
  methods: {
    updateName () {
      this.$store.commit('productFamily/setOnModel', {
        field: 'name',
        value: this.family.name
      })
    },
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
