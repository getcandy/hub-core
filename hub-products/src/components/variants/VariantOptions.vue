<template>
  <div>
    <div class="search-table">
      <div class="b-table">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th />
              <th>{{ $t('Option Name') }}</th>
              <th>{{ $t('Option Values') }}</th>
              <th />
            </tr>
          </thead>
          <tbody v-sortable="sortableOptions">
            <tr v-for="(row, rowIndex) in data.settings" :key="rowIndex">
              <td class="handle">
                <svg width="13px" viewBox="0 0 13 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Artboard" fill="#D8D8D8">
                      <rect id="Rectangle" x="2" y="2" width="3" height="3" />
                      <rect id="Rectangle-Copy-2" x="2" y="8" width="3" height="3" />
                      <rect id="Rectangle-Copy-4" x="2" y="14" width="3" height="3" />
                      <rect id="Rectangle-Copy-5" x="8" y="14" width="3" height="3" />
                      <rect id="Rectangle-Copy" x="8" y="2" width="3" height="3" />
                      <rect id="Rectangle-Copy-3" x="8" y="8" width="3" height="3" />
                    </g>
                  </g>
                </svg>
              </td>
              <td>
                <gc-input v-model="row['option_name']" />
              </td>
              <td>
                <b-taginput
                  v-model="row['option_values']"
                  ellipsis
                  icon="label"
                  placeholder="Add a tag"
                  @input="() => {
                    row.option_label = row.option_values.join(' ')
                    generateVariants()
                  }"
                />
              </td>
              <td>
                <gc-button theme="gray" @click="removeRow(rowIndex)">
                  <gc-icon icon="x" size="sm" />
                </gc-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button class="w-full p-2 text-xs font-bold text-blue-600 uppercase bg-blue-100 focus:outline-none hover:bg-blue-200" @click="addRow">
      {{ $t('Add Option') }}
    </button>
    <gc-table
      :data="variants"
      :columns="[
        {label: 'Variants', field: 'variants'},
        {label: 'Price', field: 'price'},
        {label: 'Inventory', field: 'inventory'},
        {label: 'SKU', field: 'sku'},
      ]"
    >
      <template v-slot:variants="{ row }">
        <b-tag v-for="attr in row.attrs.split('|')" :key="attr">
          {{ attr }}
        </b-tag>&nbsp;
      </template>
      <template v-slot:price="{ row }">
        <gc-price-input v-model="row.price" :is-cents="false" />
      </template>
      <template v-slot:inventory="{ row }">
        <gc-input v-model="row.inventory" type="number" />
      </template>
      <template v-slot:sku="{ row }">
        <gc-sku-input v-model="row.sku" />
      </template>
    </gc-table>

    <div class="text-center">
      <gc-button :disabled="!data.settings.length" @click="prepareAndSave">
        Save Options
      </gc-button>
    </div>
  </div>
</template>

<script>
const clone = require('lodash/clone')
const first = require('lodash/first')
const map = require('lodash/map')
const assignIn = require('lodash/assignIn')
const filter = require('lodash/filter')
const each = require('lodash/each')
const get = require('lodash/get')
const kebabCase = require('lodash/kebabCase')
const find = require('lodash/find')

export default {
  props: {
    product: {
      type: Object,
      required: true
    },
    locales: {
      type: Array,
      default: () => ['en']
    },
    initialPrice: {
      type: [String, Number],
      default: 0
    },
    currentLocale: {
      type: String,
      default: 'en'
    },
    errors: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      data: {
        settings: []
      },
      sortableOptions: {
        onEnd: this.generateVariants,
        filter: '.disabled',
        handle: '.handle',
        animation: 150
      },
      blank: {
        option_label: '',
        option_values: []
      }
    }
  },
  computed: {
    hasData () {
      return this.data && this.data.settings.length
    },
    variants () {
      // eslint-disable-next-line
      return filter(this.data, (v, k) => k != 'settings')
    },
    locale () {
      return this.$store.state.core.locale
    },
    preparedVariants () {
      return map(this.variants, (v) => {
        const options = v.attrs.split('|')

        const label = options.join(' ')

        const vOptions = {}

        each(options, (o) => {
          const option = find(this.data.settings, (setting) => {
            return setting.option_values.includes(o)
          })
          vOptions[kebabCase(option.option_name)] = {
            [this.locale]: o
          }
        })

        return {
          label,
          price: v.price,
          sku: v.sku,
          options: vOptions,
          inventory: v.inventory
        }
      })
    },
    preparedOptions () {
      return map(this.data.settings, (option, index) => {
        return {
          position: index + 1,
          label: {
            [this.currentLocale]: option.option_name
          },
          options: map(option.option_values, (value, index) => {
            return {
              position: index + 1,
              values: {
                [this.currentLocale]: value
              }
            }
          })
        }
      })
    }
  },
  mounted () {
    // Here we go...
    // TODO: This needs to be translatable??
    const optionData = map(this.product.option_data, (option) => {
      const firstLabel = Object.keys(option.label)[0]
      return {
        option_name: get(option.label, this.locale, option.label[firstLabel]),
        option_values: map(option.options, (value) => {
          const firstValue = Object.keys(value.values)[0]
          return get(value.values, this.locale, value.values[firstValue])
        })
      }
    })

    const variants = map(this.product.variants.data, (variant) => {
      const options = []
      each(variant.options, (option) => {
        options.push(
          get(option, this.locale, option.en)
        )
      })
      return {
        id: variant.id,
        price: variant.price,
        attrs: options.join('|'),
        inventory: variant.inventory,
        sku: variant.sku,
        hide: false
      }
    })

    this.data = {
      ...variants,
      settings: optionData
    }

    this.generateVariants()
  },

  methods: {
    removeRow (index) {
      this.data.settings.splice(index, 1)
      this.generateVariants()
    },
    prepareAndSave () {
      const options = this.preparedOptions
      const variants = this.preparedVariants
      this.$emit('save', {
        options,
        variants,
        callback: () => {
          this.data = {
            settings: []
          }
        }
      })
    },
    generateVariants () {
      const val = JSON.parse(JSON.stringify(this.data))

      if (val.settings && val.settings.length) {
        const settings = val.settings
        let variations = first(settings).option_values

        for (let i = 1; i < settings.length; i++) {
          const attrs = settings[i].option_values
          const newVariations = []

          for (let k = 0; k < attrs.length; k++) {
            variations.forEach((element) => {
              newVariations.push(element + '|' + attrs[k])
            })
          }
          variations = newVariations
        } // End i = 1

        const items = map(variations, (v) => {
          return {
            id: String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now(), // Taken from plugin, change this...
            attrs: v,
            price: this.initialPrice,
            inventory: 1,
            sku: null,
            hide: false
          }
        })

        const finalItems = map(items, (item) => {
          let exists = false

          map(val, (v, key) => {
            if (key !== 'settings') {
              const attrsI = item.attrs.split('|')
              const attrsV = v.attrs.split('|')

              const arrContainsArr = attrsV.every((value) => {
                return (attrsI.includes(value))
              })

              if (arrContainsArr && attrsI.length === attrsV.length) {
                v.attrs = item.attrs
                exists = v
              }
            }
          })

          if (exists) {
            return exists
          }
          return item
        })

        finalItems.settings = val.settings
        this.data = assignIn({}, finalItems)
      } else { // End val.settings && val.settings.length
        this.data = {
          settings: []
        }
      }
    },
    addRow () {
      const blank = clone(this.blank)

      this.data.settings.push(blank)
    }
  }
}
</script>

<style scoped>

</style>
