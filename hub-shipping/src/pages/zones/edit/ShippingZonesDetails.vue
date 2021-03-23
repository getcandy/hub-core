<template>
  <div class="card-content" v-if="zone">
    <b-field :label="$t('Name')">
      <gc-input v-model="zone.name" @input="updateShippingZone" />
    </b-field>
  </div>
</template>

<script>
  const find = require('lodash/find')
  const orderBy = require('lodash/orderBy')
  const each = require('lodash/each')

  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'

  export default {
    layout: 'shipping-zone',
    mixins: [
      NormalizesObjects
    ],
    data() {
      return {
        zone: null
      }
    },
    mounted () {
      this.zone = this.normalize(this.shippingZoneModel)
    },
    computed: {
      shippingZoneModel () {
        return this.$store.state.shippingZones.model
      }
    },
    methods: {
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
