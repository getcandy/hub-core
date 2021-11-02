<template>
  <div v-if="category">
    <!-- Here we want to loop through any sections that have been hooked into -->
    <div class="flex pl-4 text-gray-600 bg-gray-200">
      <button
        v-for="(item, tabIndex) in tabs"
        :key="tabIndex"
        :class="activeTab == tabIndex ? 'bg-white text-gray-600' : 'hover:bg-gray-300'"
        class="px-6 py-4 text-sm border-none outline-none focus:border-none focus:outline-none "
        @click="activeTab = tabIndex"
      >
        {{ item.title }}
      </button>
    </div>
    <component :is="tab" :category="category" />
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
  computed: {
    tab () {
      return this.tabs[this.activeTab].component
    }
  },
  mounted () {
    this.category = JSON.parse(JSON.stringify(this.$store.state.categories.model))
    this.$nextTick(async () => {
      this.$nuxt.context.app.$hooks.callHook('categories.associations.tabs', this.tabs)
    })
  }
}
</script>
