<template>
  <default-layout>
    <loading-spinner v-if="loading" />
    <div v-else>
      <toolbar :heading="attribute(model.attribute_data, 'name')" >
        <gc-button @click="save">
          {{ $t('Save changes') }}
        </gc-button>
      </toolbar>
      <div class="flex">
        <gc-resource-nav :nav="navItems" />
      </div>
      <div>
        <nuxt />
      </div>
    </div>
  </default-layout>
</template>

<script>
const orderBy = require('lodash/orderBy')
const each = require('lodash/each')
const find = require('lodash/find')
const map = require('lodash/map')

import DefaultLayout from '@getcandy/hub-core/src/layouts/Default.vue'
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'

export default {
  components: {
    DefaultLayout
  },
  mixins: [
    HasAttributes,
    NormalizesObjects
  ],
  data () {
    return {
      loading: true,
      selectedShippingZones: [],
    }
  },
  methods: {
    save (section = 'details') {
      switch (section) {
        default:
          this.saveDetails()
        break
      }
    },
    saveDetails () {
      this.$gc.shippingMethods.update(this.model.id, {
        attribute_data: this.model.attribute_data,
        channels: this.model.channels.data,
        zones: this.model.zones.data,
        type: this.model.type
      }).then(response => {
        this.$notify.queue('success', this.$t('Shipping method saved'))
      })
    },
    savePrices () {
      alert('Save prices!')
    }
  },
  computed: {
    navItems () {
      return {
        params: {
          id: this.model.id
        },
        items: [
          {
            route: 'shipping-methods.edit.details',
            label: "Attribute Details"
          },
          {
            route: 'shipping-methods.edit.pricing',
            label: "Pricing"
          },
          {
            route: 'shipping-methods.edit.availability',
            label: "Availability"
          }
        ]
      };
    },
    model () {
      return this.$store.state.shippingMethods.model
    },
    channel () {
      return this.$store.state.core.channel
    },
    locale () {
      return this.$store.state.core.locale
    }
  },
  mounted: async function () {
    if (this.model && (this.model.id !== this.$route.params.id)) {
      this.$store.commit('shippingMethods/setModel', null)
    }
    if (!this.model) {
      this.loading = true
      const response = await this.$gc.shippingMethods.find(this.$route.params.id, {
        include: 'attributes.group.attributes,prices.customerGroups,prices.currency,prices.zone,zones,channels,users',
        full_response: true
      })
      this.$store.commit('shippingMethods/setModel', response.data.data)

      // this.selectedShippingZones = map(this.shippingMethod.zones.data, item => {
      //   return item.id;
      // });
    }
    this.loading = false
  }
}
</script>

<style scoped>

</style>
