<template>
  <div v-if="family">
    <div class="bg-white p-6">
      <form-field :label="$t('Name')" required>
        <b-input v-model="family.name" @input="updateName" />
      </form-field>
    </div>
    <div class="bg-white">
      <product-family-attribute-manager
        v-model="productAttributes"
        :attributes="attributes"
        :initial-available="availableAttributes"
        @changed="updateAttributes"
        :groups="attributeGroups"
      />
    </div>
  </div>
</template>

<script>
  const orderBy = require('lodash/orderBy')
  const filter = require('lodash/filter')
  const map = require('lodash/map')
  const each = require('lodash/each')
  const find = require('lodash/find')
  const flattenDeep = require('lodash/flattenDeep')

  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'
  import ProductFamilyAttributeManager from '../../components/ProductFamilyAttributeManager.vue'

  export default {
    layout: 'product-family',
    mixins: [
      NormalizesObjects,
    ],
    components: {
      ProductFamilyAttributeManager
    },

    mounted() {
      this.translateChannel = this.channel
      this.translateLanguage = this.locale
      this.family = this.normalize(this.familyModel)
      this.productAttributes = this.normalize(this.family.attributes.data)
    },
    data () {
      return {
        productAttributes: [],
        family: null
      }
    },
    async asyncData({ app }) {
      const groupResponse = await app.$gc.attributeGroups.get({
        all_records: true,
        include: 'attributes'
      })

      const groups = groupResponse.data.data;

      const attributes = map(groups, (group) => group.attributes.data);

      return {
        attributes: flattenDeep(attributes),
        attributeGroups: groups
      }
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
    },
    computed: {
      familyModel () {
        return this.$store.state.productFamily.model
      },
      availableAttributes () {
        let attributes = this.attributes
        const existing = map(this.family.attributes.data, att => att.id)
        attributes = filter(attributes, (att) => {
          return !existing.includes(att.id);
        })
        return attributes;
      }
    }
  }
</script>
