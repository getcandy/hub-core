<template>
  <div>
  <toolbar heading="Recycling Bin">
    <gc-input v-model="searchTerm" @input="refresh" :placeholder="$t('Search recyling bin')" icon="search-line" />
  </toolbar>
    <div v-if="!items.length">
    </div>
    <gc-table
      :data="items"
      :columns="[
        {label: '', field: 'thumbnail'},
        {label: $t('Name'), field: 'name'},
        {label: $t('Deleted At'), field: 'deleted_at'},
        {label: $t('Type'), field: 'type'},
      ]"
    >
      <template v-slot:thumbnail="row">
        <thumbnail-loader width="30px" :asset="row"></thumbnail-loader>
      </template>
      <template v-slot:name="row">
        <nuxt-link
            :to="{
              name: 'recycle-bin-id',
              params: {
                id: row.id
              },
              query: {
                type: getTypeLabel(row.type),
              }
            }">
              {{ row.name }}
            </nuxt-link>
      </template>
      <template v-slot:deleted_at="row">
        {{ $format.date(row.deleted_at) }}
      </template>
      <template v-slot:type="row">
        {{ getTypeLabel(row.type) }}
      </template>
    </gc-table>
  </div>
</template>

<script>
const debounce = require('lodash/debounce')
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'

export default {
  mixins: [
    HasAttributes
  ],
  head () {
    return {
      title: 'Recycling Bin'
    }
  },
  data () {
    return {
      page: 1,
      perPage: 30,
      total: 0,
      searchTerm: null,
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
      const response = await this.$gc.recycleBin.get({
        page: this.page,
        per_page: this.perPage,
        full_response: true,
        terms: this.searchTerm
      })
      const { data } = response

      this.items = data.data
      this.page = data.meta.current_page
      this.perPage = data.meta.per_page
      this.total = data.meta.total
    }
  }
}
</script>
