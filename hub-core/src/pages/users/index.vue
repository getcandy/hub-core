<template>
  <div>
    <toolbar heading="Users">
      <div slot="search">
        <gc-input v-model="searchTerm" @input="refresh" :placeholder="$t('Search users')" icon="search" />
      </div>
        <gc-button @click="showCreatePanel = true">Create user</gc-button>
    </toolbar>
    <quick-view-panel :open="showCreatePanel" heading="Create User"  @close="showCreatePanel = false">
          <form @submit.prevent="createUser" autocomplete="chrome-off">
            <div class="p-3">
              <div class="grid grid-cols-2 gap-4">
                <gc-form-field label="First Name" :error="getFirstFormError('firstname')" required>
                  <gc-input v-model="newUser.firstname" required/>
                </gc-form-field>
                <gc-form-field label="Last Name" :error="getFirstFormError('lastname')" required>
                  <gc-input v-model="newUser.lastname" required/>
                </gc-form-field>
              </div>
              <gc-form-field label="Email" :error="getFirstFormError('email')" required>
                <gc-input v-model="newUser.email" type="email" required/>
              </gc-form-field>
              <gc-form-field label="Password" :error="getFirstFormError('password')" required>
                <gc-input v-model="newUser.password" type="password" required/>
              </gc-form-field>
              <gc-form-field label="Confirm Password" required>
                <gc-input v-model="newUser.password_confirmation" type="password" required/>
              </gc-form-field>
              <gc-form-field label="Customer" instructions="Choose a customer to attach, if blank a new one will be created">
                <gc-search-input
                  :rows="customers"
                  v-model="newUser.customer_id"
                  @search="searchCustomers"
                  @reset="resetCustomerSearch"
                  placeholder="Search by company name"
                  label-field="company_name"
                  value-field="id"
                >
                <template v-slot:row="{ row }">
                  <span class="font-normal block truncate">
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
      :meta="meta"
      @changePage="changePage"
      :columns="[
        {label: $t('Name'), field: 'name'},
        {label: $t('Email'), field: 'email'},
        {label: $t('Customer'), field: 'customer'},
      ]"
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
            }">
              {{ row.email }}
            </nuxt-link>
      </template>
      <template v-slot:customer="{ row }">
        <span v-if="row.customer.data.company_name">{{ row.customer.data.company_name }}</span>
        <span v-else>{{ row.customer.data.firstname }} {{ row.customer.data.firstname }}</span>
      </template>
    </gc-table>
  </div>
</template>

<script>
const debounce = require('lodash/debounce')
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'

export default {
  mixins: [
    HasAttributes,
    HandlesForms
  ],
  head () {
    return {
      title: 'Users'
    }
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
  mounted () {
    this.fetch()
    // this.$nuxt.context.app.$hooks.callHook('customers.listing.columns', this.customColumns);
  },
  methods: {
    async searchCustomers (keywords) {
      const response = await this.$getcandy.on('Customers').getCustomers(
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
    changePage (val) {
      this.page = val
      this.fetch()
    },
    createUser () {
      const response = this.$getcandy.on('Users').postUsers(this.newUser).then(response => {
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
        this.fetch()
      }).catch(e => {
        this.setFormErrors(e.response.data.errors)
      })
    },
    refresh: debounce(function () {
      this.fetch()
    }, 300),
    async fetch () {
      const response = await this.$getcandy.on('Users').getUsers('', this.perPage, {
        query: {
          page: this.page,
          keywords: this.searchTerm || null,
        }
      })
      const { data } = response

      this.users = data.data
      this.meta = data.meta
      this.page = data.meta.current_page
      this.perPage = data.meta.per_page
      this.total = data.meta.total
    }
  }
}
</script>
