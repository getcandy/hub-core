<template>
  <div>
    <div>
        <div class="px-6 py-3 text-right">
          <gc-button  @click="showBrowser = true" theme="gray">{{ $t('Add Categories') }}</gc-button>
        </div>
        <quick-view-panel heading="Search categories" :open="showBrowser" @close="showBrowser = false" width="w-2/3">
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
              <gc-button @click="attach(row)" theme="green" v-if="!selected.includes(row.id)">Attach</gc-button>
              <gc-button @click="detach(row)" theme="danger" v-else >Detach</gc-button>
            </template>
          </search-table>
        </quick-view-panel>
    </div>
    <div class="search-table">
      <div class="b-table">
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>{{ $t('Name') }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td><thumbnail-loader width="50px" :asset="category.assets.data[0]" /></td>
              <td>{{ attribute(category.attribute_data, 'name') }}</td>
              <td>
                <b-button @click="detach(category)" icon-right="delete-bin-line" type="is-danger" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  const each = require('lodash/each')
  import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'

  export default {
    mixins: [
      HasAttributes
    ],
    props: {
      product: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        each(this.categories, category => {
          this.selected.push(category.id)
        })
      })
    },
    data() {
      return {
        showBrowser: false,
        categories: this.product ? this.product.categories.data : [],
        selected: []
      }
    },
    methods: {
      detach(category) {
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
