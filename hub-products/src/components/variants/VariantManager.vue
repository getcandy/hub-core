<template>
  <div v-if="current">
    <quick-view-panel :open="showCreatePanel" @close="showCreatePanel = false" :heading="$t('Add variant option')">
      <create-variant :options="product.option_data" :product-id="product.id" @saved="handleOptionCreate" :errors="createErrors" />
    </quick-view-panel>
    <div class="flex">
      <div class="w-1/5" v-if="variants.length > 1">
        <header class="p-6 pt-0">
          <gc-button @click="showCreatePanel = true" size="x-small" theme="gray">{{ $t('Add option') }}</gc-button>
        </header>
        <div
          v-for="(variant, index) in variants"
          :key="variant.id"
        >
          <button
            @click="selectVariant(index)"
            class="p-6 text-sm w-full text-left border-l-4 focus:outline-none"
            :class="{
              'bg-white text-gray-800 hover:bg-white border-blue-500' : current.id == variant.id,
              'hover:bg-gray-200 text-gray-600 border-transparent ': current.id != variant.id
            }"
          >
            <span v-for="(option, optionIndex) in variant.options" :key="optionIndex">{{ option[locale] }} </span>
          </button>
        </div>
        <!--<div class="panel">
          <div class="panel-heading">
            {{ $t('Variants') }}
          </div>
          <a @click.prevent="selectVariant(index)" class="panel-block" :class="{
            'is-active' : current.id == variant.id
          }" v-for="(variant, index) in variants" :key="variant.id">
            <b-tag v-for="(option, optionIndex) in variant.options" :key="optionIndex">{{ option[locale] }}</b-tag>
          </a>
        </div>-->
      </div>
      <div class="bg-white w-full">
        <template v-if="product.option_data.length">
          <div class="p-6">
            <header class="mb-6">
              <h2>{{ $t('Details') }}</h2>
            </header>
            <basic-translate v-model="optionFields" @input="handleOptionDataChange" />
          </div>
          <div class="hidden sm:block">
            <div class="border-t border-gray-200"></div>
          </div>
        </template>
        <div>
          <header class="shadow-sm border-b py-3 px-6">
            <h3 class="text-sm font-bold text-gray-700">{{ $t('Pricing') }}</h3>
          </header>
          <div class="p-6">
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <form-field :label="$t('Unit Quantity')" :instructions="$t('The number of units that make up the price')">
                <gc-input type="number" v-model="current.unit_qty" @input="handleChange" />
              </form-field>
              <form-field :label="$t('Min Purchase Quantity')" :instructions="$t('The minimum amount that can be purchased')">
                <gc-input v-model="current.min_qty" @input="handleChange" />
              </form-field>
              <form-field :label="$t('Min Batch Quantity')" :instructions="$t('This product can only be ordered in multiples of {min_batch}', { min_batch: current.min_batch })">
                <gc-input v-model="current.min_batch" @input="handleChange" />
              </form-field>
            </div>
            <div class="my-4">
              <label class="flex items-center">
                <toggle v-model="hasGroupPricing" @input="handleCustomerGroupPricingToggle" />
                <span class="ml-3 block text-sm leading-5 font-medium text-gray-700">{{ $t('Individual Customer Group Pricing') }}</span>
              </label>
            </div>
            <template v-if="hasGroupPricing">
              <variant-customer-group-pricing
                :variant-id="current.id"
                :initial-pricing="current.customer_pricing.data"
                :new-price="this.current.price"
                :new-tax-id="this.current.tax.data.id"
                @input="handleCustomerGroupPricingChange"
              />
            </template>
            <div class="md:grid md:grid-cols-2 md:gap-6" v-else>
              <form-field :label="$t('Unit Price')">
                <price-input v-model="current.price" :is-cents="false" @input="handleChange" />
                <!-- <b-input :value="$format.currency(current.unit_price, null, true, false)" @input="handlePriceInput" type="number"></b-input> -->
              </form-field>
              <form-field :label="$t('Tax')">
                <select-input :placeholder="$t('Select a tax bracket')" @input="handleChange" v-model="current.tax.data.id">
                    <option
                        v-for="option in taxes"
                        :value="option.id"
                        :key="option.id">
                        {{ option.name }} ({{ option.percentage }}%)
                    </option>
                </select-input>
              </form-field>
            </div>
            <!-- <div class="md:grid md:grid-cols-3 md:gap-6">
            </div> -->
          </div>
        </div>
        <div>
          <header class="shadow-sm border-b border-t py-3 px-6">
            <h3 class="text-sm font-bold text-gray-700">{{ $t('Price Tiers') }}</h3>
          </header>
          <div>
            <variant-tiers :variant="current" @change="handleChange" />
          </div>
        </div>

        <div>
          <header class="shadow-sm border-b py-3 px-6">
            <h3 class="text-sm font-bold text-gray-700">{{ $t('Inventory') }}</h3>
          </header>
          <div class="p-6">
            <div class="md:grid md:grid-cols-4 md:gap-6">
              <form-field :label="$t('SKU')">
                <gc-input v-model="current.sku" @input="handleChange" />
              </form-field>
              <form-field :label="$t('Stock Level')">
                <gc-input v-model="current.inventory" @input="handleChange" type="number" />
              </form-field>
              <form-field :label="$t('Incoming')">
                <gc-input v-model="current.incoming" @input="handleChange" type="number" />
              </form-field>
              <gc-form-field :label="$t('Purchasability')" :instructions="purchasabilityHelper" >
                <select-input v-model="current.backorder" @change="handleChange">
                  <option
                    v-for="option in backorderOptions"
                    :value="option.value"
                    :key="option.value">
                    {{ option.label }}
                  </option>
                </select-input>
              </gc-form-field>
            </div>
          </div>
        </div>
        <div>
          <header class="shadow-sm border-b border-t py-3 px-6">
            <h3 class="text-sm font-bold text-gray-700">{{ $t('Dimensions & Weight') }}</h3>
            <p class="text-xs text-gray-600 mt-1">
              {{ $t('Add details about this variants sizing, this will help when you come to more advanced shipping calculations.') }}
            </p>
          </header>
          <div class="p-6">
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <form-field :label="$t('Width')">
                <gc-grouped-input v-model="current.width.value" @input="handleChange">
                  <select v-model="current.width.unit" @select="handleChange" class="form-select h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5">
                    <option value="cm">CM</option>
                    <option value="mm">MM</option>
                    <option value="m">M</option>
                  </select>
                </gc-grouped-input>
              </form-field>
              <form-field :label="$t('Height')">
                <gc-grouped-input v-model="current.height.value" @input="handleChange">
                  <select v-model="current.height.unit" @select="handleChange" class="form-select h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5">
                    <option value="cm">CM</option>
                    <option value="mm">MM</option>
                    <option value="m">M</option>
                  </select>
                </gc-grouped-input>
              </form-field>
              <form-field :label="$t('Depth')">
                <gc-grouped-input v-model="current.depth.value" @input="handleChange">
                  <select v-model="current.depth.unit" @select="handleChange" class="form-select h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5">
                    <option value="cm">CM</option>
                    <option value="mm">MM</option>
                    <option value="m">M</option>
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
  const first = require('lodash/first')
  const map = require('lodash/map')
  const find = require('lodash/find')
  const each = require('lodash/each')
  import VariantTiers from './VariantTiers.vue'
  import CreateVariant from './CreateVariant.vue'
  import VariantCustomerGroupPricing from './VariantCustomerGroupPricing.vue'
  import HasLocalisedValues from '@getcandy/hub-core/src/mixins/HasLocalisedValues'
  import HasDrafts from '@getcandy/hub-core/src/mixins/HasDrafts.js'

  export default {
    mixins: [
      HasLocalisedValues,
      HasDrafts
    ],
    components: {
      CreateVariant,
      VariantTiers,
      VariantCustomerGroupPricing
    },
    data() {
      return {
        current: null,
        variants: [],
        hasGroupPricing: 0,
        showCreatePanel: false,
        optionFields: {},
        createErrors: {}
      }
    },
    mounted() {
      this.variants = JSON.parse(
        JSON.stringify(this.product.variants.data)
      );
      each(this.product.option_data, (option, handle) => {
        this.$set(this.optionFields, handle, {
          values: {},
          type: 'text'
        })
      })
      this.selectVariant(0)
    },
    methods: {
      selectVariant(index) {
        this.current = this.variants[index]
        this.current.customer_pricing.data = map(this.current.customer_pricing.data, price => {
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
      handleChange (val) {
        this.$emit('change', this.current, () => {
        })
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
        });
        this.handleChange()
      },
      handleCustomerGroupPricingToggle (val) {
        if (!val) {
          this.current.customer_pricing = {
            data: []
          }
          this.handleChange()
        }
      },
      handleOptionDataChange (val) {
        this.handleChange()
      }
    },
    computed: {
      product() {
        return this.$store.state.product.model
      },
      locale() {
        return this.$store.state.core.locale
      },
      taxes() {
        return this.$store.state.core.taxes
      },
      backorderOptions() {
        return [
          {label: 'In Stock', value: 'in-stock'},
          {label: 'Expected', value: 'expected'},
          {label: 'Always', value: 'always'}
        ];
      },
      // TODO: Do this better
      purchasabilityHelper() {
        if (this.current.backorder == 'in-stock') {
          return 'This item can <strong>only</strong> be bought when in stock.'
        } else if (this.current.backorder == 'expected') {
          return 'This item can be bought when on backorder <strong>or</strong> in stock'
        }
        return 'This item can be bought when <strong>not</strong> in stock <strong>or</strong> not on backorder'
      }
    }
  }
</script>
