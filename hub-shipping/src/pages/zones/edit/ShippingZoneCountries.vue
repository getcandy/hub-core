<template>
  <div v-if="zone">
    <gc-table
      :data="countries"
      :columns="[
        {label: 'Enabled', field: 'enabled'},
        {label: 'Country', field: 'country'},
      ]"
    >
      <template v-slot:enabled="{ row }">
        <gc-toggle :value="selectedCountries.includes(row.id)" @input="(event) => handleToggle(event, row)" />
      </template>
      <template v-slot:country="{ row }">
        {{ row.name }}
      </template>
    </gc-table>
  </div>
</template>

<script>
  const find = require('lodash/find')
  const orderBy = require('lodash/orderBy')
  const map = require('lodash/map')
  const each = require('lodash/each')

  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'

  export default {
    layout: 'shipping-zone',
    mixins: [
      NormalizesObjects
    ],
    data() {
      return {
        zone: null,
        countries: [],
        selectedCountries: []
      }
    },
    mounted () {
      this.zone = this.normalize(this.shippingZoneModel)
      const { data } = this.zone.countries
      this.selectedCountries = map(data, country => country.id)
      this.$store.dispatch('shippingZones/setSelectedCountries', this.normalize(this.selectedCountries))
      this.fetchCountries()
    },
    computed: {
      shippingZoneModel () {
        return this.$store.state.shippingZones.model
      }
    },
    methods: {
      handleToggle (isEnabled, row) {
        if (isEnabled) {
          this.selectedCountries.push(row.id)
        } else {
          this.selectedCountries.splice(this.selectedCountries.indexOf(row.id), 1)
        }

        this.$store.dispatch('shippingZones/setSelectedCountries', this.normalize(this.selectedCountries))
      },
      async fetchCountries () {
        const { data } = await this.$getcandy.on('countries', 'getCountries')
        this.countries = data.data
      },
      updateShippingZone (value) {
        this.$store.commit('shippingZones/setOnModel', {
          field: 'name',
          value
        })
      }
    }
  }
</script>

<style scoped>

</style>
