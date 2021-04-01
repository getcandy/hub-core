<template>
  <div>
    <div v-if="preview" class="relative border rounded">
      <div class="p-4 bg-gray-100">
        <img :src="preview" class="mx-auto shadow-sm" />
      </div>
      <div class="flex items-center justify-between px-4 py-2 text-sm border-t">
        <div>
          {{ value.filename }}
        </div>
        <button @click="$emit('input', null)" class="text-gray-500 hover:text-red-500">
          <gc-icon icon="trash" />
        </button>
      </div>

    </div>
    <template v-else>
      <div v-if="!uploading">
        <button @click="() => {
          $refs['input'].click()
        }" class="flex w-full p-3 text-left border rounded">
          <div class="text-right">
            <span class="block px-2 py-1 text-xs font-bold text-gray-600 uppercase bg-gray-300 rounded hover:text-gray-700">
            {{ value ? 'Replace' : 'Upload'}}
            </span>
          </div>
        </button>
      </div>
      <div class="flex items-center w-full p-3 text-xs font-bold text-gray-600 uppercase border rounded" v-else>
        <loading-spinner class="mr-2" /> Uploading
      </div>

      <input type="file" ref="input" class="hidden" @change="handleFileChange" />
    </template>
  </div>
</template>

<script>

  export default {
    props: {
      disk: {
        type: String,
        default: 'public'
      },
      path: {
        type: String,
        default: 'uploads'
      },
      value: {
        type: null
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

          let formData = new FormData();
          formData.append('file', file);
          formData.append('disk', this.disk);
          formData.append('path', this.path);

          const response = await this.$gc.assets.uploadSimple(formData)
          this.$emit('input', response.data)
          this.$emit('uploaded', response.data)
          this.uploading = false
        }
      }
    }
  }
</script>
