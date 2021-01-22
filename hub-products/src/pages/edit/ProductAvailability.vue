<template>
  <div v-if="product">
    <gc-tabs>
      <gc-tab-item :label="$t('Pricing &amp; Variants')">
        <div class="px-6 py-3 text-right" v-if="config.allow_variant_options && product.variants.data.length <= 1">
          <gc-button type="is-primary" @click="showVariantOptions = true" theme="gray">Edit options</gc-button>
        </div>
        <quick-view-panel :open="showVariantOptions" @close="showVariantOptions = false" width="w-4/5 xl:w-3/5">
          <variant-options :product="product" @save="saveVariants" :initial-price="firstVariant.price"/>
        </quick-view-panel>
        <variant-manager @change="handleVariantsChange" :product="product" :languages="languages"></variant-manager>
      </gc-tab-item>
      <gc-tab-item :label="$t('Channels')">
        <channel-manager @change="handleChannelChange" :channels="product.channels.data" />
      </gc-tab-item>
      <gc-tab-item :label="$t('Customer Groups')">
        <customer-group-manager @change="handleCustomerGroupsChange" :groups="product.customer_groups.data" />
      </gc-tab-item>
    </gc-tabs>
  </div>
</template>

<script>
  const merge = require('lodash/merge')
  const find = require('lodash/find')
  const each = require('lodash/each')
  const debounce = require('lodash/debounce')
  const map = require('lodash/map')

  import VariantManager from '../../components/variants/VariantManager.vue'
  import VariantOptions from '../../components/variants/VariantOptions.vue'
  import { HubPage, NormalizesObjects, HasDrafts } from '@getcandy/hub-core/src/mixins/Index.js'

  export default {
    layout: 'product',
    mixins: [
      HubPage,
      NormalizesObjects,
      HasDrafts
    ],
    components: {
      VariantManager,
      VariantOptions
    },
    data () {
      return {
        product: null,
        showVariantOptions: false,
      }
    },
    computed: {
      isDraft () {
        return this.$store.state.product.isDraft
      },
      storeModel () {
        return this.$store.state.product.model
      },
      config () {
        return this.$store.state.product.config
      },
      firstVariant () {
        return this.product.variants.data[0]
      }
    },
    mounted () {
      this.syncModel()
    },
    methods: {
      syncModel () {
        this.product = this.normalize(this.storeModel)
      },
      handleCustomerGroupsChange: debounce(async function (groups) {
        await this.createDraft('product', this.product.id, {
          afterRedirect: async (product) => {
            this.product.id = product.id
          }
        }, this.$getcandy)
        this.$gc.products.updateCustomerGroups(this.product.id, {
          groups: groups
        })
      }, 300),
      handleChannelChange: debounce(async function (channels) {
        await this.createDraft('product', this.product.id, {
          afterRedirect: async (product) => {
            this.product.id = product.id
          }
        }, this.$getcandy)
        this.$gc.products.updateChannels(this.product.id, {
          channels: channels
        })
      }, 300),
      async saveVariants (event) {
        this.showVariantOptions = false
        await this.createDraft('product', this.product.id, {
          afterRedirect: async (product) => {
            this.product.id = product.id
          }
        }, this.$getcandy)
        await this.$store.dispatch('product/createVariants', {
          productId: this.product.id,
          $getcandy: this.$getcandy,
          $gc: this.$gc,
          variants: event
        })
        this.syncModel()
      },
      handleVariantsChange: debounce(async function (variant, done) {

        await this.createDraft('product', this.product.id, {
          afterRedirect: async (product) => {
            this.product.id = product.id

            // We need to find the drafted variant equivalent
            const variantDraft = find(product.variants.data, v => v.sku === variant.sku )
            variant.id = variantDraft.id
          }
        }, this.$getcandy)

        const payload = {
          price: variant.price,
          tax_id: variant.tax.data.id,
          sku: variant.sku,
          weight: variant.weight,
          min_qty: variant.min_qty,
          unit_qty: variant.unit_qty,
          min_batch: variant.min_batch,
          height: variant.height,
          depth: variant.depth,
          width: variant.width,
          volume: variant.volume,
          inventory: variant.inventory,
          pricing: variant.customer_pricing.data,
          tiers: [],
          options: variant.options,
        }

        if (variant.tiers.data.length) {
          payload.tiers = map(variant.tiers.data, tier => {
            return {
              lower_limit: tier.lower_limit,
              price: tier.price,
              customer_group_id: tier.group.id
            }
          })
        }

        await this.$gc.products.variants.put(variant.id, payload)

      this.$notify.queue('success', this.$t('Variants updated'))

      this.$store.commit('product/setState', 'saved')

      if (done) {
        done()
      }
      }, 300)
    }
  }
</script>
