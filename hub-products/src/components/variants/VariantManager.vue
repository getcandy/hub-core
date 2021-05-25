<template>
  <div v-if="current">
    <quick-view-panel :open="showCreatePanel" :heading="$t('Add variant option')" @close="showCreatePanel = false">
      <create-variant :options="product.option_data || {}" :product-id="product.id" :errors="createErrors" @saved="handleOptionCreate" />
    </quick-view-panel>
    <simple-modal
      heading="Remove Variant"
      :open="showDeleteModal"
      @confirmed="deleteVariant"
      @close="showDeleteModal = false"
    >
      {{ $t('Are you sure you want to remove this variant?') }}
    </simple-modal>
    <div class="flex">
      <div v-if="variants.length > 1" class="w-1/5">
        <header class="px-6 py-4">
          <gc-button size="x-small" theme="gray" @click="showCreatePanel = true">
            {{ $t('Add option') }}
          </gc-button>
        </header>
        <div
          v-for="(variant, index) in variants"
          :key="variant.id"
          class="flex items-center px-4 my-4"
        >
          <button class="text-gray-400 hover:text-red-600 focus:outline-none" type="button" @click="triggerDeleteModal(variant)">
            <gc-icon icon="trash" size="sm" />
          </button>
          <button
            class="w-full px-4 text-sm leading-tight text-left truncate focus:outline-none"
            :class="{
              'text-purple-600 font-semibold' : current.id == variant.id,
              'hover:text-gray-900 text-gray-500 border-transparent ': current.id != variant.id
            }"
            @click="selectVariant(index)"
          >
            <span v-for="(option, optionIndex) in variant.options" :key="optionIndex">{{ option[locale] }} </span>
          </button>
        </div>
      </div>
      <div class="w-full bg-white">
        <template v-if="productVariantCount > 1">
          <header class="px-6 py-3 border-b shadow-sm">
            <h3 class="text-sm font-bold text-gray-700">
              {{ $t('Variant Image') }}
            </h3>
          </header>
          <div class="p-6">
            <gc-asset-picker :assets="productImages" :current="current.image" @save="handleAssetChange">
              <div slot="empty">
                <div class="p-3 mb-2 text-sm text-blue-700 bg-blue-100 rounded">
                  {{ $t('If no image is specified you can still use the default image for the product') }}
                </div>
              </div>
            </gc-asset-picker>
          </div>
        </template>
        <template v-if="hasOptionData">
          <header class="px-6 py-3 border-t border-b shadow-sm">
            <h3 class="text-sm font-bold text-gray-700">
              {{ $t('Details') }}
            </h3>
          </header>
          <div class="p-6">
            <basic-translate v-model="optionFields" @input="handleOptionDataChange" />
          </div>
        </template>
        <div>
          <header class="px-6 py-3 border-t border-b shadow-sm">
            <h3 class="text-sm font-bold text-gray-700">
              {{ $t('Pricing') }}
            </h3>
          </header>
          <div class="p-6">
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <form-field :label="$t('Unit Quantity')" :instructions="$t('The number of units that make up the price')">
                <gc-input v-model="current.unit_qty" type="number" @input="handleChange" />
              </form-field>
              <form-field :label="$t('Min Purchase Quantity')" :instructions="$t('The minimum amount that can be purchased')">
                <gc-input v-model="current.min_qty" type="number" @input="handleChange" />
              </form-field>
              <form-field :label="$t('Min Batch Quantity')" :instructions="$t('This product can only be ordered in multiples of {min_batch}', { min_batch: current.min_batch })">
                <gc-input v-model="current.min_batch" type="number" @input="handleChange" />
              </form-field>
            </div>
            <div class="my-4">
              <label class="flex items-center">
                <toggle v-model="hasGroupPricing" @input="handleCustomerGroupPricingToggle" />
                <span class="block ml-3 text-sm font-medium leading-5 text-gray-700">{{ $t('Individual Customer Group Pricing') }}</span>
              </label>
            </div>
            <template v-if="hasGroupPricing">
              <variant-customer-group-pricing
                :variant-id="current.id"
                :initial-pricing="current.customer_pricing.data"
                :new-price="current.price"
                :new-tax-id="current.tax.data.id"
                @input="handleCustomerGroupPricingChange"
              />
            </template>
            <div v-else class="md:grid md:grid-cols-2 md:gap-6">
              <form-field :label="$t('Unit Price')">
                <gc-price-input v-model="current.price" :is-cents="false" @input="handleChange" />
              </form-field>
              <form-field :label="$t('Tax')">
                <select-input v-model="current.tax.data.id" :placeholder="$t('Select a tax bracket')" @input="handleChange">
                  <option
                    v-for="option in taxes"
                    :key="option.id"
                    :value="option.id"
                  >
                    {{ option.name }} ({{ option.percentage }}%)
                  </option>
                </select-input>
              </form-field>
            </div>
          </div>
        </div>
        <div>
          <header class="px-6 py-3 border-t border-b shadow-sm">
            <h3 class="text-sm font-bold text-gray-700">
              {{ $t('Price Tiers') }}
            </h3>
          </header>
          <div>
            <variant-tiers :variant="current" @change="handleChange" />
          </div>
        </div>

        <div>
          <header class="px-6 py-3 border-b shadow-sm">
            <h3 class="text-sm font-bold text-gray-700">
              {{ $t('Inventory') }}
            </h3>
          </header>
          <div class="p-6">
            <div class="md:grid md:grid-cols-4 md:gap-6">
              <form-field :label="$t('SKU')">
                <gc-sku-input v-model="current.sku" @input="handleChange" />
              </form-field>
              <form-field :label="$t('Stock Level')">
                <gc-input v-model="current.inventory" type="number" @input="handleChange" />
              </form-field>
              <form-field :label="$t('Incoming')">
                <gc-input v-model="current.incoming" type="number" @input="handleChange" />
              </form-field>
              <gc-form-field :label="$t('Purchasability')" :instructions="purchasabilityHelper">
                <gc-select-input v-model="current.backorder" @change="handleChange">
                  <option
                    v-for="option in backorderOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </gc-select-input>
              </gc-form-field>
            </div>
          </div>
        </div>
        <div>
          <header class="px-6 py-3 border-t border-b shadow-sm">
            <h3 class="text-sm font-bold text-gray-700">
              {{ $t('Dimensions & Weight') }}
            </h3>
            <p class="mt-1 text-xs text-gray-600">
              {{ $t('Add details about this variants sizing, this will help when you come to more advanced shipping calculations.') }}
            </p>
          </header>
          <div class="p-6">
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <form-field :label="$t('Width')">
                <gc-grouped-input v-model="current.width.value" @input="handleChange" input-type="number">
                  <select v-model="current.width.unit" class="h-full py-0 pl-2 text-gray-500 bg-transparent border-transparent form-select pr-7 sm:text-sm sm:leading-5" @change="handleChange">
                    <option value="cm">
                      CM
                    </option>
                    <option value="mm">
                      MM
                    </option>
                    <option value="m">
                      M
                    </option>
                  </select>
                </gc-grouped-input>
              </form-field>
              <form-field :label="$t('Height')">
                <gc-grouped-input v-model="current.height.value" @input="handleChange" input-type="number">
                  <select v-model="current.height.unit" class="h-full py-0 pl-2 text-gray-500 bg-transparent border-transparent form-select pr-7 sm:text-sm sm:leading-5" @change="handleChange">
                    <option value="cm">
                      CM
                    </option>
                    <option value="mm">
                      MM
                    </option>
                    <option value="m">
                      M
                    </option>
                  </select>
                </gc-grouped-input>
              </form-field>
              <form-field :label="$t('Depth')">
                <gc-grouped-input v-model="current.depth.value" @input="handleChange" input-type="number">
                  <select v-model="current.depth.unit" class="h-full py-0 pl-2 text-gray-500 bg-transparent border-transparent form-select pr-7 sm:text-sm sm:leading-5" @change="handleChange">
                    <option value="cm">
                      CM
                    </option>
                    <option value="mm">
                      MM
                    </option>
                    <option value="m">
                      M
                    </option>
                  </select>
                </gc-grouped-input>
              </form-field>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HasLocalisedValues from '@getcandy/hub-core/src/mixins/HasLocalisedValues'
import HasDrafts from '@getcandy/hub-core/src/mixins/HasDrafts.js'
import VariantTiers from './VariantTiers.vue'
import CreateVariant from './CreateVariant.vue'
import VariantCustomerGroupPricing from './VariantCustomerGroupPricing.vue'
const filter = require('lodash/filter')
const get = require('lodash/get')
const find = require('lodash/find')
const map = require('lodash/map')
const each = require('lodash/each')

export default {
  components: {
    CreateVariant,
    VariantTiers,
    VariantCustomerGroupPricing
  },
  mixins: [
    HasLocalisedValues,
    HasDrafts
  ],
  data () {
    return {
      current: null,
      variants: [],
      hasGroupPricing: 0,
      showDeleteModal: false,
      showCreatePanel: false,
      variantToRemove: {},
      optionFields: {},
      createErrors: {}
    }
  },
  computed: {
    productImages () {
      return filter(get(this.product, 'assets.data', []), asset => asset.kind === 'image')
    },
    hasOptionData () {
      return !!Object.keys(this.product.option_data).length
    },
    productVariantCount () {
      return this.productVariants.length
    },
    productVariants () {
      return this.product.variants.data
    },
    product () {
      return this.$store.state.product.model
    },
    locale () {
      return this.$store.state.core.locale
    },
    taxes () {
      return this.$store.state.core.taxes
    },
    backorderOptions () {
      return [
        { label: 'In Stock', value: 'in-stock' },
        { label: 'Expected', value: 'expected' },
        { label: 'Always', value: 'always' }
      ]
    },
    // TODO: Do this better
    purchasabilityHelper () {
      if (this.current.backorder === 'in-stock') {
        return 'This item can only be bought when in stock.'
      } else if (this.current.backorder === 'expected') {
        return 'This item can be bought when stock is expected'
      }
      return 'This item can be bought regardless of stock level'
    }
  },
  watch: {
    productVariantCount () {
      this.syncVariants()
    }
  },
  mounted () {
    this.syncVariants()
    // eslint-disable-next-line
    each(this.product.option_data, (option, handle) => {
      this.$set(this.optionFields, handle, {
        values: {},
        type: 'text'
      })
    })
    this.selectVariant(0)
  },
  methods: {
    deleteVariant () {
      this.$emit('delete', this.variantToRemove)
      if (this.current.id === this.variantToRemove.id) {
        this.current = this.variants[0]
      }
      const pos = this.variants.map(function (e) { return e.id }).indexOf(this.variantToRemove.id)
      this.variants.splice(pos, 1)
      this.variantToRemove = {}
      this.showDeleteModal = false
    },
    triggerDeleteModal (variant) {
      this.variantToRemove = variant
      this.showDeleteModal = true
    },
    syncVariants () {
      this.variants = JSON.parse(
        JSON.stringify(this.productVariants)
      )
    },
    selectVariant (index) {
      this.current = this.variants[index]
      this.current.customer_pricing.data = map(this.current.customer_pricing.data, (price) => {
        return {
          customer_group_id: price.customer_group_id || price.group.data.id,
          group_name: price.group_name || price.group.data.name,
          price: price.price,
          tax_id: price.tax_id || price.tax.data.id
        }
      })

      if (!this.current.tax.data) {
        this.$set(this.current, 'tax', {
          data: {
            id: null
          }
        })
      }
      each(this.current.options, (option, handle) => {
        this.$set(this.optionFields, handle, {
          values: option,
          type: 'text'
        })
      })
      this.hasGroupPricing = this.current.customer_pricing ? this.current.customer_pricing.data.length : false
    },
    handleChange () {
      this.$emit('change', this.current, () => {
      })
    },
    async handleAssetChange (assetId) {
      await this.createDraft('product', this.product.id, {
      })
      this.$set(this.current, 'asset_id', assetId)

      const asset = find(this.productImages, asset => asset.id === assetId)

      this.$set(this.current, 'image', asset)
      this.handleChange()
    },
    async handleOptionCreate (val) {
      await this.createDraft('product', this.product.id, {
      })
      try {
        const response = await this.$gc.productVariants.create(this.product.id, {
          variants: [val]
        })
        this.$notify.queue('success', this.$t('Option created'))
        this.$emit('variantCreated')
        this.showCreatePanel = false
        this.variants = response.data.data.variants.data
      } catch (e) {
        this.createErrors = e.response.data
      }
    },
    handleCustomerGroupPricingChange (pricing) {
      this.$set(this.current, 'customer_pricing', {
        data: pricing
      })
      this.handleChange()
    },
    handleCustomerGroupPricingToggle (val) {
      if (!val) {
        this.$set(this.current, 'customer_pricing', {
          data: []
        })
        this.handleChange()
      }
    },
    handleOptionDataChange () {
      this.handleChange()
    }
  }
}
</script>
