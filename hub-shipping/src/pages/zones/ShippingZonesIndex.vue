<template>
  <div>
    <toolbar heading="Shipping Zones">
      <div>
        <gc-button @click="showCreatePanel = true">{{ $t('Create Shipping Zone') }}</gc-button>
      </div>
    </toolbar>
    <gc-table
      :data="zones"
      :meta="meta"
      @changePage="changePage"
      :columns="[
        {label: 'Name', field: 'name'},
      ]"
    >
    <template v-slot:name="{ row }">
        <nuxt-link :to="{
          name: 'shipping-zones.edit.details',
          params: {
            id: row.id
          }
        }">
          {{ row.name }}
        </nuxt-link>
      </template>
    </gc-table>
    <quick-view-panel heading="Create Shipping Zone" :open="showCreatePanel" @close="showCreatePanel = false">
      <shipping-zone-create @created="handleCreated" />
    </quick-view-panel>
  </div>
</template>

<script>
  const each = require('lodash/each')

  import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
  import ShippingZoneCreate from '../../components/ShippingZoneCreate'

  export default {
    components: {
      ShippingZoneCreate
    },
    mixins: [
      HasAttributes
    ],
    data() {
      return {
        page: 1,
        perPage: 30,
        meta: {},
        total: 0,
        zones: [],
        customColumns: [],
        showCreatePanel: false,
      }
    },
    mounted() {
      this.fetch()
      // this.$nuxt.context.app.$hooks.callHook('customers.listing.columns', this.customColumns);
    },
    methods: {
      async handleCreated () {
        this.showCreatePanel = false
        await this.fetch()
      },
      changePage(val) {
        this.page = val;
        this.fetch()
      },
      async fetch() {
        const response = await this.$gc.shippingZones.get({
          page: this.page,
          per_page: this.perPage,
          includes: 'prices.customer_groups,zones'
        });
        const { data } = response;
        this.meta = data.meta;
        this.zones = data.data;
        // const response = await this.$gc.customers.get({
        //   page: this.page,
        //   per_page: this.perPage,
        //   includes: 'details'
        // });
        // const { data } = response;

        // this.customers = data.data;
        // this.page = data.meta.pagination.current_page;
        // this.perPage = data.meta.pagination.per_page;
        // this.total = data.meta.pagination.total;
      }
    }
  }
</script>

<style scoped>

</style>
