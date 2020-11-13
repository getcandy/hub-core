<template>
  <div v-if="collection">
    <media-manager
      assetable="collections"
      :parent="collection"
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
    layout: 'collection',
    mixins: [
      NormalizesObjects,
      HasDrafts
    ],
    data() {
      return {
        collection: null,
        storeHandle: 'collections'
      }
    },
    mounted() {
      this.collection = this.normalize(this.model)
    },
    methods: {
      async handleFileAdded (file) {
        await this.createDraft('collections', this.collection.id, {
          beforeRedirect: async (draft) => {
            this.collection.id = draft.id
          }
        })
      },
      async handleChange (assets, done) {
        await this.createDraft('collections', this.collection.id, {
          afterRedirect: async (collection) => {
            this.collection.id = collection.id
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

        this.$store.commit('collections/setPendingAssets', remaining)
      }
    },
    computed: {
      model () {
        return this.$store.state.collections.model
      }
    }
  }
</script>
