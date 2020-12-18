<template>
  <div>
    <div>
        <div class="px-6 py-3 text-right">
          <gc-button  @click="showBrowser = true" v-if="associations.length" theme="gray">{{ $t('Add Product') }}</gc-button>
        </div>
        <quick-view-panel heading="Search products" :open="showBrowser" @close="showBrowser = false" width="w-2/3">
          <search-table
            :limit="10"
            includes="assets.transforms"
            :search-placeholder="$t('Search products')"
            type="product"
            :columns="[
              {label: '', field: 'thumbnail'},
              {label: $t('Name'), field: 'name'},
              {label: null, field: 'actions'},
            ]"
          >
            <template v-slot:thumbnail="{ row }">
              <nuxt-link :to="{
                  name: 'products.view',
                  params: {
                      id: row.id
                  }
                }">
                <thumbnail-loader width="30px" :asset="row.assets.data[0]"></thumbnail-loader>
              </nuxt-link>
            </template>
            <template v-slot:name="{ row }">
              <nuxt-link :to="{
                name: 'products.view',
                params: {
                    id: row.id
                }
              }">
                {{ attribute(row.attribute_data, 'name') }}
              </nuxt-link>
            </template>
            <template v-slot:actions="{ row }">
              <gc-button @click="attach(row)" theme="green" v-if="!selected.includes(row.id)">Attach</gc-button>
              <gc-button @click="detach(row)" theme="danger" v-else >Detach</gc-button>
            </template>
          </search-table>
        </quick-view-panel>
    </div>
    <div class="text-center  mx-auto py-24" v-if="!associations.length">
      <h1 class="mt-6 mb-4 text-xl">No product associations exist</h1>
      <p class="mb-4 text-gray-600 text-sm">Associating products together will help show your customers which products belong to each other</p>

      <gc-button @click="showBrowser = true">{{ $t('Create association') }}</gc-button>
    </div>

    <div class="search-table" v-if="associations.length">
      <div class="b-table">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th></th>
              <th>{{ $t('Name') }}</th>
              <th>{{ $t('Type') }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in associations" :key="rowIndex">
              <td><thumbnail-loader width="50px" :asset="row.association.data.assets.data[0]" /></td>
              <td>{{ attribute(row.association.data.attribute_data, 'name') }}</td>
              <td>
                <b-select placeholder="Select a type" v-model="associations[rowIndex].group.data.id">
                    <option
                        v-for="option in groups"
                        :value="option.id"
                        :key="option.id">
                        {{ option.name }}
                    </option>
                </b-select>
              </td>
              <td>
                <b-button @click="detach(row.association.data)" type="is-danger" icon-right="delete-bin-line" />
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
  const map = require('lodash/map')
  const findIndex = require('lodash/findIndex')
  const first = require('lodash/first')
  import { NormalizesObjects, HasAttributes } from '@getcandy/hub-core/src/mixins/Index.js'

  export default {
    mixins: [
      HasAttributes,
      NormalizesObjects
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
        each(this.associations, item => {
          this.selected.push(item.association.data.id)
        })
      })

      // We need to get the association groups, this is quite specific
      // to what we're trying to do here so we can just fetch them?
      // TODO: Is this still correct?
      this.$gc.associations.groups().then(response => {
        this.groups = response.data.data
      });
    },
    data() {
      return {
        showBrowser: false,
        associations: this.product ? this.product.associations.data : [],
        selected: [],
        groups: [],
      }
    },
    methods: {
      /**
       * Detach a product from the associations
       */
      detach(product) {
        this.selected.splice(this.selected.indexOf(product.id), 1);
        const toRemove = findIndex(this.associations, item => {
          return item.association.data.id == product.id
        })
        this.associations.splice(toRemove, 1)

        this.$emit('changed', () => {
          this.save()
        })
      },
      attach(product) {
        /**
         * Add the new association into the array for the product
         */
        const group = this.normalize(first(this.groups))
        const associations = this.associations.push({
          association: {
            data: product
          },
          group: {
            data: group
          }
        })
        this.selected.push(product.id);

        this.$emit('changed', () => {
          this.save()
        })
      },
      async save () {
        // Map it out so our API can understand it.
        let relations = map(this.associations, item => {
          return {
            'association_id': item.association.data.id,
            'type' : item.group.data.id
          }
        });

        await this.$gc.products.updateProductAssociations(this.product.id, relations)
        this.$notify.queue('success', this.$t('Associations updated'))
      }
    }
  }
</script>
