<template>
  <div>
    <div class="bg-white">
      <!-- Get all attribute groups with attributes -->
      <!-- Loop through and then try and pull out the data from the product -->
      <div class="flex">
        <div class="w-2/3 border-r">
          <div v-for="group in attributeGroups" :key="group.id">
            <template v-if="group.attributes.data.length">
              <header class="flex items-center px-6 py-4 text-sm text-gray-600 uppercase bg-gray-100 cursor-pointer">
                <span class="font-bold">{{ getLocaleValue(group.name) }}</span>
              </header>
              <div class="px-6 my-4">
                <div v-for="(att, attributeIndex) in group.attributes.data" :key="attributeIndex" class="mb-4">
                  <template v-if="attributeData[att.handle]">
                    <h4 class="text-sm font-bold">
                      {{ getLocaleValue(att.name) }}
                    </h4>
                    <div v-if="attribute(attributeData, att.handle, 900)" v-html="attribute(attributeData, att.handle, 900) " />
                    <span v-else class="text-sm text-gray-400">{{ $t('No Value') }}</span>
                    <!-- <div v-if="attributeData[attribute.handle].webstore.en" v-html="attributeData[attribute.handle].webstore.en" />
                    <span v-else class="text-gray-500">No Value</span> -->
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="w-1/3">
          <h3 class="p-6 font-bold">
            Variants
          </h3>
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
import HasLocalisedValues from '@getcandy/hub-core/src/mixins/HasLocalisedValues.js'
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'

export default {
  mixins: [
    HasAttributes,
    HasLocalisedValues
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
      return this.item.recyclable.data.attribute_data
    }
  }
}
</script>
