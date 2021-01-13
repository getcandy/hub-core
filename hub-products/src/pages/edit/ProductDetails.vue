<template>
  <div v-if="product">
    <attribute-translate
      :attribute-groups="attributeGroups"
      :attribute-data="product.attribute_data"
      :errors="errors || {}"
      @changed="attributesChanged"
    />
  </div>
</template>

<script>
  const find = require('lodash/find')
  const orderBy = require('lodash/orderBy')
  const each = require('lodash/each')
  const get = require('lodash/get')
  const debounce = require('lodash/debounce')

  import { NormalizesObjects, HasDrafts, HubPage } from '@getcandy/hub-core/src/mixins/Index.js'

  export default {
    layout: 'product',
    mixins: [
      HubPage,
      NormalizesObjects,
      HasDrafts
    ],
    computed: {
      storeModel () {
        return this.$store.state.product.model
      },
      attributes () {
        return this.$store.state.product.attributes
      },
      familyId () {
        return this.storeModel.family.data.id
      },
      errors () {
        return this.$store.state.product.errors
      },
      hasErrors () {
        return !!Object.keys(this.errors).length
      }
    },
    data() {
      return {
        translateChannel: null,
        translateLanguage: null,
        attributeGroups: [],
        product: null,
        translating: false
      }
    },
    watch: {
      familyId () {
        this.loadProduct()
      }
    },
    mounted() {
      this.loadProduct()
      this.translateChannel = this.channel
      this.translateLanguage = this.locale
    },
    methods: {
      loadProduct () {
        const data = this.product
        this.product = this.normalize(this.storeModel)
        this.decorate(this.product)
      },
      /**
       * Decorates the data ready for the template to use
       * @param  {Object} data
       * @return
       */
      decorate(data) {
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

          if (data.family.data) {
            each(data.family.data.attributes.data, attribute => {
                // // Find the attribute
                let existing = find(groups, group => {
                    return group.handle == attribute.group.data.handle;
                });
                if (!data.attribute_data[attribute.handle]) {
                    this.$set(data.attribute_data, attribute.handle, {
                        [this.channel]: {
                            en: ""
                        }
                    });
                }

                if (!existing) {
                    let group = attribute.group.data;
                    if (group){
                      this.$set(group, 'attributes', {
                          data: [],
                      });
                      group.attributes.data.push(attribute);
                      groups.push(group);
                    }
                } else {
                    let attributes = existing.attributes.data;
                    // If the attribute doesn't exist, then we add it.
                    let existingAttribute = find(attributes, att => {
                        return att.handle == attribute.handle;
                    });
                    if (!existingAttribute) {
                        existing.attributes.data.push(attribute);
                    }
                }
            });
          }

          groups = orderBy(groups, 'position', 'asc');

        this.attributeGroups = groups

      },
      attributesChanged: debounce(async function (val) {
        await this.createDraft('product', this.product.id, {
          beforeRedirect: async (product) => {
            product.attribute_data = val
          }
        }, this.$getcandy);
        this.save(val);
      }, 300),
      save (val) {
        this.$store.dispatch('product/save', {
          context: this.$getcandy,
          data: {
            attribute_data: val
          }
        })
        if (!this.hasErrors) {
          this.$notify.queue('success', 'Product saved')
        }
      }
    },
    watch : {
      locale (val) {
        if (val == this.translateLanguage) {
          this.translateLanguage = null
        }
      },
      storeModel (val) {
        this.product = this.normalize(val)
        if (this.attributes) {
          this.save(this.attributes);
          this.$store.commit('product/setAttributes', null)
        }
      }
    }
  }
</script>
