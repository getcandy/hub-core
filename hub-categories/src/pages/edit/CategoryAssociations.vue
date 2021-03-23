<template>
  <div v-if="category">
    <gc-tabs>
      <gc-tab-item v-for="(tab, tabIndex) in tabs" :key="tabIndex" :label="tab.title">
        <component :is="tab.component" :category="category" />
      </gc-tab-item>
    </gc-tabs>
  </div>
</template>

<script>
import ChildAssociations from '../../components/ChildAssociations.vue'
export default {
  layout: 'category',
  components: {
    ChildAssociations
  },
  data () {
    return {
      category: null,
      activeTab: 0,
      tabs: [{
        title: 'Child Categories',
        component: ChildAssociations
      }]
    }
  },
  mounted () {
    this.category = JSON.parse(JSON.stringify(this.$store.state.categories.model))
    this.$nuxt.context.app.$hooks.callHook('categories.associations.tabs', this.tabs)
  }
}
</script>
