<template>
  <div>
    <div class="bg-white">
      <!-- Get all attribute groups with attributes -->
      <!-- Loop through and then try and pull out the data from the product -->
      <div class="flex">
        <div class="w-2/3 border-r">
          <div v-for="group in attributeGroups" :key="group.id">
            <template v-if="group.attributes.data.length">
              <header class="flex bg-gray-100 py-4 px-6 cursor-pointer text-sm items-center uppercase text-gray-600">
                <span class="font-bold">{{ getLocaleValue(group.name) }}</span>
              </header>
              <div class="px-6 my-4">
                <div class="mb-4" v-for="(attribute, attributeIndex) in group.attributes.data" :key="attributeIndex">
                  <template v-if="attributeData[attribute.handle]">
                    <h4 class="font-bold text-sm">{{ getLocaleValue(attribute.name) }}</h4>
                    <div v-html="attributeData[attribute.handle].webstore.en" v-if="attributeData[attribute.handle].webstore.en" />
                    <span class="text-gray-500" v-else>No Value</span>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="w-1/3">
          <h3 class="font-bold  p-6">Variants</h3>
          <div class="search-table">
            <div class="b-table">
              <table class="table full-width">
                <thead>
                  <tr>
                    <th>{{ $t('SKU') }}</th>
                    <th>{{ $t('Price') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="variant in model.variants.data" :key="variant.id">
                    <td>{{ variant.sku }}</td>
                    <td>{{ $format.currency(variant.price, null, false) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
      <!--<div class="card">
        <b-tabs :expanded="true">
            <b-tab-item label="Attributes">
              <b-field v-for="(attributeData, handle) in item.recyclable.attribute_data" :key="handle" :label="handle">
                <span v-html="attribute(item.recyclable.attribute_data, handle)" />
              </b-field>
            </b-tab-item>

            <b-tab-item label="Variants">
            </b-tab-item>

            <b-tab-item label="Books">
            </b-tab-item>
        </b-tabs>
      </div>-->
    </div>
</template>

<script>
  import { find } from 'lodash'
  import HasLocalisedValues from '@getcandy/hub-core/src/mixins/HasLocalisedValues.js'
  import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes.js'

  export default {
    mixins: [
      HasAttributes,
      HasLocalisedValues,
    ],
    props: {
      item: {
        type: Object,
        required: true
      },
      model: {
        type: Object,
        required: true
      },
      attributeGroups: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      attributeData () {
        return this.item.recyclable.attribute_data
      }
    }
  }
</script>
