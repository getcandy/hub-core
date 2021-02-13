<template>
  <div>
    <toolbar heading="Shipping Methods">
      <div>
        <gc-button @click="showCreatePanel = !showCreatePanel">Create shipping method</gc-button>
      </div>
    </toolbar>
    <gc-table
      :data="shippingMethods"
      :meta="meta"
      @changePage="changePage"
      :columns="[
        {label: $t('Name'), field: 'name'},
      ]"
    >
      <template v-slot:name="{ row }">
        <nuxt-link :to="{
          name: 'shipping-methods.edit.details',
          params: {
              id: row.id
          }
        }">
          {{ attribute(row.attribute_data, 'name') }}
        </nuxt-link>
      </template>
    </gc-table>
    <quick-view-panel heading="Create Shipping Method" :open="showCreatePanel" @close="showCreatePanel = false">
      <shipping-method-create @created="handleCreated" />
    </quick-view-panel>
  </div>
</template>

<script>
  const each = require('lodash/each')
  import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
  import ShippingMethodCreate from '../../components/ShippingMethodCreate'

  export default {
    components: {
      ShippingMethodCreate
    },
    mixins: [
      HasAttributes
    ],
    data() {
      return {
        showCreatePanel: false,
        page: 1,
        perPage: 30,
        total: 0,
        meta: {},
        shippingMethods: [],
        customColumns: [],
      }
    },
    mounted() {
      this.fetch()
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
      getCustomerGroups(prices) {
        let groups = [];
        each(prices, price => {
          each(price.customer_groups.data, group => {
            if (group.visible && !groups.includes(group.name)) {
              groups.push(group.name);
            }
          });
        });
        return groups;
      },
      async fetch() {
        const response = await this.$gc.shippingMethods.get({
          page: this.page,
          full_response: true,
          per_page: this.perPage,
          includes: 'prices.customer_groups,zones'
        });
        const { data } = response;
        this.meta = data.meta;
        this.shippingMethods = data.data;
        // this.page = data.meta.pagination.current_page;
        // this.perPage = data.meta.pagination.per_page;
        // this.total = data.meta.pagination.total;
      }
    }
  }
</script>

<style scoped>

</style>
