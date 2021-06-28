<template>
  <div v-if="discount" class="p-6">
    <!-- <p>{{ $t('Define the conditions that should be met for this discount to be applied.') }}</p>
    <hr> -->
    <!-- COME BACK TO THIS!
    {{ discount.sets.data }} -->
    <div v-for="(set, setIndex) in discount.sets.data" :key="setIndex" class="mb-4 bg-white shadow-sm">
      <div class="p-4 text-sm bg-gray-100 border" :class="{
        'rounded-t': set.items.data.length,
        'rounded': !set.items.data.length,
      }">
        <div class="flex justify-between">
          <div class="flex items-center">
            <span class="mr-2">If</span>
            <gc-select v-model="set.scope" class="text-sm" @change="syncModel">
              <option value="all">All</option>
              <option value="any">Any</option>
            </gc-select>
            <span class="mx-2">of these conditions are</span>
            <gc-select v-model="set.outcome" @change="syncModel">
              <option :value="1">True</option>
              <option :value="0">False</option>
            </gc-select>
          </div>
          <div>
            <gc-drop-down :label="$t('Add Condition')">
              <gc-drop-down-item @click="addCondition('coupon', set.items.data)">Coupon</gc-drop-down-item>
              <gc-drop-down-item @click="addCondition('users', set.items.data)">User in list</gc-drop-down-item>
              <gc-drop-down-item @click="addCondition('product', set.items.data)">Product in list</gc-drop-down-item>
            </gc-drop-down>
            <gc-button theme="danger" @click="removeSet(setIndex)">Remove Set</gc-button>
          </div>
        </div>
      </div>
      <div class="border border-t-0 rounded-b">
        <div v-for="(item, itemKey) in set.items.data" :key="itemKey">
          <header class="px-6 py-4 text-xs font-bold text-gray-600 uppercase bg-gray-200">
            <template v-if="set.items.data.length != itemKey && itemKey != 0">
              {{ set.scope == 'all' ? 'And' : 'Or' }}
            </template>
            <span v-if="item.type == 'coupon'">When the coupon equals</span>
            <span v-if="item.type == 'users'">When the authenticated user is in the list</span>
          </header>
          <div class="flex">
            <div class="w-full">
              <div class="py-4 pl-6"  v-if="item.type == 'coupon'">
                <gc-input v-model="item.value" @blur="syncModel" />
              </div>
              <template v-if="item.type == 'product'">
                <div class="flex items-center justify-between p-4">
                  <gc-form-field label="Quantity" instructions="The quantity amount of the product required">
                    <gc-input v-model="item.value" @blur="syncModel" />
                  </gc-form-field>
                  <gc-button @click="showProductBrowser = true">Add Product</gc-button>
                </div>
                <quick-view-panel heading="Search products" :open="showProductBrowser" width="w-2/3" @close="showProductBrowser = false">
                  <search-table
                    :limit="10"
                    includes="assets.transforms,variants"
                    :update-query-string="false"
                    :search-placeholder="$t('Search products')"
                    type="products"
                    :columns="[
                      {label: '', field: 'thumbnail'},
                      {label: $t('Name'), field: 'name'},
                      {label: $t('SKU'), field: 'sku'},
                      {label: null, field: 'actions'},
                    ]"
                  >
                    <template v-slot:thumbnail="{ row }">
                      <nuxt-link
                        :to="{
                          name: 'products.view',
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
                          name: 'products.view',
                          params: {
                            id: row.id
                          }
                        }"
                      >
                        {{ attribute(row.attribute_data, 'name') }}
                      </nuxt-link>
                    </template>
                    <template v-slot:sku="{ row }">
                      {{ getSkus(row).join(', ') }}
                    </template>
                    <template v-slot:actions="{ row }">
                      <gc-button v-if="!productIsInSet(item.products.data, row)" @click="attachProduct(item, row)">
                        {{ $t('Attach') }}
                      </gc-button>
                      <!-- <template v-if="row.id != product.id"> -->
                        <!-- <gc-button v-if="!selected.includes(row.id)" theme="green" @click="attach(row)">
                          Attach
                        </gc-button>
                        <gc-button v-else theme="danger" @click="detach(row)">
                          Detach
                        </gc-button> -->
                      <!-- </template> -->
                    </template>
                  </search-table>
                </quick-view-panel>
                <gc-table
                  :data="item.products.data"
                  :columns="[
                    {label: 'Name', field: 'name'},
                    {label: 'SKU', field: 'sku'},
                    {label: '', field: 'actions'},
                  ]"
                >
                  <template v-slot:name="{ row }">
                    {{ attribute(row.attribute_data, 'name') }}
                  </template>
                  <template v-slot:sku="{ row }">
                    {{ getSkus(row).join(', ') }}
                  </template>
                  <template v-slot:actions="{ index }">
                    <gc-button theme="danger" size="x-small" @click="removeProduct(index, item.products.data)">Remove</gc-button>
                  </template>
                </gc-table>
              </template>
              <template v-if="item.type == 'users'">
                <div class="px-6 py-4">
                  <gc-user-search @click="(e) => addUser(e, item.users.data)" />
                </div>
                <gc-table
                  :data="item.users.data"
                  :columns="[
                    {label: 'Email', field: 'email'},
                    {label: '', field: 'actions'},
                  ]"
                >
                  <template v-slot:email="{ row }">
                    {{ row.email }}
                  </template>
                  <template v-slot:actions="{ index }">
                    <gc-button theme="danger" size="x-small" @click="removeUser(index, item.users.data)">Remove</gc-button>
                  </template>
                </gc-table>
              </template>
            </div>
            <div class="px-6 py-4 border-l">
              <gc-button theme="danger" @click="removeSetItem(itemKey, set.items.data)">{{ $t('Remove')}}</gc-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 text-center">
      <gc-button @click="addSet">Add Set</gc-button>
    </div>
  </div>
</template>

<script>
  const find = require('lodash/find')
  const get = require('lodash/get')
  const map = require('lodash/map')
  const each = require('lodash/each')
  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'
  import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'

  export default {
    layout: 'discount',
    mixins: [
      NormalizesObjects,
      HasAttributes
    ],
    data() {
      return {
        discount: null,
        userSearchTerm: null,
        showProductBrowser: false
      }
    },
    mounted() {
      this.discount = this.normalize(this.discountModel)
    },
    methods: {
      attachProduct (item, product) {
        item.products.data.push(product)
        this.syncModel()
      },
      removeProduct (index, items) {
        items.splice(index, 1)
        this.syncModel()
      },
      productIsInSet (products, product) {
        return !!find(products, p => p.id === product.id)
      },
      getSkus(product) {
        const variants = get(product, 'variants.data', [])
        return map(variants, v => {
          return v.sku
        })
      },
      addUser (user, users) {
        const existing = find(users, u => u.id == user.id)
        if (!existing) {
          users.push(user)
          this.syncModel()
        }
      },
      syncModel () {
        this.$store.dispatch('discounts/setModel', this.normalize(this.discount))
      },
      addCondition (type, items) {
        items.push({
          type,
          value: null,
          users: {
            data: []
          }
        })
        this.syncModel()
      },
      addSet () {
        this.discount.sets.data.push({
          scope: 'all',
          outcome: 1,
          items: {
            data: [],
          }
        })
        this.syncModel()
      },
      removeUser (index, users) {
        users.splice(index, 1)
        this.syncModel()
      },
      removeSet (index) {
        this.discount.sets.data.splice(index, 1)
        this.syncModel()
      },
      removeSetItem (index, items) {
        items.splice(index, 1)
        this.syncModel()
      }
    },
    computed: {
      discountModel () {
        return this.$store.state.discounts.model
      }
    }
  }
</script>

<style scoped>

</style>
