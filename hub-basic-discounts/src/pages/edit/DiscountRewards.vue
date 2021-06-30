<template>
  <div v-if="discount">
    <gc-table
      :data="discount.rewards.data"
      :columns="[
        {label: 'Type', field: 'type'},
        {label: 'Value', field: 'value'},
        {label: '', field: 'actions'}
      ]"
    >
      <template v-slot:type="{ row }">
        <gc-select v-model="row.type">
          <option value="percentage">Percentage</option>
          <option value="fixed_amount">Fixed Amount</option>
          <option value="fixed_price">Fixed Price</option>
          <option value="product">Product</option>
        </gc-select>
      </template>
      <template v-slot:value="{ row }">
        <template v-if="row.type === 'product'">
          <template v-if="!row.products.data.length">
            <gc-button theme="gray" @click="browseProducts(row)">{{ $t('Add product') }}</gc-button>
          </template>
          <div v-for="(product, productIndex) in row.products.data" :key="productIndex" class="flex items-center">
            <gc-input v-model="product.quantity" />
            <span class="mx-2">x</span>
            <span>{{ attribute(product.product.data.attribute_data, 'name') }}</span>
            <span class="ml-2"><gc-button size="x-small" theme="danger" @click="removeProduct(row, productIndex)">{{ $t('Remove product') }}</gc-button></span>
          </div>
        </template>
        <gc-input v-model="row.value" @blur="syncModel" v-else />
      </template>
      <template v-slot:actions="{ index }">
        <gc-button theme="danger" @click="removeReward(index)">{{ $t('Remove') }}</gc-button>
      </template>
    </gc-table>
    <div class="p-4 text-center">
      <gc-button @click="addReward">{{ $t('Add Reward') }}</gc-button>
    </div>
    <quick-view-panel
      heading="Choose a product"
      :open="showProductBrowser"
      @close="showProductBrowser = false"
      width="w-2/3"
    >
      <search-table
        :limit="10"
        includes="assets.transforms,variants"
        :update-query-string="false"
        :search-placeholder="$t('Search products')"
        type="products"
        :columns="[
          {label: '', field: 'thumbnail'},
          {label: $t('Name'), field: 'name'},
          {label: $t('SKU'), field: 'sku'},
          {label: null, field: 'actions'},
        ]"
      >
        <template v-slot:thumbnail="{ row }">
          <nuxt-link
            :to="{
              name: 'products.view',
              params: {
                id: row.id
              }
            }"
          >
            <thumbnail-loader width="30px" :asset="row.assets.data[0]" />
          </nuxt-link>
        </template>
        <template v-slot:name="{ row }">
          <nuxt-link
            :to="{
              name: 'products.view',
              params: {
                id: row.id
              }
            }"
          >
            {{ attribute(row.attribute_data, 'name') }}
          </nuxt-link>
        </template>
        <template v-slot:sku="{ row }">
          {{ getSkus(row).join(', ') }}
        </template>
        <template v-slot:actions="{ row }">
          <gc-button @click="attachProduct(row)">
            {{ $t('Attach product') }}
          </gc-button>
          <!-- <template v-if="row.id != product.id"> -->
            <!-- <gc-button v-if="!selected.includes(row.id)" theme="green" @click="attach(row)">
              Attach
            </gc-button>
            <gc-button v-else theme="danger" @click="detach(row)">
              Detach
            </gc-button> -->
          <!-- </template> -->
        </template>
      </search-table>
    </quick-view-panel>
  </div>
</template>

<script>
  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'
  import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes.js'
  const get = require('lodash/get')
  const map = require('lodash/map')

  export default {
    layout: 'discount',
    mixins: [
      NormalizesObjects,
      HasAttributes
    ],
    data() {
      return {
        discount: null,
        showProductBrowser: false,
        editableReward: null
      }
    },
    mounted() {
      this.discount = this.normalize(this.discountModel)
    },
    methods: {
      browseProducts (reward) {
        this.editableReward = reward
        this.showProductBrowser = true
      },
      getSkus(product) {
        const variants = get(product, 'variants.data', [])
        return map(variants, v => {
          return v.sku
        })
      },
      removeProduct (reward, index) {
        reward.products.data.splice(index, 1)
        this.syncModel()
      },
      syncModel () {
        this.$store.dispatch('discounts/setModel', this.normalize(this.discount))
      },
      attachProduct (product) {
        this.editableReward.products.data.push({
          quantity: 1,
          product: {
            data: product
          }
        })
        this.showProductBrowser = false
        this.syncModel()
      },
      removeReward (index) {
        this.discount.rewards.data.splice(index, 1)
        this.syncModel()
      },
      addReward () {
        this.discount.rewards.data.push({
          type: 'percentage',
          value: 0,
          products: {
            data: []
          }
        })
        this.syncModel()
      }
    },
    computed: {
      discountModel () {
        return this.$store.state.discounts.model
      }
    }
  }
</script>

<style scoped>

</style>
