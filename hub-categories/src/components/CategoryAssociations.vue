<template>
  <div>
    <div>
      <div class="px-6 py-3 text-right">
        <gc-button theme="gray" @click="showBrowser = true">
          {{ $t('Add Categories') }}
        </gc-button>
      </div>
      <quick-view-panel heading="Search categories" :open="showBrowser" width="w-2/3" @close="showBrowser = false">
        <search-table
          :limit="10"
          includes="assets.transforms"
          :search-placeholder="$t('Search categories')"
          type="categories"
          :columns="[
            {label: '', field: 'thumbnail'},
            {label: $t('Name'), field: 'name'},
            {label: null, field: 'actions'},
          ]"
        >
          <template v-slot:thumbnail="{ row }">
            <thumbnail-loader width="25px" :asset="row.assets.data[0]" />
          </template>
          <template v-slot:name="{ row }">
            {{ attribute(row.attribute_data, 'name') }}
          </template>
          <template v-slot:actions="{ row }">
            <gc-button v-if="!selected.includes(row.id)" theme="green" @click="attach(row)">
              Attach
            </gc-button>
            <gc-button v-else theme="danger" @click="detach(row)">
              Detach
            </gc-button>
          </template>
        </search-table>
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
        {{ attribute(row.attribute_data, 'name') }}
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
const each = require('lodash/each')

export default {
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
      selected: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      each(this.categories, (category) => {
        this.selected.push(category.id)
      })
    })
  },
  methods: {
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
