<template>
  <form @submit.prevent="save" class="p-4">
    <form-field label="Name">
      <gc-input v-model="name.en" />
    </form-field>
    <form-field label="Type">
      <gc-select-input v-model="type">
        <option value="regional">{{ $t('Regional') }}</option>
      </gc-select-input>
    </form-field>
    <gc-button type="submit">{{ $t('Create shipping method') }}</gc-button>
  </form>
</template>

<script>
export default {
  data () {
    return {
      name: {
        en: ''
      },
      type: 'regional'
    }
  },
  methods: {
    reset () {
      this.name = {
        en: ''
      }
      this.type = 'regional'
    },
    async save () {
      await this.$getcandy.on('shipping', 'postShipping', {
        name: this.name,
        type: this.type
      })
      this.$emit('created')
    }
  }
}
</script>