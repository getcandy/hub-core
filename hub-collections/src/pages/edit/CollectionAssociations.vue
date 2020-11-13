<template>
  <div v-if="category">
    <b-tabs :animated="false" vertical position="is-right" v-model="activeTab">
      <b-tab-item :label="tab.title" v-for="(tab, tabIndex) in tabs" :key="tabIndex">
        <component :is="tab.component" :collection="collection" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
  export default {
    layout: 'collection',
    data() {
      return {
        category: null,
        activeTab: 0,
        tabs: []
      }
    },
    mounted() {
      this.collection = JSON.parse(JSON.stringify(this.$store.state.collections.model))
      this.$nuxt.context.app.$hooks.callHook('categories.associations.tabs', this.tabs);
    },
  }
</script>
