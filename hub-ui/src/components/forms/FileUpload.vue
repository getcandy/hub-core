<template>
  <div>
    <div>
      <div class="bg-gray-100 border-b">
        <div ref="uploader">&nbsp;</div>
      </div>
      <div>
        <span class="block p-4 text-sm text-center text-gray-500" v-if="!files.length && !processOnAdd">Files pending upload will appear here.</span>
        <div v-for="file in files" :key="file.id" class="p-4 border-b">
          <div class="flex">
                <img :src="file.src" width="50" class="mr-4" v-if="file.type.includes('image')">
              <div class="mr-4" v-else>
                <gc-icon icon="file-text" size="lg" />
              </div>
              <div class="flex-none w-full ">
                <p class="text-sm truncate">{{ file.name }}</p>
                <span class="text-xs font-bold text-gray-500 uppercase">{{ $format.number(file.size / 1000) }}kb</span>
              </div>
          </div>
          <div v-if="!!getFileErrors(file.id)">
            <span class="text-sm text-red-600">{{ getFileErrors(file.id).join(',') }}</span>
          </div>
          <div v-if="!getFileErrors(file.id)">
          </div>
        </div>
        <div v-if="errors.length && !files.length" class="p-4">
          <div v-for="(error, errorIndex) in errors" :key="errorIndex">
            <span class="text-sm text-red-600">{{ error.message }}</span>
          </div>
        </div>
        <div class="p-4" v-if="!processOnAdd">
          <gc-button @click="startUpload"  :loading="refreshing" v-if="!refreshing && files.length">Start Upload</gc-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const filter = require('lodash/filter')
const find = require('lodash/find')

import UppyGetcandy from '@getcandy/hub-core/src/modules/UppyGetCandy'
const Uppy = require('@uppy/core')
const DragDrop = require('@uppy/drag-drop')
const ProgressBar = require('@uppy/progress-bar')
// const UppyGetcandy = require('~/core/UppyGetcandy')


export default {
  props: {
    initialFiles: {
      type: Array,
      default: () => []
    },
    width: {
      default: null
    },
    height: {
      default: null
    },
    parentId: {
      type: String,
      default: null
    },
    processOnAdd: {
      type: Boolean,
      default: false
    },
    refreshing: {
      type: Boolean,
      default: false
    },
    assetable: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      uploader: null,
      errors: [],
      files: [],
      uploading: false
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    parentId () {
      // Looks like the parentId has changed, so we need to make sure we
      // add the files that got uploaded back into the instance.
      let filesToPreserve = []
      if (this.uploader) {
        filesToPreserve = this.uploader.getFiles()
      }
      this.init(filesToPreserve)
    }
  },
  computed: {
    config () {
      return {
        context: this.$gc,
        parent_id: this.parentId,
        assetable: this.assetable,
        validation: {
          width: this.width,
          height: this.height,
          size: this.$store.state.core.maxUploadSize
        }
      }
    }
  },
  methods: {
    startUpload () {
      if (this.refreshing) {
        return
      }
      this.errors = []
      this.uploader.upload().then(response => {
        if (!response.failed.length) {
          this.$emit('finished')
          return;
        }
      }).catch(error => {
        this.uploader.removeFile(error.file)
        this.errors.push(error.message)
      })
    },
    init (files) {
      if (this.uploader) {
        this.uploader.close()
      }
      const uppyTwo = new Uppy({
        autoProceed: false
      })
      this.uploader = uppyTwo
        .use(DragDrop, {
          target: this.$refs.uploader
        })
        .use(UppyGetcandy, this.config)
        .use(ProgressBar, {
          target: this.$refs.progressbar,
          hideAfterFinish: false
        })
        .on('upload-success', (file, response) => {
          this.uploader.removeFile(file.id)
          this.$emit('file-uploaded', {
            file,
            response
          })
        }).on('error', (error, fileId) => {
          this.uploader.removeFile(fileId)
          this.errors.push(error)
        }).on('upload-error', (file, error, response) => {
          this.errors.push(response)
          setTimeout(() => {
            this.uploader.removeFile(file.id)
          }, 5000)
        }).on('file-added', file => this.addFileToStack(file))
        .on('file-removed', file => this.removeFileFromStack(file))

      if (this.initialFiles.length) {
        this.initialFiles.forEach((file) => {
          try {
            this.uploader.addFile(file)
          } catch (e) {
            //
          }
        })
      }

      if (files) {
        this.uploader.addFiles(files)
      }

      this.$emit('built', this.uploader)
    },
    getFileErrors (fileId) {
      const match = find(this.errors, error => {
        return error.file === fileId
      })
      return match ? match.errors : null
    },
    addFileToStack (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        file.src = e.target.result
        this.files.push(file)
      }
      this.$emit('file-added', file)
      reader.readAsDataURL(file.data)

      if (this.processOnAdd) {
        this.startUpload()
      }
    },
    removeFileFromStack (oldFile) {
      this.files = filter(this.files, (file) => {
        return oldFile.id !== file.id
      })
    }
  }
}
</script>

<style>
.uppy-DragDrop--isDragDropSupported {
  border:none!important;
}
</style>
