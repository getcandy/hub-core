<template>
  <search-table
    :search-placeholder="$t('Search products by attribute or SKU')"
    :limit="limit"
    :external-term="searchTerm"
    type="products"
    :checkable="checkable"
    class="has-round-edge"
    includes="channels,customer_groups,family,variants,assets.transforms,draft"
    :hide-search="hideSearch"
    :columns="tableColumns"
    @loaded="(e) => $emit('loaded', e)"
  >
    <template v-slot:selection="{ row }" v-if="checkable">
      <input type="checkbox" v-model="selected" :value="row" />
    </template>
    <template v-slot:status="{ row }">
      <span
        class="px-2 py-1 text-xs border rounded"
        :class="{
          'bg-green-50 text-green-500 border-green-300': visibilityStatus(row).status === 'live',
          'bg-blue-50 text-blue-500 border-blue-300': visibilityStatus(row).status === 'limited',
          'bg-red-50 text-red-500 border-red-300': visibilityStatus(row).status === 'unpublished'
        }"
      >
        <span>{{ visibilityStatus(row).label }}</span>
        <!-- <span v-else-if="visibility(row, 'channels') == 'None' || visibility(row, 'customer_groups') == 'None'">Unpublished</span>
        <span v-else-if="visibility(row, 'channels') != 'All' || visibility(row, 'customer_groups') != 'All'">Limited</span>
        <span v-else>Active</span> -->
      </span>
    </template>
    <template v-slot:name="{ row }">

      <nuxt-link
        class="flex items-center block"
        :to="{
          name: 'products.view',
          params: {
            id: row.id
          }
        }"
      >
        <thumbnail-loader width="30px" :asset="row.assets.data[0]" />
        <span class="ml-4">{{ attribute(row.attribute_data, 'name') }}</span>
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
const get = require('lodash/get')
const find = require('lodash/find')

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
  },
  data () {
    return {
      selected: []
    }
  },
  watch: {
    selected(val) {
      this.$emit('selected', val)
    }
  },
  computed: {
    tableColumns() {
      const columns = [
        {label: 'Status', field: 'status'},
        {label: this.$t('Name'), field: 'name', truncate: true},
        {label: this.$t('Stock'), field: 'stock'},
        {label: this.$t('Channels'), field: 'channels'},
        {label: this.$t('Customer Groups'), field: 'customer-groups'},
        {label: this.$t('Purchasable'), field: 'customer-groups'},
      ];

      if (this.checkable) {
        columns.unshift({
          name: null, field: 'selection'
        })
      }
      return columns;
    }
  },
  methods: {
    hasDraft (row) {
      return get(row, 'draft.data', null)
    }
  }
}
</script>

<style scoped>
</style>
