<template>
  <div v-if="product">
    <gc-tabs>
      <gc-tab-item :label="$t('Pricing &amp; Variants')">
        <div v-if="config.allow_variant_options && product.variants.data.length <= 1" class="px-6 py-3 text-right">
          <gc-button type="is-primary" theme="gray" @click="showVariantOptions = true">
            Edit options
          </gc-button>
        </div>
        <quick-view-panel :open="showVariantOptions" width="w-4/5 xl:w-3/5" @close="showVariantOptions = false">
          <variant-options :product="product" :initial-price="firstVariant.price" :errors="variantErrors" @save="saveVariants" />
        </quick-view-panel>
        <variant-manager :product="product" :languages="languages" @change="handleVariantsChange" @delete="handleVariantDelete" />
      </gc-tab-item>
      <gc-tab-item :label="$t('Channels')">
        <channel-manager :channels="product.channels.data" @change="handleChannelChange" />
      </gc-tab-item>
      <gc-tab-item :label="$t('Customer Groups')">
        <customer-group-manager :groups="product.customer_groups.data" @change="handleCustomerGroupsChange" />
      </gc-tab-item>
    </gc-tabs>
  </div>
</template>

<script>
import { HubPage, NormalizesObjects, HasDrafts } from '@getcandy/hub-core/src/mixins/Index.js'
import VariantManager from '../../components/variants/VariantManager.vue'
import VariantOptions from '../../components/variants/VariantOptions.vue'

const find = require('lodash/find')
const debounce = require('lodash/debounce')
const map = require('lodash/map')

export default {
  layout: 'product',
  components: {
    VariantManager,
    VariantOptions
  },
  mixins: [
    HubPage,
    NormalizesObjects,
    HasDrafts
  ],
  data () {
    return {
      product: null,
      showVariantOptions: false,
      variantErrors: {}
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
        afterRedirect: (product) => {
          this.product.id = product.id
        }
      }, this.$getcandy)
      try {
        this.$gc.products.updateCustomerGroups(this.product.id, {
          groups
        })
        this.$notify.queue('success', this.$t('Product customer groups updated'))
      } catch (e) {
        this.$notify.queue('error', this.$t('Unable to save customer groups'))
      }
    }, 300),
    handleChannelChange: debounce(async function (channels) {
      await this.createDraft('product', this.product.id, {
        afterRedirect: (product) => {
          this.product.id = product.id
        }
      })
      try {
        await this.$gc.products.updateChannels(this.product.id, {
          channels
        })
        this.$notify.queue('success', this.$t('Product channels updated'))
      } catch (e) {
        this.$notify.queue('error', this.$t('Unable to save channels'))
      }
    }, 300),
    async saveVariants (event) {
      await this.createDraft('product', this.product.id, {
        afterRedirect: (product) => {
          this.product.id = product.id
        }
      })
      this.variantErrors = {}
      try {
        const { variants, options } = event
        await this.$store.dispatch('product/createVariants', {
          productId: this.product.id,
          $nuxt: this.$nuxt,
          variants: {
            variants,
            options
          }
        })
        this.$notify.queue('success', this.$t('Product updated'))
        this.syncModel()
        this.showVariantOptions = false
        event.callback()
      } catch (error) {
        this.variantErrors = error.response.data
        this.$notify.queue('error', this.$t('Unable to create variants'))
      }
    },
    async handleVariantDelete (variant) {
      await this.createDraft('product', this.product.id, {
        afterRedirect: (product) => {
          this.product.id = product.id

          const variants = product.variants.data
          // We need to find the drafted variant equivalent
          const variantDraft = find(variants, (v) => {
            if (v.published_parent && v.published_parent.data) {
              return v.published_parent.data.id === variant.id
            }
          })
          variant.id = variantDraft ? variantDraft.id : variant.id
        }
      }, this.$getcandy)

      try {
        await this.$getcandy.on('product-variants', 'deleteProductVariant', variant.id)
        this.$notify.queue('success', this.$t('Product variant deleted'))
      } catch (error) {
      }
    },
    handleVariantsChange: debounce(async function (variant, done) {
      await this.createDraft('product', this.product.id, {
        afterRedirect: (product) => {
          this.product.id = product.id

          const variants = product.variants.data
          // We need to find the drafted variant equivalent
          const variantDraft = find(variants, (v) => {
            if (v.published_parent && v.published_parent.data) {
              return v.published_parent.data.id === variant.id
            }
          })
          variant.id = variantDraft ? variantDraft.id : variant.id
        }
      }, this.$getcandy)

      const payload = {
        price: variant.price,
        asset_id: variant.asset_id,
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
        incoming: variant.incoming,
        backorder: variant.backorder,
        pricing: variant.customer_pricing.data,
        tiers: [],
        options: variant.options
      }

      if (variant.tiers.data.length) {
        payload.tiers = map(variant.tiers.data, (tier) => {
          return {
            lower_limit: tier.lower_limit,
            price: tier.price,
            customer_group_id: tier.group.id
          }
        })
      }

      try {
        await this.$gc.products.variants.put(variant.id, payload)
        this.$notify.queue('success', this.$t('Product updated'))

        this.$store.commit('product/setState', 'saved')

        if (done) {
          done()
        }
      } catch (e) {
        this.$notify.queue('error', this.$t('Unable to save product'))
      }
    }, 300)
  }
}
</script>
