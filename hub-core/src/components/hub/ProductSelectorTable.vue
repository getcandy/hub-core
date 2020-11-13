<template>
  <div>
    <div class="tab-content-tools">
        <b-modal :active="show"
          has-modal-card
          trap-focus
          aria-role="dialog"
          @close="$emit('close')"
          aria-modal
        >
          <div class="card">
            <div class="card-content">
              <search-table :limit="10" includes="assets.transforms" :search-placeholder="$t('Search products')" type="product" >
                <template slot-scope="props">
                  <b-table-column field="thumbnail">
                    <thumbnail-loader width="25px" :asset="props.row.assets.data[0]" />
                  </b-table-column>
                  <b-table-column field="name" :label="$t('Name')">
                    <nuxt-link :to="{
                      name: 'products.view',
                      params: {
                          id: props.row.id
                      }
                    }">
                    {{ attribute(props.row.attribute_data, 'name') }}
                    </nuxt-link>
                  </b-table-column>
                  <b-table-column field="actions">
                    <b-button @click="select(props.row)" type="primary" icon-right="add-box-line" v-if="!selected.includes(props.row.id)" />
                  </b-table-column>
                </template>
              </search-table>
            </div>
          </div>
        </b-modal>
    </div>
  </div>
</template>

<script>
  const truncate = require('lodash/truncate')
  import { HasAttributes } from '@getcandy/hub-core/src/mixins/Index.js'

  export default {
    props: {
      selected: {
        type: Array,
        default: () => []
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    mixins: [
      HasAttributes
    ],
    methods: {
      select (row) {
        this.$emit('selected', row)
      }
    }
  }
</script>
