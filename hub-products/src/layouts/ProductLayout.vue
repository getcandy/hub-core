<template>
  <default-layout>
    <div v-if="$fetchState.pending" class="flex items-center justify-center w-full h-screen">
      <div class="flex items-center text-gray-500">
        <loading-spinner class="mr-2" />
        <span class="text-xs font-medium uppercase">{{ $t('Fetching Product') }}</span>
      </div>
    </div>
    <div v-else>
      <div v-if="isDraft" class="p-2 text-sm text-center text-orange-700 bg-orange-100 border-b border-orange-300">
        {{ $t("You are viewing a draft, changes below won't be reflected until published") }}
      </div>
      <toolbar heading="Products" :sub-heading="title">
        <template v-slot:subHeadingExtra>
          <span class="block text-xs text-red-600">{{ sku }}</span>
        </template>
        <div class="flex items-center">
          <div>
            <draft-tools
              :preview-url="previewUrl"
              :live-url="liveUrl"
              :is-draft="isDraft"
              :creating-draft="creatingDraft"
              :publishing-draft="publishingDraft"
              :versions="product.versions ? product.versions.data : []"
              :created-at="product.created_at"
              :updated-at="product.updated_at"
              @discard="discard"
              @delete="triggerDelete"
              @publish="publish"
              @restore="restore"
            />
          </div>
          <div class="ml-3">
            <gc-button theme="gray" @click="showSettingsPanel = true">
              <gc-icon icon="settings" size="sm" class="mr-1" /> Settings
            </gc-button>
            <quick-view-panel
              :open="showSettingsPanel"
              heading="Product Settings"
              @close="showSettingsPanel = false"
            >
              <div class="p-6">
                <product-settings :product="product" @save="handleSettingsSave" />
              </div>
            </quick-view-panel>
          </div>
        </div>
      </toolbar>
      <div class="flex">
        <gc-resource-nav :nav="navItems" />
      </div>
      <nuxt />
    </div>
  </default-layout>
</template>

<script>
import DefaultLayout from '@getcandy/hub-core/src/layouts/Default.vue'
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
import HasDrafts from '@getcandy/hub-core/src/mixins/HasDrafts'
import ProductSettings from './products/components/ProductSettings.vue'
const first = require('lodash/first')
const get = require('lodash/get')

export default {
  components: {
    DefaultLayout,
    ProductSettings
  },
  mixins: [
    HasAttributes,
    HasDrafts
  ],
  async fetch () {
    await this.load(this.$route.params.id)
    const items = [
      {
        route: 'products.view',
        label: 'Attribute Details'
      },
      {
        route: 'products.edit.media',
        label: 'Media'
      },
      {
        route: 'products.edit.availability',
        label: 'Availability &amp; Pricing'
      },
      {
        route: 'products.edit.associations',
        label: 'Associations'
      },
      {
        route: 'products.edit.urls',
        label: 'URLs'
      }
    ]
    this.$nuxt.context.app.$hooks.callHook('product.main.tabs', items)

    this.navItems = {
      params: {
        id: this.product.id
      },
      items
    }
  },
  data () {
    return {
      loading: false,
      showHistoryModal: false,
      showSettingsPanel: false,
      navItems: {}
    }
  },
  computed: {
    creatingDraft () {
      return this.$store.state.product.creatingDraft
    },
    publishingDraft () {
      return this.$store.state.product.publishingDraft
    },
    title () {
      return this.product ? this.attribute(this.product.attribute_data, 'name') : 'Loading...'
    },
    previewUrl () {
      return this.product ? (this.config.preview_url.replace(':id', this.product.id) || null) : null
    },
    liveUrl () {
      const { routes } = this.product
      const route = first(routes ? routes.data : [])
      if (!route) {
        return null
      }
      if (!this.config.live_url) {
        return null
      }
      return this.product ? (this.config.live_url.replace(':slug', route.slug) || null) : null
    },
    product () {
      return this.$store.state.product.model
    },
    sku () {
      const variants = get(this.product, 'variants.data', [])
      if (!variants.length || variants.length > 1) {
        return null
      }
      return variants.map(v => v.sku).join(', ')
    },
    liveId () {
      return this.$store.state.product.liveId
    },
    isDraft () {
      return this.$store.state.product.isDraft
    },
    config () {
      return this.$store.state.product.config
    }
  },
  watch: {
    '$route.params': '$fetch'
  },
  destroyed () {
    this.$store.dispatch('product/resetState')
  },
  mounted () {
    this.$store.commit('product/setPendingAssets', [])
  },
  methods: {
    handleSettingsSave ({ familyId }) {
      this.$getcandy.on('products', 'putProductsProductId', this.product.id, {
        family_id: familyId,
        attribute_data: this.product.attribute_data
      }).then(() => {
        this.load(this.product.id)
        this.showSettingsPanel = false
        this.$notify.queue('success', 'Product settings saved')
      })
    },
    async load (id) {
      try {
        await this.$store.dispatch('product/fetch', {
          $nuxt: this.$nuxt,
          id
        })
      } catch (e) {
        return this.$nuxt.error({
          statusCode: e.response ? e.response.status : 500,
          message: e.message
        })
      }
    },
    async triggerDelete () {
      await this.$gc.products.destroy(this.product.id)
      this.$router.push({
        name: 'products'
      })
      this.$notify.queue('success', this.$t('Product deleted'))
    },
    async discard () {
      try {
        await this.$store.dispatch('product/discard', {
          id: this.product.id,
          $nuxt: this.$nuxt,
          liveId: this.liveId
        })

        if (this.$route.params.id === this.liveId) {
          await this.$fetch()
        }
      } catch (e) {
        this.$notify.queue('error', this.$t('Unable to discard draft'))
      }
    },
    async publish () {
      try {
        await this.$store.dispatch('product/publish', {
          id: this.product.id,
          $nuxt: this.$nuxt
        })
      } catch (error) {
        this.$notify.queue('error', this.$t('Unable to publish draft'))
      }
    },
    async restore (versionId) {
      const response = await this.$gc.versions.restore(versionId)
      this.loading = true
      await this.$router.replace({
        name: 'products.view',
        params: {
          id: response.data.id
        }
      })
      this.load(response.data.id)
      this.$notify.queue('success', this.$t('Product restored and draft created'))
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>
