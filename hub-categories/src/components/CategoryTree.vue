<template>
  <div>
    <div class="bg-gray-200 px-24 py-4 text-xs font-bold uppercase text-gray-600">
      Name
    </div>
    <div class="m-4" v-sortable="{
        handle: '.sorter',
        group: 'root',
        onEnd: this.reorder,
        animation: 150,
      }">
        <category-list-item @expanded="handleExpanded" v-for="category in categories" :key="category.id" :sortable="categories.length > 1" :category="category" />
    </div>
  </div>
</template>

<script>
  import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
  import CategoryListItem from './CategoryListItem.vue'

  export default {
    components: {
      CategoryListItem
    },
    mixins: [
      HasAttributes
    ],
    mounted() {
      this.$getcandy.on('Categories').getCategories(null, null, true).then(response => {
        this.categories = response.data.data
      })
    },
    data() {
      return {
        categories: [],
        trail: [],
      }
    },
    methods: {
      handleExpanded (parent, child) {
      },
      handleClosed (id) {

      },
      reorder({newIndex, oldIndex}) {
        // Get the current one
        const moved = this.categories[oldIndex];
        const node = this.categories[newIndex];

        this.categories.splice(oldIndex, 1)[0];
        this.categories.splice(newIndex, 0, moved);

        let type = 'before';
        if (newIndex > oldIndex) {
            type = 'after';
        }

        this.$gc.categories.reorder(node.id, moved.id, type).then(response => {
          this.$buefy.toast.open({
            message: 'Categories Reordered',
            type: 'is-success'
          })
        }).catch(e => {
          this.$buefy.toast.open({
            duration: 5000,
            message: `Unable to reorder categories`,
            position: 'is-bottom',
            type: 'is-danger'
          })
        })
      },
    }
  }
</script>

<style scoped>
.search-table {
  max-height: 200px;
  overflow-y: auto;
}
</style>
