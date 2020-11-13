<template>
  <div>
    <div class="tab-content-tools">
        <b-button type="is-primary" @click="showCategoryBrowser = true">Add Category</b-button>
        <b-modal :active.sync="showCategoryBrowser"
          has-modal-card
          trap-focus
          aria-role="dialog"
          aria-modal
        >
          <div class="card">
            <div class="card-content">
              <search-table :limit="10" includes="assets.transforms" :search-placeholder="$t('Search Categories')" type="category" >
                <template slot-scope="props">
                  <b-table-column field="thumbnail">
                    <thumbnail-loader width="25px" :asset="props.row.assets.data[0]" />
                  </b-table-column>
                  <b-table-column field="name" :label="$t('Name')">
                    {{ attribute(props.row.attribute_data, 'name') }}
                  </b-table-column>
                  <b-table-column field="actions">
                    <b-button @click="attach(props.row)" icon-right="add-box-line" type="primary" v-if="!selected.includes(props.row.id)" />
                    <b-button @click="detach(props.row)" icon-right="delete-bin-line" type="primary" v-else />
                  </b-table-column>
                </template>
              </search-table>
            </div>
          </div>
        </b-modal>
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
        showCategoryBrowser: false,
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

        this.$buefy.toast.open({
          message: this.$t('Associations updated'),
          type: 'is-success'
        })
      }
    }
  }
</script>
