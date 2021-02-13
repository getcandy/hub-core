<template>
  <div>
    <div>
      <quick-view-panel :open="showUploader" heading="Upload asset" :takeover="true" @close="showUploader = false">
        <gc-file-upload
            @built="initUploader"
            @file-added="handleFileAdded"
            @file-uploaded="handleFileUploaded"
            @finished="showUploader = false"
            :initial-files="pending"
            :process-on-add="processOnAdd"
            :assetable="assetable"
            :parent-id="parent.id"
          />
      </quick-view-panel>
      <quick-view-panel :heading="$t('Upload YouTube video')" :open="showYoutubeUpload" @close="showYoutubeUpload = false">
        <div class="p-6">
          <youtube-uploader type="youtube" @uploaded="handleExternalAssetUpload" :assetable="assetable" :parent-id="parent.id" />
        </div>
      </quick-view-panel>
      <div class="flex items-center px-6 py-4 bg-white">
        <div class="mr-4">
          <gc-button @click="showUploader = true">Upload file</gc-button>
        </div>
        <div>
          <gc-button @click="showYoutubeUpload = true">
            Upload YouTube Video
          </gc-button>
        </div>
      </div>
      <!-- <div class="w-1/3">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <button @click="showYoutubeUpload = true" class="px-4 py-2 text-sm text-white bg-gray-800 rounded shadow-md hover:bg-gray-900">
              <div class="flex items-center">
              <b-icon icon="youtube-line" class="mr-2 text-youtube" />
              <span class="inline-flex">Upload YouTube Video</span>
              </div>
            </button>
            <quick-view-panel :heading="$t('Upload YouTube video')" :open="showYoutubeUpload" @close="showYoutubeUpload = false">
              <div class="p-6">
                <youtube-uploader type="youtube" @uploaded="handleExternalAssetUpload" />
              </div>
            </quick-view-panel>
          </div>
        </div>
      </div> -->
    </div>

    <div class="px-8 text-sm font-medium bg-gray-900">
      <div class="flex">
        <button
          class="px-8 py-3 text-gray-400 focus:outline-none"
          :class="{
            'text-gray-900 bg-white' : filter == type.handle,
            'hover:bg-gray-800 hover:text-white' : filter != type.handle
          }"
          @click="filter = type.handle"
          v-for="(type, index) in types"
          :key="index"
        >
        {{ $t(type.label) }}
        </button>
      </div>
    </div>
    <gc-table
      :data="getFilteredResults"
      :sortable="sortableOptions"
      :columns="[
        {label: 'Primary', field: 'primary'},
        {label: null, field: 'thumbnail'},
        {label: 'Title/Alt Tag', field: 'title'},
        {label: 'Caption', field: 'caption'},
        {label: 'Tags', field: 'tags'},
        {label: 'Type', field: 'type'},
        {label: null, field: 'actions'},
      ]"
    >
      <template v-slot:primary="{ row }">
        <gc-toggle v-model="row.primary" v-if="getThumbnail(row)" @click="setPrimary(row)" />
      </template>
      <template v-slot:thumbnail="{ row }">
        <thumbnail-loader :asset="row" width="50px" />
      </template>
      <template v-slot:title="{ row }">
        <gc-input v-model="row.title" @blur="save" />
      </template>
      <template v-slot:caption="{ row }">
        <gc-input v-model="row.caption" @blur="save" />
      </template>
      <template v-slot:tags="{ row }">
        <b-taginput
          @input="save"
          :data="defaultTags"
          v-model="row.tags"
          :placeholder="$t('Asset tags')"
          icon="price-tag-3-line"
        />
      </template>
      <template v-slot:type="{ row }">
        <span v-if="row.extension">.{{ row.extension }}</span><span v-else>-</span>
      </template>
      <template v-slot:actions="{ row }">
        <a :href="row.url" class="button is-text" target="_blank">
          <b-icon icon="download-line" size="is-small" />
        </a>
        <gc-button size="x-small" @click="showDeleteModal(row)" theme="danger">
          <b-icon icon="delete-bin-line" size="is-small" />
        </gc-button>
      </template>
    </gc-table>


    <simple-modal heading="Permanent delete" :open="deleteModalOpen" @confirmed="deleteAsset" @close="deleteModalOpen = false">
      {{ $t('This action cannot be undone') }}
    </simple-modal>
  </div>
</template>

<script>
import QuickViewPanel from './QuickViewPanel.vue'
const first = require('lodash/first')
const find = require('lodash/find')
const map = require('lodash/map')
const get = require('lodash/get')


export default {
  components: { QuickViewPanel },
  props: {
    processOnAdd: {
      type: Boolean,
      default: true
    },
    assetable: {
      type: String,
      default: () => {}
    },
    parent: {
      type: Object,
      default: () => {}
    },
    token: {
      type: String,
      default: null
    },
    pending: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showUploader: false,
      deleteModalOpen: false,
      assetToDelete: {},
      filter: null,
      processingAssetUrl: false,
      failedUploads: [],
      assetUrlType: 'external',
      defaultTags: [],
      showYoutubeUpload: false,
      urlUpload: {
        type: 'youtube',
        url: ''
      },
      uploader: null,
      sortableOptions: {
        onEnd: this.reorder,
        filter: '.disabled',
        handle: '.handle',
        animation: 150
      },
      types: [
        {
          label: 'All',
          handle: null,
        },
        {
          label: 'Images',
          handle: 'images',
        },
        {
          label: 'Files',
          handle: 'files',
        },
        {
          label: 'Videos',
          handle: 'videos',
        }
      ],
      mimeTypes: [
        {
          label: 'YouTube',
          value: 'youtube'
        },
        {
          label: 'Vimeo',
          value: 'vimeo'
        },
        {
          label: 'URL',
          value: 'external'
        }
      ],
      urlUploadModalOpen: false,
      assets: [],
      assetsToUpload: [],
      dzOptions: {
        headers: {
          'X-CANDY-HUB': true
        }
      }
    }
  },
  computed: {
    /**
     * Gets filtered results for the assets
     * @param  {string} type
     * @return {Object}
     */
    getFilteredResults () {
      if (this.filter) {
        return this.assets.filter((asset) => {
          if (this.filter === 'images') {
            return asset.kind === 'image'
          } else if (this.filter === 'videos') {
            return asset.external && asset.kind !== 'image'
          } else {
            return asset.kind !== 'image' && !asset.external
          }
        })
      }
      return this.assets
    },
    parentId () {
      return this.parent.id
    }
  },
  watch: {
    parentId (val) {
      if (val !== this.parent.id) {
        this.initAssets()
      }
    }
  },
  mounted () {
    this.initAssets()
    this.urlUpload.type = this.mimeTypes[0].value
  },
  methods: {
    initAssets () {
      this.assets = []
      this.parent.assets.data.forEach((asset) => {
        if (asset.tags.data) {
          asset.tags = map(asset.tags.data, tag => {
            return tag.name
          })
          delete asset.tags.data
        } else {
          asset.tags = []
        }
        this.assets.push(asset)
      })
    },
    save () {
      this.$emit('beforeSave', this.assets, (done) => {
        this.saveAssets()
      })
    },
    saveAssets () {
      const formData = new FormData()
      formData.append('assets', this.assets)
      this.$gc.assets.put({
        assets: this.assets
      }).then((response) => {
        this.$buefy.toast.open({
          message: 'Assets Saved',
          position: 'is-bottom',
          type: 'is-success'
        })
      })
    },
    handleExternalAssetUpload (response) {
      const asset = response.data
      asset.tags = []
      this.$emit('beforeSave', this.assets, (done) => {
        this.assets.push(asset)
      })
      this.showYoutubeUpload = false
      this.$emit('externalAssetAdded', response)
    },
    initUploader (context) {
      this.uploader = context
      this.$emit('built', context)
    },
    handleFileAdded (file) {
      this.$emit('file-added', file)
    },
    handleFileUploaded (data) {
      this.$emit('file-uploaded', data.file)
      const response = data.response.body.data
      response.tags = get(response, 'tags', [])
      this.assets.push(response)
    },
    getThumbnail (asset) {
      if (asset.thumbnail) {
        return asset.thumbnail
      }
      if (!asset.transforms || !asset.transforms.data.length) {
        return false
      }
      return first(asset.transforms.data).url
    },
    deleteAsset (event) {
      const asset = this.assetToDelete;
      this.$getcandy.on('assets', 'postAssetsAssetIdDetachOwnerId', asset.id, this.parentId, {
        type: asset.type
      }).then(response => {
        this.assets.splice(this.deletedIndex, 1)
        this.assetToDelete = {}
        this.deletedIndex = null
        this.deleteModalOpen = false
        this.$notify.queue('success', 'Asset deleted')
      })
    },
    reorder ({ oldIndex, newIndex }) {
      this.$emit('changed', this.assets, (done) => {
        const movedItem = this.assets.splice(oldIndex, 1)[0]
        this.assets.splice(newIndex, 0, movedItem)
        let pos = 1
        this.assets.forEach((asset) => {
          asset.position = pos
          pos++
        })
        this.save()
      })
    },
    setPrimary (newPrimary) {
      this.assets.forEach((asset) => {
        if (asset.id === newPrimary.id) {
          asset.primary = 1
        } else {
          asset.primary = 0
        }
      })
      this.save()
    },
    /**
     * Shows the delete modal for an asset
     * @param  int index
     * @return void
     */
    showDeleteModal (asset) {
      this.deletedIndex = this.assets.indexOf(asset)
      this.assetToDelete = asset
      this.deleteModalOpen = true
    },
    openUrlModal () {
      this.urlUploadModalOpen = true
    },
    closeUrlModal () {
      this.urlUploadModalOpen = false
    },
    closeDeleteModal () {
      this.deleteModalOpen = false
    },
    getIcon (type) {
      return '/candy-hub/icons/file-types/' + type + '.svg'
    }
  }
}
</script>
