<template>
  <div v-if="collection">
    <div class="bg-white">
      <attribute-translate
        :attribute-groups="attributeGroups"
        :attribute-data="collection.attribute_data"
        @changed="attributesChanged"
      />
    </div>
  </div>
</template>

<script>
  const map = require('lodash/map')
  const get = require('lodash/get')
  const debounce = require('lodash/debounce')
  const orderBy = require('lodash/orderBy')
  const each = require('lodash/each')
  const find = require('lodash/find')

  import HubPage from '@getcandy/hub-core/src/mixins/HubPage.js'
  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'
  import HasDrafts from '@getcandy/hub-core/src/mixins/HasDrafts.js'

  export default {
    layout: 'collection',
    mixins: [
      HasDrafts,
      HubPage,
      NormalizesObjects
    ],
    data() {
      return {
        translateChannel: null,
        translateLanguage: null,
        translating: false,
        attributeGroups: [],
        collection: null
      }
    },
    mounted() {
      this.translateChannel = this.channel
      this.translateLanguage = this.locale
      this.collection = this.normalize(this.model)
      this.storeHandle = 'collections'
      this.decorate(this.collection)
    },
    methods: {
      attributesChanged: debounce(async function (val) {
        await this.createDraft('collections', this.collection.id, {
          beforeRedirect: async (collection) => {
            collection.attribute_data = val
          }
        });
        this.save(val)
      }, 300),
      save (val) {
        this.$store.dispatch('collections/save', {
          context: this.$gc,
          data: {
            attribute_data: val
          }
        })
        this.$notify.queue('success', this.$t('Collection saved'))
      },
      updateAttributes (values) {
        this.$store.commit('collections/setOnModel', {
          field: 'attribute_data',
          value: this.normalize(values)
        })
      },
      /**
       * Decorates the data ready for the template to use
       * @param  {Object} data
       * @return
       */
      decorate(data) {
          // this.attribute_groups = data.attribute_groups.data;

          // Get all groups associated to this product.
          let groups = [];

          each(data.attributes.data, attribute => {
              let exists = find(groups, group => {
                  return group.handle == attribute.group.data.handle;
              });
              if (attribute.group && !exists) {
                  groups.push(attribute.group.data);
              }
          });

          groups = orderBy(groups, 'position', 'asc');

          this.attributeGroups = groups;
      },
    },
    computed: {
      model () {
        return this.$store.state.collections.model
      }
    }
  }
</script>

<style scoped>

</style>
