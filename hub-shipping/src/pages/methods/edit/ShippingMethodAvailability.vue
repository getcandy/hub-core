<template>
  <div v-if="shippingMethod">
    <b-tabs
      horizontal
      class="secondary-tabs"
    >
      <b-tab-item :label="$t('Channels')">
        <channel-manager :channels="shippingMethod.channels.data" />
      </b-tab-item>
      <b-tab-item :label="$t('Zones')">
        <shipping-zone-chooser v-model="selectedShippingZones" />
      </b-tab-item>
    </b-tabs>
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

      this.selectedShippingZones = map(this.shippingMethod.zones.data, item => {
        return item.id;
      });
    },
    computed: {
      model () {
        return this.$store.state.shippingMethods.model
      }
    }
  }
</script>
