<template>
  <div>
    <toolbar heading="Customers">
      <template v-slot:search>
        <gc-input icon="search" v-model="searchTerm" @input="refresh" :placeholder="$t('Search for customers')" />
      </template>
      <gc-button @click="showCreateModal = true">{{ $t('Create customer')}}</gc-button>
      <quick-view-panel heading="Create a customer" :open="showCreateModal" @close="showCreateModal = false">
        <customer-create @created="handleCustomerCreated" />
      </quick-view-panel>
    </toolbar>
    <div>
      <gc-table
        :data="customers"
        :meta="meta"
        :columns="[
          {label: 'Name', field: 'first_name'},
          {label: 'Company name', field: 'company_name'},
        ]"
        @changePage="changePage"
      >
        <template v-slot:first_name="{ row }">
          <nuxt-link
            :to="{
              name: 'customers.edit',
              params: {
                id: row.id
              }
            }"
          >
            <span v-if="!row.firstname && !row.lastname">Unknown</span>
            <span v-else>{{ row.firstname }} {{ row.lastname }}</span>
          </nuxt-link>
        </template>
        <template v-slot:company_name="{ row }">
          <span v-if="row.company_name">{{ row.company_name }}</span>
          <span v-else class="text-xs text-gray-500">No company name provided</span>
        </template>
      </gc-table>
      <!-- <b-table
        :data="customers"
        paginated
        :striped="true"
        :loading="loading"
        backend-pagination
        @page-change="changePage"
        :total="total"
        :per-page="perPage"
      >
        <template slot-scope="props">
          <b-table-column>
            <figure class="image is-24x24">
              <gravatar :email="props.row.email" class="is-rounded" />
            </figure>
          </b-table-column>
          <b-table-column field="name" :label="$t('Name')">
            <nuxt-link
              :to="{
                name: 'customers.edit',
                params: {
                  id: props.row.id
                }
              }"
            >
              {{ props.row.name }}
            </nuxt-link>
          </b-table-column>
          <b-table-column field="email" :label="$t('Email')">
            {{ props.row.email }}
          </b-table-column>
          <b-table-column field="company_name" :label="$t('Company Name')">
          </b-table-column>
          <b-table-column :field="col.field" :label="$t(col.label)" v-for="(col, colIndex) in customColumns" :key="colIndex">
            <template v-if="col.component">
              <component :is="col.component" v-bind="props.row" />
            </template>
            <template v-else>
              {{ col.value(props.row) }}
            </template>
          </b-table-column>
        </template>
      </b-table> -->
    </div>
  </div>
</template>

<script>
const debounce = require('lodash/debounce')
import CustomerCreate from '../components/CustomerCreate.vue'
import Gravatar from 'vue-gravatar'

export default {
  components: {
    CustomerCreate,
    Gravatar
  },
  head () {
    return {
      title: 'Customers'
    }
  },
  data() {
    return {
      page: 1,
      perPage: 30,
      loading: true,
      searchTerm: null,
      showCreateModal: false,
      total: 0,
      customers: [],
      customColumns: [],
      meta: {},
      states: {
        fetching: 'fetching',
        fetched: 'fetched',
        noResults: 'noResults',
      }
    }
  },
  mounted() {
    this.state = this.states.fetching
    this.fetch()
    this.$nuxt.context.app.$hooks.callHook('customers.listing.columns', this.customColumns)
  },
  methods: {
    changePage(val) {
      this.page = val;
      this.fetch()
    },
    handleCustomerCreated (customer) {
      this.$router.push({
        name: 'customers.edit',
        params: {
          id: customer.id
        }
      })
    },
    refresh: debounce(function () {
      this.fetch()
    }, 300),
    async fetch() {
      this.loading = true;
      const response = await this.$getcandy.on('customers', 'getCustomers',
        '',
        this.perPage,
        0,
        {
          query: {
            page: this.page,
            keywords: this.searchTerm
          }
        }
      )
      const { data } = response;

      this.customers = data.data
      this.meta = data.meta

      // this.customers = data.data;
      // this.page = data.meta.current_page;
      // this.perPage = data.meta.per_page;
      // this.total = data.meta.total;

      // this.loading = false;
    }
  }
}
</script>
