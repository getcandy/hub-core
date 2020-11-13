<template>
  <div>
    <div v-if="preview" class="relative border rounded">
      <div class="p-4 bg-gray-100">
        <img :src="preview" class="mx-auto shadow-sm" />
      </div>
      <div class="py-2 px-4 text-sm border-t flex items-center justify-between">
        <div>
          {{ value.filename }}
        </div>
        <button @click="$emit('input', null)" class=" text-gray-500 hover:text-red-500">
          <i class="ri-delete-bin-line text-lg"></i>
        </button>
      </div>

    </div>
    <template v-else>
      <div v-if="!uploading">
        <button @click="() => {
          $refs['input'].click()
        }" class="border rounded w-full text-left p-3 flex">
          <div class="text-right">
            <span class="bg-gray-300 rounded text-xs text-gray-600 hover:text-gray-700 px-2 py-1 block font-bold uppercase">
            {{ value ? 'Replace' : 'Upload'}}
            </span>
          </div>
        </button>
      </div>
      <div class="p-3 border rounded flex items-center w-full text-gray-600 uppercase font-bold text-xs" v-else>
        <b-icon icon="loader-5-line" class="spin mr-2" /> Uploading
      </div>

      <input type="file" ref="input" class="hidden" @change="handleFileChange" />
    </template>
  </div>
</template>

<script>

  export default {
    props: {
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

          const response = await this.$gc.assets.uploadSimple(formData)
          this.$emit('input', response.data)
          this.$emit('uploaded', response.data)
          this.uploading = false
        }
      }
    }
  }
</script>
