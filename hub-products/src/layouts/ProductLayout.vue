<template>
  <default-layout>
    <b-loading :is-full-page="false" :active="loading" />
    <template v-if="product">
      <template>
        <toolbar heading="Products" :subHeading="productName">
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
          <!-- <div class="tabs tabs-large tabs-large--flush">
            <ul>
              <nuxt-link
                :to="{
                  name: 'products.view',
                  params: {
                    id: product.id
                  }
                }"
                tag="li"
                exact-active-class="is-active"
              >
                <a>{{ $t("Product Details") }}</a>
              </nuxt-link>
              <nuxt-link
                :to="{
                  name: 'products.edit.media',
                  params: {
                    id: product.id
                  }
                }"
                tag="li"
                exact-active-class="is-active"
              >
                <a>{{ $t("Media") }}</a>
              </nuxt-link>
              <nuxt-link
                :to="{
                  name: 'products.edit.availability',
                  params: {
                    id: product.id
                  }
                }"
                tag="li"
                exact-active-class="is-active"
              >
                <a>{{ $t("Availability &amp; Pricing") }}</a>
              </nuxt-link>
              <nuxt-link
                :to="{
                  name: 'products.edit.associations',
                  params: {
                    id: product.id
                  }
                }"
                tag="li"
                exact-active-class="is-active"
              >
                <a>{{ $t("Associations") }}</a>
              </nuxt-link>
              <nuxt-link
                :to="{
                  name: 'products.edit.urls',
                  params: {
                    id: product.id
                  }
                }"
                tag="li"
                exact-active-class="is-active"
              >
                <a>{{ $t("URLs") }}</a>
              </nuxt-link>
              <nuxt-link tag="li" exact-active-class="is-active" v-for="(tab, index) in additionalTabs" :to="tab.route"  :key="index">
                <a>{{ $t(tab.title) }}</a>
              </nuxt-link>
            </ul>
          </div> -->
            <nuxt />
      </template>
    </template>
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
      title: this.product ? this.attribute(this.product.attribute_data, "name") : 'Loading...'
    }
  },
  data () {
    return {
      loading: false,
      showHistoryModal: false,
      showSettingsPanel: false,
      additionalTabs: []
    }
  },
  computed: {
    navItems () {
      // <nuxt-link
      //           :to="{
      //             name: 'products.view',
      //             params: {
      //               id: product.id
      //             }
      //           }"
      //           exact-active-class="tab-active"
      //         >
      //         {{ $t("Product Details") }}
      //       </nuxt-link>
      //       <nuxt-link
      //           :to="{
      //             name: 'products.edit.media',
      //             params: {
      //               id: product.id
      //             }
      //           }"
      //           exact-active-class="tab-active"
      //         >
      //           {{ $t("Media") }}
      //         </nuxt-link>
      //         <nuxt-link
      //           :to="{
      //             name: 'products.edit.availability',
      //             params: {
      //               id: product.id
      //             }
      //           }"
      //           exact-active-class="tab-active"
      //         >
      //           {{ $t("Availability &amp; Pricing") }}
      //         </nuxt-link>
      //         <nuxt-link
      //           :to="{
      //             name: 'products.edit.associations',
      //             params: {
      //               id: product.id
      //             }
      //           }"
      //           exact-active-class="tab-active"
      //         >
      //           {{ $t("Associations") }}
      //         </nuxt-link>
      //         <nuxt-link
      //           :to="{
      //             name: 'products.edit.urls',
      //             params: {
      //               id: product.id
      //             }
      //           }"
      //           exact-active-class="tab-active"
      //         >
      //          {{ $t("URLs") }}
      //         </nuxt-link>
      //         <nuxt-link exact-active-class="tab-active" v-for="(tab, index) in additionalTabs" :to="tab.route"  :key="index">
      //           {{ $t(tab.title) }}
      //         </nuxt-link>
      return {
        params: {
          id: this.product.id
        },
        items: [
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
      };

    // console.log(this.additionalTabs);
    //   return nav;
    },
    previewUrl() {
      return this.config.preview_url.replace(':id', this.product.id) || null
    },
    productName () {
      return this.product ? this.attribute(this.product.attribute_data, "name") : 'Loading...'
    },
    product () {
      return this.$store.state.product.model
    },
    liveId () {
      return this.$store.state.product.liveId
    },
    channel () {
      return this.$store.state.core.channel
    },
    locale () {
      return this.$i18n.locale
    },
    shouldCreateDraft () {
      return this.$store.state.product.createDraft
    },
    isDraft () {
      return this.$store.state.product.isDraft
    },
    state () {
      return this.$store.state.product.state
    },
    config () {
      return this.$store.state.product.config
    }
  },
  watch: {
    async shouldCreateDraft (val) {
      if (val) {
        const draft = await this.createDraft('product', this.product.id, {}, this.$getcandy);
        // this.product = draft

        // const response = await this.$gc.products.createDraft(this.product.id)
        // await this.$router.replace({
        //   name: this.$route.name,
        //   params: {
        //     id: response.data.data.id
        //   }
        // })
        // this.load(response.data.data.id)
      }
    }
  },
  destroyed () {
    this.$store.dispatch('product/resetState')
  },
  mounted () {
    if (!this.product) {
      this.loading = true
      this.$store.commit('product/setPendingAssets', [])
      this.load()
    }
    // this.$nuxt.context.app.$hooks.callHook('product.main.tabs', this.additionalTabs);
  },
  methods: {
    handleSettingsSave ({ familyId }) {
      this.$getcandy.on('Products').putProductsProductId(this.product.id, {
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
      await this.$router.replace({
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
        context: this.$gc
      })
      await this.$router.push({
        name: 'products.view',
        params: {
          id: this.product.id
        }
      })
    },
    async restore (versionId) {
      const response = await this.$gc.versions.restore(versionId);
      this.loading = true
      await this.$router.push({
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
