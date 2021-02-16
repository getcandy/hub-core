<template>
  <search-table
    :search-placeholder="$t('Search products by attribute or SKU')"
    :limit="limit"
    :external-term="searchTerm"
    type="products"
    :checkable="checkable"
    class="has-round-edge"
    includes="channels,customer_groups,family,variants,assets.transforms"
    :hide-search="hideSearch"
    :columns="[
      {label: '', field: 'thumbnail'},
      {label: $t('Name'), field: 'name'},
      {label: $t('Stock'), field: 'stock'},
      {label: $t('Channels'), field: 'channels'},
      {label: $t('Customer Groups'), field: 'customer-groups'},
      {label: $t('Purchasable'), field: 'customer-groups'},
    ]"
    @loaded="(e) => $emit('loaded', e)"
  >
    <template v-slot:thumbnail="{ row }">
      <nuxt-link
        :to="{
          name: 'products.view',
          params: {
            id: row.id
          }
        }"
      >
        <thumbnail-loader width="30px" :asset="row.assets.data[0]" />
      </nuxt-link>
    </template>
    <template v-slot:name="{ row }">
      <nuxt-link
        :to="{
          name: 'products.view',
          params: {
            id: row.id
          }
        }"
      >
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
  </search-table>
</template>

<script>
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes.js'
import HasGroups from '../mixins/HasGroups.js'
import EditStock from './EditStock.vue'

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
      default: 30
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
  }
}
</script>

<style scoped>
</style>
