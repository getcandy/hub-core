<template>
  <div>
    <quick-view-panel heading="Search categories" :open="show" @close="$emit('close')" width="w-2/3">
      <search-table
        :limit="15"
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
          <nuxt-link :to="{
            name: 'categories.edit.details',
            params: {
              id: row.id
            }
          }">
            <thumbnail-loader width="30px" :asset="row.assets.data[0]"></thumbnail-loader>
          </nuxt-link>
        </template>
        <template v-slot:name="{ row }">
          <nuxt-link :to="{
            name: 'categories.edit.details',
            params: {
              id: row.id
            }
          }">
            {{ attribute(row.attribute_data, 'name') }}
          </nuxt-link>
        </template>
        <template v-slot:actions="{ row }">
          <gc-button @click="select(row)" theme="green" v-if="!selected.includes(row.id)">Attach</gc-button>
        </template>
      </search-table>
    </quick-view-panel>
    <!-- <b-modal :active="show"
          has-modal-card
          trap-focus
          aria-role="dialog"
          @close="$emit('close')"
          aria-modal
        >
          <div class="card">
            <div class="card-content">
              <search-table :limit="10" includes="assets.transforms" :search-placeholder="$t('Search categories')" type="category" >
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
                    <b-button @click="select(props.row)" type="primary" icon-right="add-line" v-if="!selected.includes(props.row.id)" />
                  </b-table-column>
                </template>
              </search-table>
            </div>
          </div>
        </b-modal> -->
  </div>
</template>

<script>
  const truncate = require('lodash/truncate')
  import { HasAttributes } from '@getcandy/hub-core/src/mixins/Index.js'
import QuickViewPanel from './QuickViewPanel.vue'

  export default {
  components: { QuickViewPanel },
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
