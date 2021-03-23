<template>
  <div>
    <toolbar :heading="$t('Available Attributes')">
      <gc-button @click="showCreateModal = true">
        {{ $t('Create attribute') }}
      </gc-button>
      <quick-view-panel :heading="$t('Create attribute')" :open="showCreateModal" @close="showCreateModal = false">
        <create-attribute :attribute-groups="attributeGroups" @close="showCreateModal = false" />
      </quick-view-panel>
    </toolbar>

    <gc-table
      :data="attributes"
      :meta="meta"
      :columns="[
        {label: 'Name', field: 'name'},
        {label: 'Handle', field: 'handle'},
        {label: 'Group', field: 'group'},
        {label: 'Type', field: 'type'},
        {label: 'Searchable', field: 'searchable'},
        {label: 'Required', field: 'required'},
        {label: 'Filterable', field: 'filterable'},
      ]"
      @changePage="changePage"
    >
      <template v-slot:name="{ row }">
        <nuxt-link :to="{ name: 'settings-attributes-id', params: { id: row.id }}">
          {{ getLocaleValue(row.name) }}
        </nuxt-link>
      </template>
      <template v-slot:handle="{ row }">
        <code>{{ row.handle }}</code>
      </template>
      <template v-slot:group="{ row }">
        {{ getLocaleValue(row.group.data.name) }}
      </template>
      <template v-slot:type="{ row }">
        {{ $t(row.type) }}
      </template>
      <template v-slot:searchable="{ row }">
        <gc-icon :icon="row.searchable ? 'check' : 'x'" :class="{'text-green-500': row.searchable, 'text-gray-400': !row.searchable}" />
      </template>
      <template v-slot:required="{ row }">
        <gc-icon :icon="row.required ? 'check' : 'x'" :class="{'text-green-500': row.required, 'text-gray-400': !row.required}" />
      </template>
      <template v-slot:filterable="{ row }">
        <gc-icon :icon="row.filterable ? 'check' : 'x'" :class="{'text-green-500': row.filterable, 'text-gray-400': !row.filterable}" />
      </template>
      <!-- <b-table-column field="searchable" :label="$t('Searchable')">
        <b-icon :icon="props.row.searchable ? 'check-line' : 'close-line'" />
      </b-table-column>
      <b-table-column field="required" :label="$t('Required')">
        <b-icon :icon="props.row.required ? 'check-line' : 'close-line'" />
      </b-table-column>
      <b-table-column field="filterable" :label="$t('Filterable')">
        <b-icon :icon="props.row.filterable ? 'check-line' : 'close-line'" />
      </b-table-column> -->
    </gc-table>

    <div class="search-table">
      <!-- <b-table
        @page-change="changePage"
        :data="attributes"
        :total="total"
        :per-page="perPage"
        paginated
        backend-pagination
      >
        <template slot-scope="props">
          <b-table-column field="name" :label="$t('Name')">
            <nuxt-link :to="{ name: 'settings-attributes-id', params: { id: props.row.id }}">
              {{ getLocaleValue(props.row.name) }}
            </nuxt-link>
          </b-table-column>
          <b-table-column field="handle" :label="$t('Handle')">
            <code>{{ props.row.handle }}</code>
          </b-table-column>
          <b-table-column field="group" :label="$t('Group')">
            {{ getLocaleValue(props.row.group.data.name) }}
          </b-table-column>
          <b-table-column field="type" :label="$t('Type')">
            {{ $t(props.row.type) }}
          </b-table-column>
          <b-table-column field="searchable" :label="$t('Searchable')">
            <b-icon :icon="props.row.searchable ? 'check-line' : 'close-line'" />
          </b-table-column>
          <b-table-column field="required" :label="$t('Required')">
            <b-icon :icon="props.row.required ? 'check-line' : 'close-line'" />
          </b-table-column>
          <b-table-column field="filterable" :label="$t('Filterable')">
            <b-icon :icon="props.row.filterable ? 'check-line' : 'close-line'" />
          </b-table-column>
        </template>
      </b-table> -->
    </div>
  </div>
</template>

<script>
const get = require('lodash/get')

export default {
  layout: 'settings',
  async fetch () {
    const response = await this.$gc.attributeGroups.get({})
    this.attributeGroups = response.data.data
  },
  data () {
    return {
      attributes: [],
      attributeGroups: [],
      meta: {},
      page: 1,
      perPage: 15,
      total: 0,
      showCreateModal: false
    }
  },
  async mounted () {
    await this.fetch()
  },
  methods: {
    getLocaleValue (data) {
      return get(data, this.locale, data.en)
    },
    async fetch () {
      const response = await this.$gc.attributes.get({
        page: this.page,
        includes: 'group',
        per_page: this.perPage
      })

      const data = response.data.data
      const meta = response.data.meta
      this.meta = meta
      this.attributes = data
      this.page = meta.current_page
      this.perPage = meta.per_page
      this.total = meta.total
    },
    changePage (page) {
      this.page = page
      this.fetch()
    }
  },
  head () {
    return {
      title: this.$t('Available Attributes')
    }
  },
  locale () {
    return this.$store.state.core.locale
  }
}
</script>
