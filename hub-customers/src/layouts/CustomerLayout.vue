<template>
  <div v-if="customer">
    <default-layout>
      <toolbar :heading="displayName" :subHeading="customer.company_name">
        <gc-button @click="save">Save Customer</gc-button>
      </toolbar>
      <div class="tabs tabs-large">
        <ul>
          <nuxt-link tag="li" exact-active-class="is-active" :to="{
            name: tab.route,
            params: $route.params
          }" v-for="(tab, index) in tabs" :key="index">
            <a>{{ $t(tab.label) }}</a>
          </nuxt-link>
        </ul>
      </div>
        <nuxt />
    </default-layout>
  </div>
</template>

<script>
const map = require('lodash/map')
const each = require('lodash/each')
const get = require('lodash/get')
import Gravatar from 'vue-gravatar'
import DefaultLayout from '@getcandy/hub-core/src/layouts/Default.vue'

export default {
  components: {
    Gravatar,
    DefaultLayout
  },
  data () {
    return {
      additionalBlocks: [],
      details: {},
      selectedGroups: [],
      tabs: [{
        label: 'Customer Details',
        route: 'customers.edit'
      }]
    }
  },
  async mounted() {
    const response = await this.$getcandy.on('customers', 'getCustomersCustomerId', this.$route.params.id, 'users,customerGroups')
    this.$store.commit('customer/setModel', response.data.data);
    this.$store.commit('customer/setCustomerGroups', map(get(response, 'data.data.customer_groups.data', []), (group) => {
      return group.id
    }))
  },
  methods: {
    async save () {
      // Save customer
      await this.$getcandy.on('customers', 'putCustomersCustomerId',
        this.customer.id,
        {
          firstname: this.customer.firstname,
          lastname: this.customer.lastname,
          contact_number: this.customer.contact_number,
          alt_contact_number: this.customer.alt_contact_number,
          company_name: this.customer.company_name,
          vat_no: this.customer.vat_no,
          fields: this.customer.fields
        }
      )

      await this.$getcandy.on('customers', 'postCustomersCustomerIdCustomerGroups',
        this.customer.id,
        {
          customer_group_ids: this.customerCustomerGroups
        }
      )

      this.$notify.queue('success', 'Customer updated')
    }
  },
  computed: {
    customer() {
      return this.$store.state.customer.model
    },
    customerCustomerGroups () {
      return this.$store.state.customer.customerGroups
    },
    customerGroups() {
      return this.$store.state.core.customerGroups
    },
    displayName () {
      return `${this.customer.firstname} ${this.customer.lastname}`
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
