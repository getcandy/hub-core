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
            type="products"
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
              <template v-if="row.id != product.id">
                <gc-button @click="attach(row)" theme="green" v-if="!selected.includes(row.id)">Attach</gc-button>
                <gc-button @click="detach(row)" theme="danger" v-else >Detach</gc-button>
              </template>
            </template>
          </search-table>
        </quick-view-panel>
    </div>
    <div class="py-24 mx-auto text-center" v-if="!associations.length">
      <h1 class="mt-6 mb-4 text-xl">No product associations exist</h1>
      <p class="mb-4 text-sm text-gray-600">Associating products together will help show your customers which products belong to each other</p>

      <gc-button @click="showBrowser = true">{{ $t('Create association') }}</gc-button>
    </div>
    <div class="search-table">
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
            <tr v-for="(association, rowIndex) in associations" :key="rowIndex">
              <td><thumbnail-loader width="50px" :asset="association.thumbnail" /></td>
              <td>{{ attribute(association.attribute_data, 'name') }}</td>
              <td>
                <gc-select placeholder="Select a type" v-model="association.type" @change="updateAssociationType">
                    <option
                        v-for="option in groups"
                        :value="option.id"
                        :selected="option.id == association.type"
                        :key="option.id">
                        {{ option.name }}
                    </option>
                </gc-select>
              </td>
              <td>
                <gc-button @click="detach(association.id)" theme="danger">
                  {{ $t('Remove') }}
                </gc-button>
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
  const get = require('lodash/get')
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
          this.selected.push(item.id)
        })
      })

      this.associations = map(get(this.product, 'associations.data', []), item => {
        return {
          id: item.association.data.id,
          thumbnail: item.association.data.assets.data[0],
          attribute_data: item.association.data.attribute_data,
          type: item.group.data.id
        }
      });

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
        associations: [],
        selected: [],
        groups: [],
      }
    },
    methods: {
      /**
       * Detach a product from the associations
       */
      detach(productId) {
        this.selected.splice(this.selected.indexOf(productId), 1);
        const toRemove = findIndex(this.associations, item => {
          return item.id == productId
        })
        this.associations.splice(toRemove, 1)

        this.$emit('changed', () => {
          this.save()
        })
      },
      updateAssociationType(typeId, type) {
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
          id: product.id,
          thumbnail: product.assets.data[0],
          attribute_data: product.attribute_data,
          type: group.id
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
            'association_id': item.id,
            'type' : item.type
          }
        });

        await this.$gc.products.updateProductAssociations(this.product.id, relations)
        this.$notify.queue('success', this.$t('Associations updated'))
      }
    }
  }
</script>
