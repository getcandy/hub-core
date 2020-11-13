<template>
  <default-layout v-if="customer">
    <toolbar :heading="displayName" :subHeading="customer.company_name">
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
</template>

<script>
const map = require('lodash/map')
const each = require('lodash/each')
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
      customer: null,
      details: {},
      selectedGroups: [],
      tabs: [{
        label: 'Customer Details',
        route: 'customers.edit'
      }]
    }
  },
  async mounted() {
    const response = await this.$getcandy.on('Customers').getCustomersCustomerId(this.$route.params.id, 'users')

    this.customer = response.data.data
  },
  computed: {
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
