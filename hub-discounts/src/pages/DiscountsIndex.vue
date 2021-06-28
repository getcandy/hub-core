<template>
  <div>
    <toolbar heading="Discounts">
      <div>
        <gc-button @click="createPanelVisible = !createPanelVisible">Create discount</gc-button>
      </div>
    </toolbar>
    <quick-view-panel :open="createPanelVisible" :heading="$t('Create Discount')" @close="createPanelVisible = false">
      <div class="p-6">
        <discount-create />
      </div>
    </quick-view-panel>
    <gc-table
      :data="discounts"
      :meta="meta"
      @changePage="changePage"
      :columns="[
        {label: 'Status', field: 'status'},
        {label: 'Name', field: 'name'},
        {label: 'Start', field: 'start'},
        {label: 'End', field: 'end'},
        {label: 'Uses', field: 'uses'},
      ]"
    >
      <template v-slot:status="{ row }">
        <span class="px-3 py-2 text-sm rounded" :class="{
          'bg-green-100 text-green-600 border-green-400': !!row.status,
          'bg-gray-100 text-gray-600 border-gray-400': !row.status,
        }">
          {{ $t(!!row.status ? 'Enabled' : 'Disabled') }}
        </span>
      </template>
      <template v-slot:name="{ row }">
        <nuxt-link
          :to="{
            name: 'discounts.edit.details',
            params: {
              id: row.id
            }
          }"
        >
          {{ attribute(row.attribute_data, 'name') }}
        </nuxt-link>
      </template>
      <template v-slot:start="{ row }">
        <span v-if="row.start_at">{{ $format.date(row.start_at) }}</span>
        <span v-else>&infin;</span>
      </template>
      <template v-slot:end="{ row }">
        <span v-if="row.end_at">{{ $format.date(row.end_at) }}</span>
        <span v-else>&infin;</span>
      </template>
      <template v-slot:uses="{ row }">
        {{ row.uses }}
      </template>
    </gc-table>
  </div>
</template>

<script>
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
import DiscountCreate from '../components/DiscountCreate'

export default {
  head () {
    return {
      title: 'Discounts'
    }
  },
  components: {
    DiscountCreate
  },
  mixins: [
    HasAttributes
  ],
  data() {
    return {
      page: 1,
      meta: {},
      createPanelVisible: false,
      discounts: []
    }
  },
  mounted() {
    this.fetch()
    // this.$nuxt.context.app.$hooks.callHook('customers.listing.columns', this.customColumns);
  },
  methods: {
    changePage(val) {
      this.page = val
      this.fetch()
    },
    async fetch() {
      const response = await this.$getcandy.on('discounts', 'getDiscounts', {
        query: {
          page: this.page,
          full_response: true,
          per_page: this.perPage
        }
      })
      const { data } = response

      this.discounts = data.data
      this.meta = data.meta
    }
  }
}
</script>
