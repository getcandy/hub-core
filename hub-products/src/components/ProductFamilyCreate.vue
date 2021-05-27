<template>
  <form class="p-4" @submit.prevent="createProductFamily">
    <gc-form-field label="Name" class="mb-4" required :error="getFirstFormError('name')">
      <gc-input v-model="name" />
    </gc-form-field>
    <gc-button type="submit" :loading="processing">
      Create product family
    </gc-button>
  </form>
</template>

<script>
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'
const get = require('lodash/get')

export default {
  mixins: [
    HandlesForms
  ],
  data () {
    return {
      name: null,
      processing: false
    }
  },
  methods: {
    async createProductFamily () {
      this.processing = true
      // this.setFormErrors([])
      try {
        const { data } = await this.$getcandy.on('product-families', 'postProductFamilies', {
          data: {
            name: this.name
          }
        })
        this.$router.push({
          name: 'product-families.edit',
          params: {
            id: data.data.id
          }
        })
      } catch (e) {
        this.setFormErrors(
          get(e, 'response.data.errors', [])
        )
      }
      this.processing = false
    }
  }
}
</script>
