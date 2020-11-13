<template>
  <div>
    <toolbar heading="Shipping Zones" />
    <gc-table
      :data="zones"
      :meta="meta"
      @changePage="changePage"
      :columns="[
        {label: 'Name', field: 'name'},
      ]"
    >
    <template v-slot:name="row">
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
  </div>
</template>

<script>
  const each = require('lodash/each')

  import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'

  export default {
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
      }
    },
    mounted() {
      this.fetch()
      // this.$nuxt.context.app.$hooks.callHook('customers.listing.columns', this.customColumns);
    },
    methods: {
      changePage(val) {
        console.log(val)
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
