<template>
  <div>
    <div class="search-table">
      <div class="b-table">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th></th>
              <th>{{ $t('Option Name') }}</th>
              <th>{{ $t('Option Values') }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-sortable="sortableOptions">
            <tr v-for="(row, rowIndex) in data.settings" :key="rowIndex">
              <td class="handle">
                <svg width="13px" viewBox="0 0 13 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Artboard" fill="#D8D8D8">
                        <rect id="Rectangle" x="2" y="2" width="3" height="3"></rect>
                        <rect id="Rectangle-Copy-2" x="2" y="8" width="3" height="3"></rect>
                        <rect id="Rectangle-Copy-4" x="2" y="14" width="3" height="3"></rect>
                        <rect id="Rectangle-Copy-5" x="8" y="14" width="3" height="3"></rect>
                        <rect id="Rectangle-Copy" x="8" y="2" width="3" height="3"></rect>
                        <rect id="Rectangle-Copy-3" x="8" y="8" width="3" height="3"></rect>
                    </g>
                  </g>
                </svg>
              </td>
              <td>
                <gc-input v-model="row['option_name']" />
              </td>
              <td>
                <b-taginput
                  @input="() => {
                    row.option_label = row.option_values.join(' ')
                    generateVariants()
                  }"
                  ellipsis
                  v-model="row['option_values']"
                  icon="label"
                  placeholder="Add a tag">
                </b-taginput>
              </td>
              <td>
                <gc-button theme="gray" @click="removeRow(rowIndex)">
                  <gc-icon icon="x" size="sm"/>
                </gc-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button @click="addRow" class="bg-blue-100 w-full p-2 text-xs focus:outline-none font-bold uppercase text-blue-600 hover:bg-blue-200">{{ $t('Add Option') }}</button>
    <div class="search-table">
      <div class="b-table">
        <table class="table is-fullwidth" v-if="data.settings.length">
          <thead>
            <tr>
              <th>{{ $t('Variants') }}</th>
              <th>{{ $t('Price') }}</th>
              <th>{{ $t('Inventory') }}</th>
              <th>{{ $t('SKU') }}</th>
              <th>{{ $t('Hide') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in variants" :key="rowIndex">
              <td><b-tag v-for="attr in row.attrs.split('|')" :key="attr">{{ attr }}</b-tag>&nbsp;</td>
              <td><gc-input v-model="row.price" /></td>
              <td><gc-input v-model="row.inventory" /></td>
              <td><gc-input v-model="row.sku" /></td>
              <td><gc-toggle v-model="row.hide"></gc-toggle></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="text-center">
      <gc-button @click="prepareAndSave" :disabled="!data.settings.length">Save Options</gc-button>
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
      },
      locales: {
        type: Array,
        default: () => ['en']
      },
      currentLocale: {
        type: String,
        default: 'en'
      }
    },
    data() {
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
          option_values: [],
        }
      }
    },
    computed: {
      hasData() {
        return this.data && this.data.settings.length;
      },
      variants() {
        return filter(this.data, (v, k) => k != 'settings')
      },
      locale() {
        return this.$store.state.core.locale
      },
      preparedVariants() {
        return map(this.variants, (v) => {
          const options = v.attrs.split('|')

          let label = options.join(' ')

          let vOptions = {};

          each(options, o => {
            const option = find(this.data.settings, setting => {
              return setting.option_values.includes(o)
            })
            vOptions[kebabCase(option.option_name)] = {
              [this.locale] : o
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
      preparedOptions() {
        return map(this.data.settings, (option, index) => {
          return {
            position: index + 1,
            label: {
              [this.currentLocale] : option.option_name
            },
            options: map(option.option_values, (value, index) => {
              return {
                position: index + 1,
                values: {
                  [this.currentLocale] : value
                }
              }
            })
          }
        })
      }
    },
    mounted() {

      // Here we go...
      // TODO: This needs to be translatable??
      const optionData = map(this.product.option_data, option => {
        const firstLabel = Object.keys(option.label)[0]
        return {
          option_name: get(option.label, this.locale, option.label[firstLabel]),
          option_values: map(option.options, (value, handle) => {
            const firstValue = Object.keys(value.values)[0]
            return get(value.values, this.locale, value.values[firstValue])
          })
        }
      })

      const variants = map(this.product.variants.data, variant => {
        let options = [];
        each(variant.options, option => {
          options.push(
            get(option, this.locale, option['en'])
          )
        })
        return {
          id: variant.id,
          price: variant.price,
          attrs: options.join('|'),
          inventory: variant.inventory,
          sku: variant.sku,
          hide: false,
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
        this.data.settings.splice(index, 1);
        this.generateVariants()
      },
      prepareAndSave () {
        const options =  this.preparedOptions
        const variants = this.preparedVariants
        this.$emit('save', {options, variants})
      },
      generateVariants() {
        const val = JSON.parse(JSON.stringify(this.data))

        if (val.settings && val.settings.length) {
          const settings = val.settings
          let variations = first(settings).option_values

          for (let i = 1; i < settings.length; i++) {
            const attrs = settings[i].option_values
            const newVariations = []

            for (let k = 0; k < attrs.length; k++) {
              variations.forEach(element => {
                newVariations.push(element + '|' + attrs[k])
              });
            }
            variations = newVariations
          } // End i = 1

          const items = map(variations, v => {
            return {
              id: String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now(), // Taken from plugin, change this...
              attrs: v,
              price: null,
              inventory: 1,
              sku: null,
              hide: false,
            }
          })

          const finalItems = map(items, item => {
            let exists = false

            map(val, (v, key) => {
              if (key != 'settings') {
                const attrsI = item.attrs.split('|')
                const attrsV = v.attrs.split('|')

                const arrContainsArr = attrsV.every(value => {
                  return (attrsI.indexOf(value) >= 0)
                })

                if (arrContainsArr && attrsI.length == attrsV.length) {
                  v.attrs = item.attrs
                  exists = v
                }
              }
            })

            if (exists) {
              return exists;
            }
            return item
          })

          finalItems.settings = val.settings
          this.data = assignIn({}, finalItems)

        } else { // End val.settings && val.settings.length
          this.data = {
            settings: [],
          }
        }
      },
      addRow() {
        const blank = clone(this.blank)

        this.data.settings.push(blank);
      }
    },
  }
</script>

<style scoped>

</style>
