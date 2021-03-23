<template>
  <div>
    <toolbar heading="Users">
      <div slot="search">
        <gc-input v-model="searchTerm" :placeholder="$t('Search users')" icon="search" @input="updateSearch" />
      </div>
      <gc-button @click="showCreatePanel = true">
        Create user
      </gc-button>
    </toolbar>
    <quick-view-panel :open="showCreatePanel" heading="Create User" @close="showCreatePanel = false">
      <form autocomplete="chrome-off" @submit.prevent="createUser">
        <div class="p-3">
          <div class="grid grid-cols-2 gap-4">
            <gc-form-field label="First Name" :error="getFirstFormError('firstname')" required>
              <gc-input v-model="newUser.firstname" required />
            </gc-form-field>
            <gc-form-field label="Last Name" :error="getFirstFormError('lastname')" required>
              <gc-input v-model="newUser.lastname" required />
            </gc-form-field>
          </div>
          <gc-form-field label="Email" :error="getFirstFormError('email')" required>
            <gc-input v-model="newUser.email" type="email" required />
          </gc-form-field>
          <gc-form-field label="Password" :error="getFirstFormError('password')" required>
            <gc-input v-model="newUser.password" type="password" required />
          </gc-form-field>
          <gc-form-field label="Confirm Password" required>
            <gc-input v-model="newUser.password_confirmation" type="password" required />
          </gc-form-field>
          <gc-form-field label="Customer" instructions="Choose a customer to attach, if blank a new one will be created">
            <gc-search-input
              v-model="newUser.customer_id"
              :rows="customers"
              placeholder="Search by company name"
              label-field="company_name"
              value-field="id"
              @search="searchCustomers"
              @reset="resetCustomerSearch"
            >
              <template v-slot:row="{ row }">
                <span class="block font-normal truncate">
                  {{ row.company_name || `${row.firstname} ${row.lastname}` }}
                </span>
              </template>
            </gc-search-input>
          </gc-form-field>
          <gc-button>{{ $t('Create user') }}</gc-button>
        </div>
      </form>
    </quick-view-panel>
    <gc-table
      :data="users"
      :loading="$fetchState.pending"
      :meta="meta"
      :columns="[
        {label: $t('Name'), field: 'name'},
        {label: $t('Email'), field: 'email', sort: 'email'},
        {label: $t('Customer'), field: 'customer', sort: 'customers.company_name'},
        {label: $t('Date Created'), field: 'created_at'},
      ]"
      @sort="handleSorting"
      @changePage="changePage"
    >
      <template v-slot:name="{ row }">
        {{ row.name }}
      </template>
      <template v-slot:email="{ row }">
        <nuxt-link
          :to="{
            name: 'users-id',
            params: {
              id: row.id
            }
          }"
        >
          {{ row.email }}
        </nuxt-link>
      </template>
      <template v-slot:customer="{ row }">
        <span v-if="row.customer.data">
          <span v-if=" row.customer.data.company_name">{{ row.customer.data.company_name }}</span>
          <span v-else class="text-xs text-gray-500">No company name provided</span>
        </span>
        <span v-else>
          {{ row.name }}
        </span>
      </template>
      <template v-slot:created_at="{ row }">
        {{ $format.date(row.created_at) }}
      </template>
    </gc-table>
  </div>
</template>

<script>
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'
const debounce = require('lodash/debounce')

export default {
  mixins: [
    HasAttributes,
    HandlesForms
  ],
  async fetch () {
    const { keywords, page, sort } = this.$route.query
    this.searchTerm = keywords
    const query = {
      page: page || 1,
      keywords,
      sort
    }

    const response = await this.$getcandy.on('users', 'getUsers', 'customer', this.perPage, {
      query
    })
    const { data } = response

    this.users = data.data
    this.meta = data.meta
    this.page = data.meta.current_page
    this.perPage = data.meta.per_page
    this.total = data.meta.total
  },
  data () {
    return {
      page: 1,
      perPage: 30,
      total: 0,
      meta: {},
      searchTerm: null,
      users: [],
      showCreatePanel: false,
      customers: [],
      userCreateErrors: [],
      sorting: {},
      newUser: {
        customer_id: null,
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  watch: {
    '$route.query': '$fetch'
  },
  methods: {
    handleSorting (sort) {
      this.updateQuery({
        sort: sort ? `${sort.field}:${sort.direction}` : null
      })
    },
    async searchCustomers (keywords) {
      const response = await this.$getcandy.on('customers', 'getCustomers',
        'customer',
        20,
        0,
        {
          query: {
            keywords
          }
        }
      )
      this.customers = response.data.data
    },
    resetCustomerSearch () {
      this.customers = []
      this.newUser.customerId = null
    },
    updateQuery (incomingQuery) {
      const { query } = this.$route
      this.$router.replace({
        path: this.$route.path,
        query: {
          ...query,
          ...incomingQuery
        }
      })
    },
    changePage (page) {
      this.updateQuery({
        page
      })
    },
    async createUser () {
      try {
        await this.$getcandy.on('users', 'postUsers', this.newUser)
        this.showCreatePanel = false
        this.newUser = {
          customer_id: null,
          firstname: null,
          lastname: null,
          email: null,
          password: null,
          password_confirmation: null
        }
        this.$notify.queue('success', 'User Created')
        this.$fetch()
      } catch (error) {
        this.setFormErrors(error.response.data.errors)
      }
    },
    updateSearch: debounce(function () {
      this.updateQuery({
        page: 1,
        keywords: this.searchTerm
      })
    }, 300)
  },
  head () {
    return {
      title: 'Users'
    }
  }
}
</script>
