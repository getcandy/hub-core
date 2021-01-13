<template>
  <div v-if="customer">
    <div class="flex p-6 bg-white" >
      <div class="w-3/4 mr-6">
        <div class="grid grid-cols-3 gap-4">
          <form-field :label="$t('First name')">
            <gc-input v-model="customer.firstname" />
          </form-field>

          <form-field :label="$t('Last name')">
            <gc-input v-model="customer.lastname" />
          </form-field>

          <form-field :label="$t('Company name')">
            <gc-input v-model="customer.company_name" />
          </form-field>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <form-field :label="$t(field.label)" v-for="(field, handle) in fields" :key="handle">
            <gc-input v-model="customer.fields[handle]" :type="field.type" />
          </form-field>
        </div>
      </div>
      <div class="w-1/4">
        <h3>Customer groups</h3>
        <fieldset>
            <label
              class="relative flex p-4 mb-1 border rounded-md cursor-pointer rounded-tl-md"
              :class="{
                'border-gray-200': !customerCustomerGroups.includes(group.id),
                'bg-indigo-50 border-indigo-200 z-10': customerCustomerGroups.includes(group.id),
              }"
              v-for="group in customerGroups"
              :key="group.id"
            >
              <div class="flex items-center h-5">
                <input :value="group.id" type="checkbox" v-model="customerCustomerGroups" class="w-4 h-4 text-indigo-600 transition duration-150 ease-in-out cursor-pointer form-checkbox">
              </div>
              <div class="flex flex-col ml-3">
                <span class="block text-sm font-medium leading-5" :class="{
                  'text-gray-900': !customerCustomerGroups.includes(group.id),
                  'text-indigo-900': customerCustomerGroups.includes(group.id),
                }">
                  {{ group.name }}
                </span>
              </div>
            </label>
        </fieldset>
      </div>
    </div>
    <header class="px-6 py-3 bg-white border-t border-b shadow-sm">
      <h3 class="text-sm font-bold text-gray-700">{{ $t('Users') }}</h3>
    </header>
    <gc-table
      :data="users"
      :columns="[
        {label: 'Name', field: 'name'},
        {label: 'Email', field: 'email'},
        {label: '', field: 'actions'},
      ]"
    >
      <template v-slot:name="{ row }">
        {{ row.name }}
      </template>
      <template v-slot:email="{ row }">
        {{ row.email }}
      </template>
      <template v-slot:actions="{ row }">
        <nuxt-link :to="{
          name: 'users-id',
          params: {
            id: row.id
          }
        }">
          {{ $t('View user') }}
        </nuxt-link>
      </template>
    </gc-table>

  </div>
</template>

<script>
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'
const get = require('lodash/get')
const map = require('lodash/map')

export default {
  layout: 'customer',
  mixins: [
    HandlesForms
  ],
  async asyncData({app, params, $store}) {
    const response = await app.$getcandy.on('Customers').getCustomersCustomerId(params.id, 'users,customerGroups')
    // Get customer fields.
    const fieldsResponse = await app.$getcandy.on('Customers').getCustomerFields()

    return {
      customer: get(response, 'data.data'),
      customerCustomerGroups: map(get(response, 'data.data.customer_groups.data', []), (group) => {
        return group.id
      }),
      users: get(response, 'data.data.users.data', []),
      fields: get(fieldsResponse, 'data.data.fields', [])
    }
  },
  mounted() {
    this.$nuxt.context.app.$hooks.callHook('customers.edit.blocks', this.additionalBlocks);
  },
  methods: {
    syncCustomer () {
      this.$store.commit('customer/setModel', this.customer)
    }
  },
  watch: {
    customer: {
      deep: true,
      handler () {
      this.syncCustomer()
      }
    },
    customerFields: {
      deep: true,
      handler () {
      this.syncCustomer()
      }
    },
    customerCustomerGroups: {
      deep: true,
      handler () {
        this.$store.commit('customer/setCustomerGroups', this.customerCustomerGroups)
      }
    },
  },
  computed: {
    customerGroups() {
      return this.$store.state.core.customerGroups
    },
    customerFields () {
      return this.customer ? this.customer.fields : []
    }
  }
}
</script>

<style lang="scss" scoped>
  .profile-header {
    background-color: white;
    padding: 3em 60px;
  }
</style>
