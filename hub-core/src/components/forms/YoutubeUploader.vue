<template>
  <form @submit.prevent="upload">
    <form-field :label="$t('YouTube video ID')" :instructions="$t('This is the YouTube video ID, not the whole URL')">
      <gc-input v-model="id" required placeholder="G0LpOalhYTU" />
    </form-field>
    <button :disabled="processing" type="submit" class="inline-flex items-center px-4 py-2 text-base font-medium leading-6 text-green-600 transition duration-150 ease-in-out bg-white border border-green-300 rounded-md shadow-sm hover:text-green-500 focus:outline-none focus:border-blue-300 focus:shadow-outline sm:text-sm sm:leading-5">
      <gc-loading-spinner v-if="processing" />
      <span v-else>{{ $t('Upload Video') }}</span>
    </button>
  </form>
</template>

<script>
export default {
  props: {
    assetable: {
      type: String,
      default: 'products'
    },
    parentId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'external'
    }
  },
  data () {
    return {
      id: null,
      processing: false
    }
  },
  methods: {
    async upload () {
      this.processing = true
      try {
        const response = await this.$gc.assets.upload({
          url: `https://youtu.be/${this.id}`,
          mime_type: 'youtube',
          parent_id: this.parentId,
          parent: this.assetable
        })
        this.$emit('uploaded', response.data)
        this.id = null
      } catch (error) {
      }
      this.processing = false
    }
  }
}
</script>
