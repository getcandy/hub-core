<template>
  <div>
    <quick-view-panel heading="Search categories" :open="show" width="w-2/3" @close="$emit('close')">
      <search-table
        :limit="15"
        includes="assets.transforms"
        :search-placeholder="$t('Search categories')"
        type="categories"
        :columns="[
          {label: '', field: 'thumbnail'},
          {label: $t('Name'), field: 'name'},
          {label: null, field: 'actions'},
        ]"
      >
        <template v-slot:thumbnail="{ row }">
          <nuxt-link
            :to="{
              name: 'categories.edit.details',
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
              name: 'categories.edit.details',
              params: {
                id: row.id
              }
            }"
          >
            {{ attribute(row.attribute_data, 'name') }}
          </nuxt-link>
        </template>
        <template v-slot:actions="{ row }">
          <gc-button v-if="!selected.includes(row.id)" theme="green" @click="select(row)">
            Attach
          </gc-button>
        </template>
      </search-table>
    </quick-view-panel>
  </div>
</template>

<script>
import { HasAttributes } from '@getcandy/hub-core/src/mixins/Index.js'
import QuickViewPanel from './QuickViewPanel.vue'
const truncate = require('lodash/truncate')

export default {
  components: { QuickViewPanel },
  mixins: [
    HasAttributes
  ],
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
  methods: {
    select (row) {
      this.$emit('selected', row)
    }
  }
}
</script>
