<template>
  <select-input v-model="language" @input="input" >
    <option v-for="(lang, index) in languages" :key="index" :value="lang">{{ $t(lang) }}</option>
  </select-input>
</template>

<script>

  export default {
    props: ['value'],
    data() {
      return {
        language: this.value,
      }
    },
    methods: {
      input(event) {
        this.$emit('input', event)
      }
    },
    computed: {
      languages() {
        return this.$i18n.availableLocales
      }
    }
  }
</script>

<style scoped>

</style>
