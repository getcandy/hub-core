<template>
  <div v-if="shippingMethod">
    <gc-tabs>
      <gc-tab-item :label="$t('Channels')">
        <channel-manager :channels="shippingMethod.channels.data" @change="syncModel" />
      </gc-tab-item>
      <gc-tab-item :label="$t('Zones')">
        <shipping-zone-chooser v-model="selectedShippingZones" @input="updateShippingZones"/>
      </gc-tab-item>
    </gc-tabs>
  </div>
</template>

<script>
  const map = require('lodash/map')

  import ShippingZoneChooser from '../../../components/ShippingZoneChooser.vue'
  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'

  export default {
    layout: 'shipping-method',
    mixins: [
      NormalizesObjects
    ],
    components: {
      ShippingZoneChooser
    },
    data () {
      return {
        shippingMethod: null,
        selectedShippingZones: []
      }
    },
    mounted () {
      this.shippingMethod = this.normalize(this.model)

      this.selectedShippingZones = this.shippingMethod.zones.data
    },
    methods: {
      updateShippingZones () {
        this.$store.dispatch('shippingZones/setSelectedZones', this.selectedShippingZones)
        this.syncModel()
      },
      syncModel () {
        this.$store.dispatch('shippingMethods/setModel', this.normalize(this.shippingMethod))
      },
    },
    computed: {
      model () {
        return this.$store.state.shippingMethods.model
      }
    }
  }
</script>
