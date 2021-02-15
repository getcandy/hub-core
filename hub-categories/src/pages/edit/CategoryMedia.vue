<template>
  <div v-if="category">
    <media-manager
      :refreshing="pendingDraftCreation"
      assetable="categories"
      :parent="category"
      :process-on-add="false"
      @built="storeUploaderInstance"
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
        pendingDraftCreation: false,
        category: null,
        uploader: null,
        storeHandle: 'categories'
      }
    },
    mounted() {
      this.category = this.normalize(this.model)
    },
    methods: {
      storeUploaderInstance (instance) {
        this.instance = instance
      },
      async handleFileAdded (file) {
        this.pendingDraftCreation = true
        await this.createDraft('categories', this.category.id, {
          beforeRedirect: async (draft) => {
            this.category.id = draft.id
          }
        }, this.$getcandy)
        this.pendingDraftCreation = false
      },
      async handleChange (assets, done) {
        console.log('Here')
        // await this.createDraft('categories', this.category.id, {
        //   afterRedirect: async (category) => {
        //     this.category.id = category.id
        //     done()
        //   },
        //   alreadyDrafted: async () => {
        //     done()
        //   }
        // }, this.$getcandy);
      },
      async handleExternalAssetUpload (asset) {
        console.log('Que?')
      // try {
      //   await this.createDraft('product', this.product.id, {
      //     beforeRedirect: async (draft) => {
      //       this.product.id = draft.id
      //     }
      //   }, this.$getcandy)
      //   const response = await this.$gc.products.attachAsset(this.product.id, asset.data.id)
      // } catch (err) {

      // }
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
