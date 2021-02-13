<template>
  <form @submit.prevent="save" class="p-4">
    <form-field label="Name" :error="getFirstFormError('name')">
      <gc-input v-model="name" />
    </form-field>
    <form-field label="Regional">
      <gc-toggle v-model="regional" />
    </form-field>
    <gc-button type="submit">{{ $t('Create shipping zone') }}</gc-button>
  </form>
</template>

<script>
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'

export default {
  mixins: [
    HandlesForms
  ],
  data () {
    return {
      name: '',
      regional: true
    }
  },
  methods: {
    reset () {
      this.name = ''
      this.regional = true
    },
    async save () {
      try {
        await this.$getcandy.on('shipping', 'postShippingZones', {
          name: this.name,
          regional: this.type
        })
        this.$emit('created')
      } catch (e) {
        this.setFormErrors(e.response.data)
      }

    }
  }
}
</script>