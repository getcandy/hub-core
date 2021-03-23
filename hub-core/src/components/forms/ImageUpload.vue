<template>
  <div>
    <div v-if="preview" class="relative border rounded">
      <div class="p-4 bg-gray-100">
        <img :src="preview" class="mx-auto shadow-sm">
      </div>
      <div class="flex items-center justify-between px-4 py-2 text-sm border-t">
        <div>
          {{ value.filename }}
        </div>
        <button class="text-gray-500  hover:text-red-500" @click="$emit('input', null)">
          <i class="text-lg ri-delete-bin-line" />
        </button>
      </div>
    </div>
    <template v-else>
      <div v-if="!uploading">
        <button
          class="flex w-full p-3 text-left border rounded"
          @click="() => {
            $refs['input'].click()
          }"
        >
          <div class="text-right">
            <span class="block px-2 py-1 text-xs font-bold text-gray-600 uppercase bg-gray-300 rounded hover:text-gray-700">
              {{ value ? 'Replace' : 'Upload' }}
            </span>
          </div>
        </button>
      </div>
      <div v-else class="flex items-center w-full p-3 text-xs font-bold text-gray-600 uppercase border rounded">
        <gc-loading-spinner /> Uploading
      </div>

      <input ref="input" type="file" class="hidden" @change="handleFileChange">
    </template>
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: null,
      required: true
    },
    hasCaption: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      uploading: false
    }
  },
  computed: {
    preview () {
      return this.value ? this.value.url : null
    }
  },
  methods: {
    async handleFileChange (event) {
      this.uploading = true
      if (event.target.files[0]) {
        const file = event.target.files[0]

        const formData = new FormData()
        formData.append('file', file)

        const response = await this.$gc.assets.uploadSimple(formData)
        this.$emit('input', response.data)
        this.$emit('uploaded', response.data)
        this.uploading = false
      }
    }
  }
}
</script>
