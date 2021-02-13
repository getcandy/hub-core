<template>
  <div>
    <div v-if="!uploading" ref="uploader" />
    <b-progress v-else :value="60" type="is-success" />

    <div v-if="error" class="bg-red-100 text-red-600 py-2 px-4 text-sm font-medium">
      {{ error }}
    </div>

    <hr v-if="files.length">

    <div v-for="file in files" :key="file.id" class="columns">
      <div class="column">
        {{ file.id }}
        <img :src="file.src" width="100" height="100">
      </div>
      <div class="column">
        <b-icon icon="refresh-line" class="spin" />
      </div>
    </div>
  </div>
</template>

<script>
import { filter } from 'lodash'
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
      type: [String, Number],
      default: null
    },
    height: {
      type: [String, Number],
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
      error: null,
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
    addFileToStack (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        file.src = e.target.result
        this.files.push(file)
      }

      this.$emit('file-added', file)

      reader.readAsDataURL(file.data)

      if (this.processOnAdd) {
        this.uploader.upload().then((response) => {
          this.error = null
        }).catch((error) => {
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
