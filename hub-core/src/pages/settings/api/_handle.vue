<template>
  <div>
    <h1 class="title">{{ settings.name }}</h1>
    <div class="box">
      <b-message type="is-info" v-if="!settings.content">
        {{ $t('No settings found') }}
      </b-message>
      <b-field v-for="(value, field) in settings.content" :key="field" :label="$t(capitalize(field))">
        <gc-input v-model="settings.content[field]" />
      </b-field>
    </div>
  </div>
</template>

<script>
  export default {
    layout: 'settings',
    async asyncData({ app, params }) {
      const settingResponse = await app.$gc.settings.find(params.handle)

      return {
        settings: settingResponse.data.data
      }
    },
    methods: {
      capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
    }
  }
</script>

<style scoped>

</style>
