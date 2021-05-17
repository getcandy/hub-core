<template>
  <div>
    <toolbar heading="Categories">
      <template v-slot:search>
        <gc-input v-model="searchTerm" placeholder="Search Categories" @input="setView('table')" />
      </template>

      <div class="flex items-center">
        <div class="mr-4">
          <div class="flex p-1 text-xs bg-gray-200 rounded shadow-inner">
            <button class="px-3 py-2 rounded focus:outline-none" :class="{ 'bg-white shadow text-purple-600': view == 'tree', 'bg-transparent text-gray-600 hover:text-gray-800' : view != 'tree' }" @click="setView('tree')">
              Tree view
            </button>
            <button class="px-3 py-2 rounded focus:outline-none" :class="{ 'bg-white shadow text-purple-600': view == 'table', 'bg-transparent text-gray-600 hover:text-gray-800' : view != 'table' }" @click="setView('table')">
              Table View
            </button>
          </div>
        </div>
        <div>
          <gc-button icon-left="plus" @click="showCreateModal = true">
            {{ $t('Create category') }}
          </gc-button>
        </div>
      </div>
    </toolbar>

    <quick-view-panel heading="Create a category" :open="showCreateModal" @close="showCreateModal = false">
      <div class="p-6">
        <category-create @created="showCreateModal = false" />
      </div>
    </quick-view-panel>
    <div>
      <category-tree v-show="view == 'tree'" />
    </div>
    <search-table
      v-show="view == 'table'"
      :search-placeholder="$t('Search categories by attribute')"
      :limit="pageLimit"
      :hoverable="true"
      type="categories"
      includes="channels,customer_groups,assets.transforms"
      :hide-search="true"
      :external-term="searchTerm"
      :columns="[
        {label: '', field: 'thumbnail'},
        {label: $t('Name'), field: 'name'},
        {label: $t('Channels'), field: 'channels'},
        {label: $t('Customer Groups'), field: 'customer-groups'},
        {label: $t('Purchasable'), field: 'customer-groups'},
      ]"
      @mouseenter="setContextRow"
    >
      <template v-slot:thumbnail="{ row }">
        <nuxt-link
          :to="{
            name: 'categories.edit.details',
            params: {
              id: row.id
            }
          }"
        >
          <thumbnail-loader width="30px" :asset="row.assets.data[0]" />
        </nuxt-link>
      </template>
      <template v-slot:name="{ row }">
        <nuxt-link
          :to="{
            name: 'categories.edit.details',
            params: {
              id: row.id
            }
          }"
        >
          {{ attribute(row.attribute_data, 'name') }}
        </nuxt-link>
      </template>
      <template v-slot:stock="{ row }">
        <edit-stock :product="row" />
      </template>
      <template v-slot:channels="{ row }">
        {{ visibility(row, 'channels') }}
      </template>
      <template v-slot:customer-groups="{ row }">
        {{ visibility(row, 'customer_groups') }}
      </template>
    </search-table>
  </div>
</template>

<script>
import { HasGroups, HasAttributes } from '@getcandy/hub-core/src/mixins/Index.js'
import CategoryTree from '../components/CategoryTree.vue'
import CategoryCreate from '../components/CategoryCreate.vue'

export default {
  components: {
    CategoryTree,
    CategoryCreate
  },
  mixins: [
    HasAttributes,
    HasGroups
  ],
  data () {
    return {
      pageLimit: 30,
      showCreateModal: false,
      view: 'tree',
      searchTerm: null,
      contextRow: null,
      views: {
        tree: 'Tree listing',
        table: 'Table listing'
      }
    }
  },
  mounted () {
    const { view } = this.$route.query
    this.setView(view)
  },
  methods: {
    setContextRow (row) {
      this.contextRow = row
    },
    setView (view) {
      this.view = view || 'tree'
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          ...{
            view: view || 'tree'
          }
        }
      })
    }
  },
  head () {
    return {
      title: 'Categories'
    }
  }
}
</script>
