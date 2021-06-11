<template>
  <div>
    <div>
      <div class="px-6 py-3 text-right">
        <gc-button theme="gray" @click="showBrowser = true">
          {{ $t('Add Categories') }}
        </gc-button>
      </div>
      <quick-view-panel heading="Attach categories" container-class="h-full overflow-y-auto" :open="showBrowser" width="w-2/3" @close="showBrowser = false">
        <div class="p-4 bg-gray-100">
          <category-list-item
            v-for="category in tree"
            :key="category.id"
            :sortable="false"
            :category="category"
            :selected="selected"
            :attachable="true"
            @attach="attach"
            @detach="detach"
          />
        </div>
      </quick-view-panel>
    </div>
    <gc-table
      :data="categories"
      :columns="[
        {label: '', field: 'thumbnail'},
        {label: 'Name', field: 'name'},
        {label: '', field: 'actions'},
      ]"
    >
      <template v-slot:thumbnail="{ row }">
        <thumbnail-loader width="50px" :asset="row.assets.data[0]" />
      </template>
      <template v-slot:name="{ row }">
        <span v-if="row.name">
          {{ row.name }}
        </span>
        <span v-else>
          {{ attribute(row.attribute_data, 'name') }}
        </span>
      </template>
      <template v-slot:actions="{ row }">
        <gc-button theme="danger" @click="detach(row)">
          Detach
        </gc-button>
      </template>
    </gc-table>
  </div>
</template>

<script>
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
import CategoryListItem from './CategoryListItem.vue'
const each = require('lodash/each')

export default {
  components: {
    CategoryListItem
  },
  mixins: [
    HasAttributes
  ],
  props: {
    product: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showBrowser: false,
      categories: this.product ? this.product.categories.data : [],
      selected: [],
      tree: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      each(this.categories, (category) => {
        this.selected.push(category.id)
      })
    })
    this.loadTree()
  },
  methods: {
    async loadTree () {
      const { data } = await this.$getcandy.on('categories', 'getCategories', {
        query: {
          tree: true,
          include: 'assets.transforms'
        }
      })

      this.tree = data.data
    },
    detach (category) {
      this.selected.splice(this.selected.indexOf(category.id), 1)
      this.categories.splice(this.categories.indexOf(category), 1)

      this.$emit('changed', () => {
        this.save()
      })
    },
    attach (category) {
      this.selected.push(category.id)
      this.categories.push(category)
      this.$emit('changed', () => {
        this.save()
      })
    },
    async save () {
      await this.$gc.products.associateCategories(this.product.id, this.selected)
      this.$notify.queue('success', this.$t('Associations updated'))
    }
  }
}
</script>
