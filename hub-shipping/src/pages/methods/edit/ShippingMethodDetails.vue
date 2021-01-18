<template>
  <div v-if="shippingMethod">
      <attribute-translate
        :attribute-groups="attributeGroups"
        :attribute-data="shippingMethod.attribute_data"
        @changed="handleUpdate"
      />
  </div>
</template>

<script>
  const find = require('lodash/find')
  const orderBy = require('lodash/orderBy')
  const each = require('lodash/each')
  const map = require('lodash/map')

  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'

  export default {
    layout: 'shipping-method',
    mixins: [
      NormalizesObjects
    ],
    data() {
      return {
        translateChannel: null,
        translateLanguage: null,
        translating: false,
        attributeGroups: [],
        shippingMethod: null
      }
    },
    mounted() {
      this.translateChannel = this.channel
      this.translateLanguage = this.locale
      this.shippingMethod = this.normalize(this.model)
      this.decorate(this.shippingMethod)
    },
    methods: {
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
      handleUpdate (value) {
        this.$store.commit('shippingMethods/setOnModel', {
          field: 'attribute_data',
          value: this.normalize(value)
        })
      }
    },
    computed: {
      model () {
        return this.$store.state.shippingMethods.model
      },
      channel() {
        return this.$store.state.core.channel
      },
      locale() {
        return this.$store.state.core.locale
      },
      languages() {
        return this.$store.state.core.languages
      },
      channels() {
        return this.$store.state.core.channels
      }
    }
  }
</script>

<style scoped>

</style>
