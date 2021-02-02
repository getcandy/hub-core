<template>
  <div>
    <quick-view-panel heading="Search products" :open="show" @close="show = false" width="w-2/3">
      <search-table
        :limit="10"
        includes="assets.transforms"
        :search-placeholder="$t('Search products')"
        type="products"
        :columns="[
          {label: '', field: 'thumbnail'},
          {label: $t('Name'), field: 'name'},
          {label: null, field: 'actions'},
        ]"
      >
        <template v-slot:thumbnail="{ row }">
          <nuxt-link :to="{
            name: 'products.view',
            params: {
              id: row.id
            }
          }">
            <thumbnail-loader width="30px" :asset="row.assets.data[0]"></thumbnail-loader>
          </nuxt-link>
        </template>
        <template v-slot:name="{ row }">
          <nuxt-link :to="{
            name: 'products.view',
            params: {
              id: row.id
            }
          }">
            {{ attribute(row.attribute_data, 'name') }}
          </nuxt-link>
        </template>
        <template v-slot:actions="{ row }">
          <gc-button @click="select(row)" theme="green" v-if="!selected.includes(row.id)">Attach</gc-button>
        </template>
      </search-table>
    </quick-view-panel>
  </div>
</template>

<script>
const truncate = require('lodash/truncate')
import { HasAttributes } from '@getcandy/hub-core/src/mixins/Index.js'

export default {
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    HasAttributes
  ],
  methods: {
    select (row) {
      this.$emit('selected', row)
    }
  }
}
</script>
