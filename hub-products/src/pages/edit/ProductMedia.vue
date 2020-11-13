<template>
  <div v-if="product">
    <media-manager
      assetable="products"
      :parent="product"
      @file-added="handleFileAdded"
      @changed="handleChange"
      @beforeSave="handleChange"
      @externalAssetAdded="handleExternalAssetUpload"
    />
  </div>
</template>

<script>
const filter = require('lodash/filter')

import { NormalizesObjects, HasDrafts } from '@getcandy/hub-core/src/mixins/Index.js'

export default {
  layout: 'product',
  mixins: [
    NormalizesObjects,
    HasDrafts
  ],
  computed: {
    storeModel () {
      return this.$store.state.product.model
    }
  },
  data() {
    return {
      product: null,
      processOnAdd: false,
      pending: [],
      assetsToMerge: []
    }
  },
  mounted() {
    this.product = this.normalize(this.storeModel)
    if (this.isDraft) {
      this.processOnAdd = true
    }
  },
  watch: {
    isDraft (val) {
      this.processOnAdd = val
    }
  },
  methods: {
    async handleFileAdded (file) {
      await this.createDraft('product', this.product.id, {
        beforeRedirect: async (draft) => {
          this.product.id = draft.id
        }
      }, this.$getcandy)
    },
    async handleExternalAssetUpload (asset) {
      try {
        await this.createDraft('product', this.product.id, {
          beforeRedirect: async (draft) => {
            this.product.id = draft.id
          }
        }, this.$getcandy)
        const response = await this.$gc.products.attachAsset(this.product.id, asset.data.id)
      } catch (err) {

      }
    },
    async handleChange (assets, done) {
      await this.createDraft('product', this.product.id, {
        afterRedirect: async (product) => {
          this.product.id = product.id
          done()
        },
        alreadyDrafted: async () => {
          done()
        }
      }, this.$getcandy);
    },
    handleFileUploaded (file) {
      const pending = this.files;

      const remaining = filter(pending, existing => {
        return existing.id != file.id
      })

      this.$store.commit('product/setPendingAssets', remaining)
    }
  }
}
</script>
