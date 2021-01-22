<template>
  <div>
    <div ref="uploader" v-if="!uploading"></div>
    <b-progress :value="60" v-else type="is-success" />

    <div v-for="file in files" :key="file.id" class="flex items-center px-4 py-4">

      <div class="mr-4">
        <div class="flex">
          <img :src="file.src" width="100" height="100">
          <div class="ml-4">
            <span class="block text-sm font-bold">{{ file.name }}</span>
            <span class="text-xs font-bold text-gray-500 uppercase">{{ $format.number(file.size / 1000000) }}mb</span>
          </div>
        </div>
      </div>
      <div v-if="!!getFileErrors(file.id)">
        <span class="text-sm text-red-600">{{ getFileErrors(file.id).join(',') }}</span>
      </div>
      <div v-if="!getFileErrors(file.id)">
        <gc-icon icon="rotate-clockwise" spin />
        <!-- <b-icon icon="refresh-line" class="spin" /> -->
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
    processOnAdd: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: String,
      default: null
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
  watch: {
    processOnAdd (val) {
      if (val && this.files.length) {
        this.uploader.upload()
      }
    }
  },
  mounted () {
    const uppyTwo = new Uppy({ autoProceed: false })
    this.uploader = uppyTwo
      .use(DragDrop, { target: this.$refs.uploader })
      .use(UppyGetcandy, {
        context: this.$gc,
        parent_id: this.parentId,
        assetable: this.assetable,
        validation: {
          width: this.width,
          height: this.height
        }
      })
      .use(ProgressBar, { target: this.$refs.progressbar, hideAfterFinish: false })
      .on('upload-success', (file, response) => {
        this.uploader.removeFile(file.id)
        this.$emit('file-uploaded', {
          file,
          response
        })
      }).on('upload-error', (file, error, response) => {
        this.errors.push(response)
        setTimeout(() => {
          this.uploader.removeFile(file.id)
        }, 2000)
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
    this.$emit('built', this.uploader)
  },
  methods: {
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
        this.uploader.upload().then(response => {
          this.error = null
        }).catch(error => {
          this.uploader.removeFile(error.file)
          this.error = error.message
        })
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
