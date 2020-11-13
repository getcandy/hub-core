<template>
  <form @submit.prevent="upload">
    <form-field :label="$t('YouTube video ID')" :instructions="$t('This is the YouTube video ID, not the whole URL')">
      <b-input v-model="id" required placeholder="G0LpOalhYTU" />
    </form-field>
    <button :disabled="processing" type="submit" class="inline-flex items-center rounded-md border border-green-300 px-4 py-2 bg-white text-base leading-6 font-medium text-green-600 shadow-sm hover:text-green-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 sm:text-sm sm:leading-5">
      <b-icon icon="loader-4-line" class="spin" v-if="processing" />
      <span v-else>{{ $t('Upload Video') }}</span>
    </button>
  </form>
</template>

<script>
export default {
  props: {
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
          'url': `https://youtu.be/${this.id}`,
          'mime_type': 'youtube'
        })
        this.$emit('uploaded', response.data)
      } catch (error) {
      }
      this.processing = false
    }
  }
}
</script>
