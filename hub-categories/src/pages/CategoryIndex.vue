<template>
  <div>
    <toolbar heading="Categories">
      <template v-slot:search>
        <b-input icon="search-line" v-model="searchTerm" placeholder="Search Categories" @input="setView('table')"></b-input>
      </template>

      <div class="flex items-center">
        <div class="mr-4">
          <div class="flex bg-gray-200 text-xs p-1 rounded shadow-inner">
            <button class="py-2 px-3 rounded focus:outline-none" @click="setView('table')" :class="{ 'bg-white shadow text-purple-600': view == 'table', 'bg-transparent text-gray-600 hover:text-gray-800' : view != 'table' }">Table View</button>
            <button class="py-2 px-3 rounded focus:outline-none" @click="setView('tree')" :class="{ 'bg-white shadow text-purple-600': view == 'tree', 'bg-transparent text-gray-600 hover:text-gray-800' : view != 'tree' }" >Tree view</button>
          </div>
        </div>
        <div>
          <gc-button @click="showCreateModal = true" icon-left="plus">
            {{ $t('Create category') }}
          </gc-button>
        </div>
      </div>




        <!--
        <b-field>
          <p class="control">
            <b-button class="icon-only">
              <b-icon icon="equalizer-line" />
            </b-button>
          </p>
        </b-field>
        -->

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
      :hideSearch="true"
      :external-term="searchTerm"
      @mouseenter="setContextRow"
      :columns="[
        {label: '', field: 'thumbnail'},
        {label: $t('Name'), field: 'name'},
        {label: $t('Channels'), field: 'channels'},
        {label: $t('Customer Groups'), field: 'customer-groups'},
        {label: $t('Purchasable'), field: 'customer-groups'},
      ]"
    >
      <template v-slot:thumbnail="row">
        <nuxt-link :to="{
            name: 'categories.edit.details',
            params: {
                id: row.id
            }
          }">
          <thumbnail-loader width="30px" :asset="row.assets.data[0]"></thumbnail-loader>
        </nuxt-link>
      </template>
          <template v-slot:name="row">
      <nuxt-link :to="{
        name: 'categories.edit.details',
        params: {
            id: row.id
        }
      }">
        {{ attribute(row.attribute_data, 'name') }}
      </nuxt-link>
    </template>
    <template v-slot:stock="row">
      <edit-stock :product="row" />
    </template>
    <template v-slot:channels="row">
      {{ visibility(row, 'channels') }}
    </template>
    <template v-slot:customer-groups="row">
      {{ visibility(row, 'customer_groups') }}
    </template>
      <!-- <template slot-scope="props">
        <b-table-column field="thumbnail" label="">
          <nuxt-link :to="{
            name: 'categories.edit.details',
            params: {
                id: props.row.id
            }
          }">
            <thumbnail-loader width="30px" :asset="props.row.assets.data[0]"></thumbnail-loader>
          </nuxt-link>
        </b-table-column>
        <b-table-column field="name" :label="$t('Name')" sortable>
          <nuxt-link :to="{
            name: 'categories.edit.details',
            params: {
                id: props.row.id
            }
          }">
          {{ attribute(props.row.attribute_data, 'name') }}
          </nuxt-link>
        </b-table-column>
        <b-table-column field="channels" :label="$t('Channels')">
          {{ visibility(props.row, 'channels') }}
        </b-table-column>
        <b-table-column field="customer_groups" :label="$t('Customer groups')">
          {{ visibility(props.row, 'customer_groups') }}
        </b-table-column>
        <b-table-column>
          <template v-if="contextRow && contextRow.id == props.row.id">
            <b-dropdown aria-role="list">
              <b-icon icon="more-line" slot="trigger" role="button" />

              <b-dropdown-item aria-role="listitem">Delete</b-dropdown-item>
            </b-dropdown>

          </template>
        </b-table-column>
      </template> -->
    </search-table>
  </div>
</template>

<script>
  import { HasGroups, HasAttributes } from '@getcandy/hub-core/src/mixins/Index.js'
  import CategoryTree from '../components/CategoryTree.vue'
  import CategoryCreate from '../components/CategoryCreate.vue'

  export default {
    mixins: [
      HasAttributes,
      HasGroups
    ],
    components: {
      CategoryTree,
      CategoryCreate
    },
    data() {
      return {
        pageLimit: 30,
        showCreateModal: false,
        view: 'table',
        searchTerm: null,
        contextRow: null,
        views: {
          table: 'Table listing',
          tree: 'Tree listing',
        }
      }
    },
    methods: {
      setContextRow(row) {
        this.contextRow = row
      },
      setView (view) {
        this.view = view || 'table'
        this.$router.push({
          path: this.$route.path,
          query: {
            ...this.$route.query,
            ...{
              view: view || 'table'
            }
          }
        })
      }
    },
    mounted() {
      const { view } = this.$route.query;
      this.setView(view)
    }
  }
</script>
