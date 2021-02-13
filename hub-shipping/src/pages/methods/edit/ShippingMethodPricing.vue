<template>
  <div v-if="shippingMethod">
    <div v-for="zone in zones" :key="zone.id">
      <header class="px-6 py-3 bg-white border-t border-b shadow-sm">
        <h2 class="font-medium">{{ zone.name }}</h2>
      </header>
      <gc-table
        :data="getZonePrices(zone.id)"
        :columns="[
          {label: $t('Rate'), field: 'rate'},
          {label: $t('Currency'), field: 'currency'},
          {label: $t('Min Basket'), field: 'min_basket'},
          {label: $t('Min Weight'), field: 'min_weight'},
          {label: $t('Min Height'), field: 'min_height'},
          {label: $t('Min Width'), field: 'min_width'},
          {label: $t('Min Depth'), field: 'min_depth'},
          {label: $t('Min Volume'), field: 'min_volume'},
          {label: '', field: 'actions'},
        ]"
      >
        <template v-slot:rate="{ row }">
          <price-input v-model="row.rate" :currency-override="row.currency"></price-input>
        </template>
        <template v-slot:currency="{ row }">
          <select-input :placeholder="$t('Select a currency')" :value="row.currency.id" @input="val => updateCurrency(val, row)">
            <option v-for="currency in currencies" :value="currency.id" :key="currency.id">{{ currency.name }}</option>
          </select-input>
        </template>
        <template v-slot:min_basket="{ row }">
          <price-input v-model="row.min_basket" :currency-override="row.currency"></price-input>
        </template>
        <template v-slot:min_weight="{ row }">
          <gc-grouped-input v-model="row.min_weight">
            <select v-model="row.weight_unit" class="h-full py-0 pl-2 text-gray-500 bg-transparent border-transparent form-select pr-7 sm:text-sm sm:leading-5">
              <option value="kg">KG</option>
              <option value="lb">LB</option>
            </select>
          </gc-grouped-input>
        </template>
        <template v-slot:min_height="{ row }">
          <gc-grouped-input v-model="row.min_height">
            <select v-model="row.height_unit" class="h-full py-0 pl-2 text-gray-500 bg-transparent border-transparent form-select pr-7 sm:text-sm sm:leading-5">
              <option value="mm">MM</option>
              <option value="cm">CM</option>
              <option value="m">M</option>
            </select>
          </gc-grouped-input>
        </template>
        <template v-slot:min_width="{ row }">
          <gc-grouped-input v-model="row.min_width">
            <select v-model="row.width_unit" class="h-full py-0 pl-2 text-gray-500 bg-transparent border-transparent form-select pr-7 sm:text-sm sm:leading-5">
              <option value="mm">MM</option>
              <option value="cm">CM</option>
              <option value="m">M</option>
            </select>
          </gc-grouped-input>
        </template>
        <template v-slot:min_depth="{ row }">
          <gc-grouped-input v-model="row.min_depth">
            <select v-model="row.depth_unit" class="h-full py-0 pl-2 text-gray-500 bg-transparent border-transparent form-select pr-7 sm:text-sm sm:leading-5">
              <option value="mm">MM</option>
              <option value="cm">CM</option>
              <option value="m">M</option>
            </select>
          </gc-grouped-input>
        </template>
        <template v-slot:min_volume="{ row }">
          <gc-grouped-input v-model="row.min_volume">
            <select v-model="row.volume_unit" class="h-full py-0 pl-2 text-gray-500 bg-transparent border-transparent form-select pr-7 sm:text-sm sm:leading-5">
              <option value="ml">Mililitre</option>
              <option value="lt">Litres</option>
              <option value="gal">Gallons</option>
            </select>
          </gc-grouped-input>
        </template>
        <template v-slot:actions="{ row }">
          <gc-button @click="removePrice(row)" theme="danger" size="x-small">
            <b-icon icon="delete-bin-line" />
          </gc-button>
        </template>
      </gc-table>
      <button @click="addPrice(zone)" class="block w-full py-1 text-sm text-center text-gray-600 uppercase bg-gray-200 hover:bg-gray-300">Add Price</button>
    </div>
    <quick-view-panel :open="true" :heading="$t('Edit price')" v-if="editing" @close="editing = null" :takeover="true">
      <shipping-method-price-form :existing="editing" />
    </quick-view-panel>
  </div>
</template>

<script>
  const groupBy = require('lodash/groupBy')
  const filter = require('lodash/filter')
  const find = require('lodash/find')

  import ShippingMethodPriceForm from '../../../components/ShippingMethodPriceForm.vue'
  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'

  export default {
    layout: 'shipping-method',
    mixins: [
      NormalizesObjects
    ],
    components: {
      ShippingMethodPriceForm
    },
    data() {
      return {
        editing: null,
        shippingMethod: null
      }
    },
    methods: {
      updateCurrency (currencyId, row) {
        row.currency = find(this.currencies, currency => currency.id === currencyId)
      },
      getZonePrices (zoneId) {
        return filter(this.shippingMethod.prices.data, price => price.zone_id === zoneId)
      },
      removePrice (row) {
        this.shippingMethod.prices.data.splice(
          this.shippingMethod.prices.data.indexOf(row),
          1
        )
      },
      addPrice (zone) {
        this.shippingMethod.prices.data.push({
          zone_id: zone.id,
          currency: find(this.currencies, currency => currency.default),
          rate : 0,
          min_basket : 0,
          min_weight : 0,
          weight_unit : 'kg',
          min_height : 0,
          height_unit : 'cm',
          min_width : 0,
          width_unit : 'cm',
          min_depth : 0,
          depth_unit : 'cm',
          min_volume : 0,
          volume_unit : 'lt'
        })
      },
      groupPricing(prices) {
        return groupBy(prices, (price) => {
          return price.zone.data.id;
        })
      }
    },
    watch: {
      shippingPrices: {
        deep: true,
        handler () {
          this.$store.dispatch('shippingMethods/setModel', this.normalize(this.shippingMethod))
        }
      }
    },
    mounted () {
      this.shippingMethod = this.normalize(this.model)
    },
    computed: {
      shippingPrices () {
        return this.shippingMethod ? this.shippingMethod.prices.data : []
      },
      model () {
        return this.$store.state.shippingMethods.model
      },
      zones () {
        return this.model.zones.data
      },
      currencies () {
        return this.$store.state.core.currencies
      }
    }
  }
</script>

<style scoped>

</style>
