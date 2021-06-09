<template>
  <div>
    <div class="flex items-center my-2 text-sm bg-white rounded shadow" @mouseenter="showOptionIndicator = true" @mouseleave="showOptionIndicator = false">
      <div v-if="sortable" class="p-2">
        <div class="sorter">
          <svg width="13px" viewBox="0 0 13 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Artboard" fill="#ABABAB">
                <rect id="Rectangle" x="2" y="2" width="3" height="3" />
                <rect id="Rectangle-Copy-2" x="2" y="8" width="3" height="3" />
                <rect id="Rectangle-Copy-4" x="2" y="14" width="3" height="3" />
                <rect id="Rectangle-Copy-5" x="8" y="14" width="3" height="3" />
                <rect id="Rectangle-Copy" x="8" y="2" width="3" height="3" />
                <rect id="Rectangle-Copy-3" x="8" y="8" width="3" height="3" />
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div class="px-2">
        <button v-if="category.children_count" class="focus:outline-none" @click.prevent="toggleChildren">
          <gc-loading-spinner v-if="loadingChildren" class="w-4" />
          <gc-icon v-else :icon="!loadedChildren ? 'chevron-right' : 'chevron-down'" size="sm" />
        </button>
      </div>
      <div class="w-full py-3">
        <div class="flex items-center">
          <div>
            <nuxt-link
              :to="{
                name: 'categories.edit.details',
                params: {
                  id: category.id
                }
              }"
            >
              {{ category.name }}
            </nuxt-link>
          </div>
          <div v-if="category.has_draft">
            <span class="inline-block p-1 text-xs rounded bg-yello-100 text-yello-600">{{ $t('Has Draft') }}</span>
          </div>
        </div>
      </div>
      <div />
      <div>
        <div class="relative inline-block text-left">
          <div v-if="attachable" class="mr-2">
            <gc-button v-if="!selected.includes(category.id)" size="x-small" theme="green" @click="$emit('attach', category)">
              Attach
            </gc-button>
            <gc-button v-else theme="danger" size="x-small" @click="$emit('detach', category)">
              Detach
            </gc-button>
          </div>
          <template v-else>
            <div v-if="showOptionIndicator">
              <button type="button" class="inline-flex justify-center px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800" @click="showOptions = !showOptions">
                <gc-icon icon="dots-vertical" />
              </button>
            </div>
            <div v-if="showOptions" class="absolute right-0 z-50 w-56 mt-2 origin-top-right rounded-md shadow-lg">
              <div class="bg-white rounded-md shadow-xs ">
                <div class="py-1">
                  <button class="block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" @click="showCreateModal = true">
                    Create child
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div
      v-if="children.length"
      v-sortable="{
        handle: '.sorter',
        group: category.id,
        animation: 150,
        onEnd: reorder,
      }"
      class="pl-8"
    >
      <category-list-item
        v-for="child in children"
        :key="child.id" :sortable="children.length > 1"
        :category="child" @expand="handleExpanded"
        :attachable="attachable"
        :selected="selected"
        @attach="handleChildAttach"
        @detach="handleChildDetach"
      />
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
  name: 'CategoryListItem',
  directives: {
    ClickOutside
  },
  components: {
    CategoryCreate
  },
  props: {
    category: {
      type: Object,
      default () {
        return {}
      }
    },
    sortable: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => [],
    },
    attachable: {
      type: Boolean,
      default: false
    }
  },
  data () {
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
    handleChildAttach (category) {
      this.$emit('attach', category)
    },
    handleChildDetach (category) {
      this.$emit('detach', category)
    },
    loadChildren () {
      this.loadingChildren = true
      this.showCreateModal = false
      this.$getcandy.on('categories', 'getCategoriesParentParentId',
        this.category.id,
        'routes,assets.transforms,children'
      ).then((response) => {
        this.loadedChildren = true
        this.loadingChildren = false
        this.children = response.data.data
      })
    },
    toggleChildren () {
      this.loadedChildren = false
      if (this.children.length) {
        this.children = []
        this.loadingChildren = false
        return
      }
      this.loadChildren()
    },
    reorder ({ newIndex, oldIndex }) {
      if (newIndex === oldIndex) {
        return
      }
      // Get the current one
      const moved = this.children[oldIndex]
      const node = this.children[newIndex]

      this.children.splice(oldIndex, 1)
      this.children.splice(newIndex, 0, moved)

      let type = 'before'
      if (newIndex > oldIndex) {
        type = 'after'
      }

      this.$gc.categories.reorder(node.id, moved.id, type).then(() => {
        this.$notify.queue('success', this.$t('Category tree updated'))
      }).catch(() => {
        this.$notify.queue('error', this.$t('Unable to reorder categories'))
      })
    }
  }
}
</script>
