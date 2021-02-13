<template>
  <default-layout>
    <loading-spinner v-if="!product" />
    <div v-else>
      <toolbar heading="Products" :subHeading="title">
        <div class="flex items-center">
          <div>
            <draft-tools
              :preview-url="previewUrl"
              :is-draft="isDraft"
              @discard="discard"
              @delete="triggerDelete"
              @publish="publish"
              @restore="restore"
              :versions="product.versions ? product.versions.data : []"
              :created-at="product.created_at"
              :updated-at="product.updated_at"
            />
          </div>
          <div class="ml-3">
            <gc-button theme="gray" @click="showSettingsPanel = true">
              <gc-icon icon="settings" size="sm" class="mr-1" /> Settings
            </gc-button >
              <quick-view-panel
                :open="showSettingsPanel"
                @close="showSettingsPanel = false"
                heading="Product Settings"
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

export default {
  components: {
    DefaultLayout,
    ProductSettings
  },
  mixins: [
    HasAttributes,
    HasDrafts
  ],
  head () {
    return {
      title: this.title
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
    title () {
      return this.product ? this.attribute(this.product.attribute_data, "name") : 'Loading...'
    },
    previewUrl() {
      return this.product ? (this.config.preview_url.replace(':id', this.product.id) || null) : null
    },
    product () {
      return this.$store.state.product.model
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
  destroyed () {
    this.$store.dispatch('product/resetState')
  },
  async mounted () {
    this.loading = true
    this.$store.commit('product/setPendingAssets', [])
    await this.load()
    const items = [
      {
        route: 'products.view',
        label: "Attribute Details"
      },
      {
        route: 'products.edit.media',
        label: "Media"
      },
      {
        route: 'products.edit.availability',
        label: "Availability &amp; Pricing"
      },
      {
        route: 'products.edit.associations',
        label: "Associations"
      },
      {
        route: 'products.edit.urls',
        label: "URLs"
      }
    ]
    this.$nuxt.context.app.$hooks.callHook('product.main.tabs', items)

    this.navItems = {
      params: {
        id: this.product.id
      },
      items
    };
  },
  methods: {
    handleSettingsSave ({ familyId }) {
      this.$getcandy.on('products', 'putProductsProductId', this.product.id, {
        familyId: familyId,
        attribute_data: this.product.attribute_data
      }).then(response  => {
        this.load(this.product.id)
        this.showSettingsPanel = false
        this.$notify.queue('success', 'Product settings saved')
      })
    },
    async load (id) {
      try {
        const response = await this.$store.dispatch('product/fetch', {
          context: this.$getcandy,
          id: id || this.$route.params.id
        })
        const product = response
        const hasDraft = product.draft.data

        if (hasDraft) {
          await this.$router.replace({
            name: 'products.view',
            params: {
              id: product.draft.data.id
            }
          })
          await this.load(product.draft.data.id)
          return
        }
        this.$store.commit('product/setModel', product)

        this.loading = false
      } catch (e) {
        return this.$nuxt.error({
          statusCode: e.response ? e.response.status : 500,
          message: e.message
        })
      }
    },
    save () {
      alert('Save product!')
    },
    async triggerDelete () {
      await this.$gc.products.destroy(this.product.id)
      this.$router.push({
        name: 'products'
      })
      this.$notify.queue('success', this.$t('Product deleted'))
    },
    async discard () {
      const productId = this.product.id
      this.$store.dispatch('product/resetState')
      this.loading = true
      await this.$gc.products.destroy(productId)
      await this.$router.replace({
        name: 'products'
      })
      await this.$router.push({
        name: 'products.view',
        params: {
          id: this.liveId
        }
      })
      this.load(this.liveId)
    },
    async publish () {
      await this.$store.dispatch('product/publish', {
        productId: this.product.id,
        context: this.$getcandy
      })
    },
    async restore (versionId) {
      const response = await this.$gc.versions.restore(versionId);
      this.loading = true
      await this.$router.replace({
        name: 'products.view',
        params: {
          id: response.data.id
        }
      })
      this.load(response.data.id);
    }
  }
};
</script>
