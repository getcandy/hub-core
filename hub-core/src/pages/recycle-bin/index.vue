<template>
  <div>
    <toolbar heading="Recycling Bin">
      <gc-input v-model="searchTerm" :placeholder="$t('Search recyling bin')" icon="search" @input="refresh" />
    </toolbar>
    <div v-if="!items.length" />
    <gc-table
      :data="items"
      :loading="fetching"
      :columns="[
        {label: '', field: 'thumbnail'},
        {label: $t('Name'), field: 'name'},
        {label: $t('Deleted At'), field: 'deleted_at'},
        {label: $t('Type'), field: 'type'},
      ]"
    >
      <template v-slot:thumbnail="{ row }">
        <thumbnail-loader width="30px" :asset="row" />
      </template>
      <template v-slot:name="{ row }">
        <nuxt-link
          :to="{
            name: 'recycle-bin-id',
            params: {
              id: row.id
            },
            query: {
              type: getTypeLabel(row.type),
            }
          }"
        >
          {{ row.name }}
        </nuxt-link>
      </template>
      <template v-slot:deleted_at="{ row }">
        {{ $format.date(row.deleted_at) }}
      </template>
      <template v-slot:type="{ row }">
        {{ getTypeLabel(row.type) }}
      </template>
    </gc-table>
  </div>
</template>

<script>
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
const debounce = require('lodash/debounce')

export default {
  mixins: [
    HasAttributes
  ],
  data () {
    return {
      page: 1,
      perPage: 30,
      total: 0,
      searchTerm: null,
      fetching: true,
      items: []
    }
  },
  mounted () {
    this.fetch()
    // this.$nuxt.context.app.$hooks.callHook('customers.listing.columns', this.customColumns);
  },
  methods: {
    changePage (val) {
      this.page = val
      this.fetch()
    },
    getTypeLabel (val) {
      return val.split('\\').slice(-1)[0]
    },
    refresh: debounce(function () {
      this.fetch()
    }, 300),
    async fetch () {
      this.fetching = true
      const response = await this.$gc.recycleBin.get({
        page: this.page,
        per_page: this.perPage,
        full_response: true,
        term: this.searchTerm
      })
      const { data } = response

      this.items = data.data
      this.page = data.meta.current_page
      this.perPage = data.meta.per_page
      this.total = data.meta.total
      this.fetching = false
    }
  },
  head () {
    return {
      title: 'Recycling Bin'
    }
  }
}
</script>
