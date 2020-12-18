<template>
  <search-table
    :search-placeholder="$t('Search products by attribute or SKU')"
    :limit="limit"
    :external-term="searchTerm"
    type="products"
    :checkable="checkable"
    class="has-round-edge"
    includes="channels,customer_groups,family,variants,assets.transforms"
    :hideSearch="hideSearch"
    @loaded="(e) => $emit('loaded', e)"
    :columns="[
      {label: '', field: 'thumbnail'},
      {label: $t('Name'), field: 'name'},
      {label: $t('Stock'), field: 'stock'},
      {label: $t('Channels'), field: 'channels'},
      {label: $t('Customer Groups'), field: 'customer-groups'},
      {label: $t('Purchasable'), field: 'customer-groups'},
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
    <template v-slot:stock="{ row }">
      <edit-stock :product="row" />
    </template>
    <template v-slot:channels="{ row }">
      {{ visibility(row, 'channels') }}
    </template>
    <template v-slot:customer-groups="{ row }">
      {{ visibility(row, 'customer_groups') }}
    </template>
    <template v-slot:purchasable="{ row }">
      <span class="tag is-success-table">{{ purchasable(row, 'customer_groups') }}</span>
    </template>
    <!-- <template slot-scope="props">
      <slot name="pre-columns" v-bind="props" />
      <b-table-column field="thumbnail" label="">
        <nuxt-link :to="{
          name: 'products.view',
          params: {
              id: props.row.id
          }
        }">
          <thumbnail-loader width="30px" :asset="props.row.assets.data[0]"></thumbnail-loader>
        </nuxt-link>
      </b-table-column>
      <b-table-column field="name" :label="$t('Name')" sortable>
        <nuxt-link :to="{
          name: 'products.view',
          params: {
              id: props.row.id
          }
        }">
        {{ attribute(props.row.attribute_data, 'name') }}
        </nuxt-link>
      </b-table-column>
      <b-table-column field="stock" :label="$t('Stock')">
        <edit-stock :product="props.row" />
      </b-table-column>
      <b-table-column field="channels" :label="$t('Channels')">
        {{ visibility(props.row, 'channels') }}
      </b-table-column>
      <b-table-column field="customer_groups" :label="$t('Customer Groups')">
        {{ visibility(props.row, 'customer_groups') }}
      </b-table-column>
      <b-table-column field="purchasable" :label="$t('Purchasable')">
        <span class="tag is-success-table">{{ purchasable(props.row, 'customer_groups') }}</span>
      </b-table-column>
    </template> -->
  </search-table>
</template>

<script>
const get = require('lodash/get')
const map = require('lodash/map')
const debounce = require('lodash/debounce')
const first = require('lodash/first')
import HasGroups from '../mixins/HasGroups.js'
import EditStock from './EditStock.vue'
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes.js'

export default {
  components: {
    EditStock
  },
  mixins: [
    HasGroups,
    HasAttributes
  ],
  props: {
    limit: {
      type: Number,
      default: 30,
    },
    hideSearch: {
      type: Boolean,
      default: true
    },
    checkable: {
      type: Boolean,
      default: false
    },
    searchTerm: {
      type: String,
      default: null
    }
  },
}
</script>

<style scoped>
</style>
