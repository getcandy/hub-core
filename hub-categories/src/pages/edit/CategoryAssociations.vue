<template>
  <div v-if="category">
    <b-tabs :animated="false" horizontal v-model="activeTab" class="secondary-tabs">
      <b-tab-item :label="tab.title" v-for="(tab, tabIndex) in tabs" :key="tabIndex">
        <component :is="tab.component" :category="category" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
  import ChildAssociations from '../../components/ChildAssociations.vue'
  export default {
    layout: 'category',
    components: {
      ChildAssociations
    },
    data() {
      return {
        category: null,
        activeTab: 0,
        tabs: [{
          title: 'Child Categories',
          component: ChildAssociations
        }]
      }
    },
    mounted() {
      this.category = JSON.parse(JSON.stringify(this.$store.state.categories.model))
      this.$nuxt.context.app.$hooks.callHook('categories.associations.tabs', this.tabs);
    }
  }
</script>
