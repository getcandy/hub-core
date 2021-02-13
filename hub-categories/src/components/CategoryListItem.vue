<template>
  <div>
    <div class="flex items-center my-2 text-sm bg-white rounded shadow" @mouseenter="showOptionIndicator = true" @mouseleave="showOptionIndicator = false">
      <div class="p-2" v-if="sortable">
        <div class="sorter">
            <svg  width="13px" viewBox="0 0 13 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Artboard" fill="#ABABAB">
                  <rect id="Rectangle" x="2" y="2" width="3" height="3"></rect>
                  <rect id="Rectangle-Copy-2" x="2" y="8" width="3" height="3"></rect>
                  <rect id="Rectangle-Copy-4" x="2" y="14" width="3" height="3"></rect>
                  <rect id="Rectangle-Copy-5" x="8" y="14" width="3" height="3"></rect>
                  <rect id="Rectangle-Copy" x="8" y="2" width="3" height="3"></rect>
                  <rect id="Rectangle-Copy-3" x="8" y="8" width="3" height="3"></rect>
                </g>
              </g>
            </svg>
        </div>
      </div>
      <div class="px-2">
        <button class="btn-muted focus:outline-none" @click.prevent="toggleChildren" v-if="category.children_count">
          <b-icon icon="loader-5-line" custom-class="spin" v-if="loadingChildren" />
          <b-icon :icon="!loadedChildren ? 'arrow-right-s-line' : 'arrow-down-s-line'" v-else />
        </button>
      </div>
      <div class="w-full py-3">
        <div class="flex items-center">
          <div>
            <nuxt-link :to="{
              name: 'categories.edit.details',
              params: {
                  id: category.id
              }
            }">
              {{ category.name }}
            </nuxt-link>
          </div>
          <div v-if="category.has_draft">
            <span class="inline-block p-1 text-xs rounded bg-yello-100 text-yello-600">{{ $t('Has Draft') }}</span>
          </div>
        </div>

      </div>
      <div>
      </div>
      <div>
        <div class="relative inline-block text-left">
          <div v-if="showOptionIndicator">
              <button @click="showOptions = !showOptions" type="button" class="inline-flex justify-center px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800">
                <b-icon icon="more-2-line" />
              </button>
          </div>
          <div class="absolute right-0 z-50 w-56 mt-2 origin-top-right rounded-md shadow-lg" v-if="showOptions">
            <div class="bg-white rounded-md shadow-xs ">
              <div class="py-1">
                <button @click="showCreateModal = true" class="block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">Create child</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="children.length" class="pl-8" v-sortable="{
      handle: '.sorter',
      group: category.id,
      animation: 150,
      onEnd: this.reorder,
    }">
      <category-list-item @expand="handleExpanded" v-for="child in children" :sortable="children.length > 1" :category="child" :key="child.id" />
    </div>
    <quick-view-panel heading="Create a child category" :open="showCreateModal" @close="showCreateModal = false">
        <div class="p-6">
          <category-create :parent="category" @created="loadChildren" />
        </div>
      </quick-view-panel>
  </div>
      <!-- <ul v-if="children.length" v-sortable="{
        handle: '.sorter',
        group: category.id,
        animation: 150,
        onEnd: this.reorder,
      }">
        <category-list-item v-for="child in children" :sortable="children.length > 1" :category="child" :key="child.id" />
      </ul> -->
</template>

<script>
  import ClickOutside from 'vue-click-outside'
  import CategoryCreate from '../components/CategoryCreate.vue'

  export default {
    name: 'category-list-item',
    directives: {
      ClickOutside,
    },
    components: {
      CategoryCreate
    },
    props: {
      category: {
        type: Object,
        default() {
          return {}
        }
      },
      sortable: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        children: [],
        loadedChildren: false,
        loadingChildren: false,
        showOptionIndicator: false,
        showCreateModal: false,
        showOptions: false
      }
    },
    methods: {
      handleExpanded (parent, child) {
        this.$emit('expanded', parent, child)
      },
      loadChildren() {
        this.loadingChildren = true
        this.showCreateModal = false
        this.$getcandy.on('categories', 'getCategoriesParentParentId',
          this.category.id,
          'routes,assets.transforms'
        ).then(response => {
          this.loadedChildren = true
          this.loadingChildren = false
          this.children = response.data.data
        })
      },
      toggleChildren() {
        this.loadedChildren = false
        if (this.children.length) {
          this.children = [];
          this.loadingChildren = false
          return;
        }
        this.loadChildren()
      },
      reorder({newIndex, oldIndex}) {
        if (newIndex === oldIndex) {
          return;
        }
        // Get the current one
        const moved = this.children[oldIndex];
        const node = this.children[newIndex];

        this.children.splice(oldIndex, 1)[0];
        this.children.splice(newIndex, 0, moved);

        let type = 'before';
        if (newIndex > oldIndex) {
          type = 'after';
        }

        this.$gc.categories.reorder(node.id, moved.id, type).then(response => {
          this.$notify.queue('success', this.$t('Category tree updated'))
        }).catch(e => {
          this.$notify.queue('error', this.$t('Unable to reorder categories'))
        })
      },
    }
  }
</script>
