<template>
  <div>
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
    <slot/>
  </div>
</template>

<script>
const map = require('lodash/map')
const each = require('lodash/each')
import Gravatar from 'vue-gravatar'

export default {
  components: {
    Gravatar,
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
  computed: {
    customerGroups() {
      return this.$store.state.core.customerGroups
    },
    displayName () {
      return this.details ? this.details.firstname +  ' ' + this.details.lastname : this.customer.email
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
