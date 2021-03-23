<template>
  <div v-if="collection">
    <gc-tabs>
      <gc-tab-item v-for="(tab, tabIndex) in tabs" :key="tabIndex" :label="tab.title">
        <component :is="tab.component" :collection="collection" />
      </gc-tab-item>
    </gc-tabs>
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
