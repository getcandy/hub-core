<template>
  <div v-if="customer">
    <div class="bg-white p-6" >
      <div class="grid gap-4 grid-cols-3">
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
    </div>
    <div class="p-6 bg-gray-100">
      <h3 class="font-medium uppercase">Users</h3>
    </div>
    <gc-table
      :data="users"
      :columns="[
        {label: 'Name', field: 'name'},
        {label: 'Email', field: 'email'},
        {label: '', field: 'actions'},
      ]"
    >
      <template v-slot:name="{ name }">
        {{ name }}
      </template>
      <template v-slot:email="{ email }">
        {{ email }}
      </template>
      <template v-slot:actions="{ id }">
        <nuxt-link :to="{
          name: 'users-id',
          params: {
            id
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

export default {
  layout: 'customer',
  mixins: [
    HandlesForms
  ],
  data () {
    return {
    }
  },
  async asyncData({app, params}) {
    const response = await app.$getcandy.on('Customers').getCustomersCustomerId(params.id, 'users')
    return {
      customer: get(response, 'data.data'),
      users: get(response, 'data.data.users.data', [])
    }
  },
  mounted() {
    this.$nuxt.context.app.$hooks.callHook('customers.edit.blocks', this.additionalBlocks);
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .profile-header {
    background-color: white;
    padding: 3em 60px;
  }
</style>
