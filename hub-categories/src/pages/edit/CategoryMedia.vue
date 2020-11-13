<template>
  <div v-if="category">
    <media-manager
      assetable="categories"
      :parent="category"
      @file-added="handleFileAdded"
      @changed="handleChange"
      @beforeSave="handleChange"
      @externalAssetAdded="handleExternalAssetUpload"
    />
  </div>
</template>

<script>
  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'
  import HasDrafts from '@getcandy/hub-core/src/mixins/HasDrafts.js'

  export default {
    layout: 'category',
    mixins: [
      NormalizesObjects,
      HasDrafts
    ],
    data() {
      return {
        category: null,
        storeHandle: 'categories'
      }
    },
    mounted() {
      this.category = this.normalize(this.model)
    },
    methods: {
      async handleFileAdded (file) {
        await this.createDraft('categories', this.category.id, {
          beforeRedirect: async (draft) => {
            this.category.id = draft.id
          }
        })
      },
      async handleChange (assets, done) {
        await this.createDraft('categories', this.category.id, {
          afterRedirect: async (category) => {
            this.category.id = category.id
            done()
          },
          alreadyDrafted: async () => {
            done()
          }
        });
      },
      async handleExternalAssetUpload (asset) {
      try {
        await this.createDraft('product', this.product.id, {
          beforeRedirect: async (draft) => {
            this.product.id = draft.id
          }
        })
        const response = await this.$gc.products.attachAsset(this.product.id, asset.data.id)
      } catch (err) {

      }
    },
      handleFileUploaded (file) {
        const pending = this.files;

        const remaining = filter(pending, existing => {
          return existing.id != file.id
        })

        this.$store.commit('categories/setPendingAssets', remaining)
      }
    },
    computed: {
      model () {
        return this.$store.state.categories.model
      }
    }
  }
</script>
