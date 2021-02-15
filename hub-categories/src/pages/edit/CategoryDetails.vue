<template>
  <div v-if="category">
    <attribute-translate
      :attribute-groups="attributeGroups"
      :attribute-data="category.attribute_data"
      @changed="attributesChanged"
    />
  </div>
</template>

<script>
import HubPage from '@getcandy/hub-core/src/mixins/HubPage.js'
import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'
import HasDrafts from '@getcandy/hub-core/src/mixins/HasDrafts.js'

const debounce = require('lodash/debounce')
const orderBy = require('lodash/orderBy')
const each = require('lodash/each')
const find = require('lodash/find')

export default {
  layout: 'category',
  mixins: [
    HubPage,
    NormalizesObjects,
    HasDrafts
  ],
  data () {
    return {
      translateChannel: null,
      translateLanguage: null,
      translating: false,
      attributeGroups: [],
      category: null
    }
  },
  computed: {
    model () {
      return this.$store.state.categories.model
    }
  },
  mounted () {
    this.translateChannel = this.channel
    this.translateLanguage = this.locale
    this.category = this.normalize(this.model)
    this.storeHandle = 'categories'
    this.decorate(this.category)
  },
  methods: {
    attributesChanged: debounce(async function (val) {
      await this.createDraft('categories', this.category.id, {
        beforeRedirect: (category) => {
          category.attribute_data = val
        }
      })
      this.save(val)
    }, 300),
    save (val) {
      this.$store.dispatch('categories/save', {
        context: this.$gc,
        data: {
          attribute_data: val
        }
      })
      this.$notify.queue('success', this.$t('Category saved'))
    },
    /**
      * Decorates the data ready for the template to use
      * @param  {Object} data
      * @return
      */
    decorate (data) {
      // Get all groups associated to this product.
      let groups = []

      each(data.attributes.data, (attribute) => {
        const exists = find(groups, (group) => {
          return group.handle === attribute.group.data.handle
        })
        if (attribute.group && !exists) {
          groups.push(attribute.group.data)
        }
      })

      groups = orderBy(groups, 'position', 'asc')

      this.attributeGroups = groups
    },
    updateAttributes (values) {
      this.$store.commit('categories/setOnModel', {
        field: 'attribute_data',
        value: this.normalize(values)
      })
    }
  }
}
</script>
