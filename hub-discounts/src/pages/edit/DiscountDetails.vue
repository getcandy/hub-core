<template>
  <div class="bg-white shadow" v-if="discount">
    <attribute-translate
      :attribute-groups="attributeGroups"
      :attribute-data="discount.attribute_data"
      @changed="syncModel"
    />
  </div>
</template>

<script>
  const find = require('lodash/find')
  const orderBy = require('lodash/orderBy')
  const each = require('lodash/each')
  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'

  export default {
    layout: 'discount',
    mixins: [
      NormalizesObjects
    ],
    data() {
      return {
        translateChannel: null,
        translateLanguage: null,
        attributeGroups: [],
        discount: null,
        translating: false,
      }
    },
    mounted() {
      this.discount = this.normalize(this.$store.state.discounts.model)
      this.decorate(this.discount)
      this.translateChannel = this.channel
      this.translateLanguage = this.locale
    },
    methods: {
      syncModel () {
        // this.discount
        this.$store.dispatch('discounts/setModel', this.normalize(this.discount))
      },
      /**
       * Decorates the data ready for the template to use
       * @param  {Object} data
       * @return
       */
      decorate(data) {
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
