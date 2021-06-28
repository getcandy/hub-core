<template>
  <default-layout>
    <loading-spinner v-if="loading" />
    <div v-else>
      <toolbar :heading="$t('Discounts')" :subHeading="title" >
        <div>
          <button @click="save" class="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-green-600 transition duration-150 ease-in-out bg-white border border-green-300 rounded-md shadow-sm hover:text-green-500 focus:outline-none focus:border-blue-300 focus:shadow-outline sm:text-sm sm:leading-5">
            {{ $t('Save changes') }}
          </button>
        </div>
      </toolbar>
      <div class="card">
        <div class="tabs tabs-large tabs-large--flush">
          <ul>
            <nuxt-link
              :to="{
                name: 'discounts.edit.details',
              }"
              tag="li"
              exact-active-class="is-active"
            >
              <a>{{ $t('Discount Details') }}</a>
            </nuxt-link>
            <nuxt-link
              :to="{
                name: 'discounts.edit.sets',
              }"
              tag="li"
              exact-active-class="is-active"
            >
              <a>{{ $t('Conditions') }}</a>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'discounts.edit.rewards',
              }"
              tag="li"
              exact-active-class="is-active"
            >
              <a>{{ $t('Rewards') }}</a>
            </nuxt-link>
            <nuxt-link
              :to="{
                name: 'discounts.edit.availability',
              }"
              tag="li"
              exact-active-class="is-active"
            >
              <a>{{ $t('Availability') }}</a>
            </nuxt-link>
          </ul>
        </div>
      </div>
      <nuxt />
    </div>
  </default-layout>
</template>

<script>
const map = require('lodash/map')
const get = require('lodash/get')
import DefaultLayout from '@getcandy/hub-core/src/layouts/Default.vue'
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'

export default {
  components: {
    DefaultLayout
  },
  mixins: [
    HasAttributes
  ],
  head() {
    return {
      title: this.title
    };
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    discount () {
      return this.$store.state.discounts.model
    },
    title () {
      return this.discount ? this.attribute(this.discount.attribute_data, 'name') : null
    },
    updatePayload () {
      return {
        attribute_data: this.discount.attribute_data,
        start_at: this.discount.start_at,
        end_at: this.discount.end_at,
        status: this.discount.status,
        stop_rules: this.discount.stop_rules,
        priority: this.discount.priority,
        channels: map(this.discount.channels.data, channel => {
          return {
            id: channel.id,
            published_at: channel.published_at
          }
        }),
        rewards: map(this.discount.rewards.data, reward => {
          const products = get(reward, 'products.data', [])
          return {
            type: reward.type,
            value: reward.value,
            products: map(products, product => {
              console.log(product)
              return {
                quantity: product.quantity,
                product_id: get(product, 'product.data.id', null)
              }
            })
          }
        }),
        sets: map(this.discount.sets.data, set => {
          return {
            scope: set.scope,
            outcome: set.outcome,
            id: set.id,
            items: map(set.items.data, item => {
              let eligibles = []
              if (item.type == 'users') {
                eligibles = map(item.users.data, user => {
                  return user.id
                })
              }
              if (item.type == 'product') {
                eligibles = map(item.products.data, product => {
                  return product.id
                })
              }
              return {
                id: item.id,
                type: item.type,
                value: item.value,
                eligibles
              }
            })
          }
        })
      }
    }
  },
  methods: {
    async save() {
      try {
        await this.$getcandy.on('discounts', 'putDiscountsDiscountId', this.discount.id, this.updatePayload)
      } catch (e) {
        this.$notify.queue('error', this.$t('There was an issue saving the discount'))
      }
      this.$notify.queue('success', this.$t('Discount updated'))
    }
  },
  async mounted () {
    if (this.discount && (this.discount.id !== this.$route.params.id)) {
      this.$store.commit('discounts/setModel', null)
    }
    if (!this.discount) {
      this.loading = true
      const response = await this.$getcandy.on('discounts', 'getDiscountsDiscountId',
        this.$route.params.id,
        'attributes.group.attributes,channels,rewards.products.product.primaryAsset,sets.items.users,sets.items.products.variants',
        {
          query: {
            full_response: true
          }
        }
      )
      this.$store.commit('discounts/setModel', response.data.data)
    }
    this.loading = false
  }
}
</script>

<style scoped>

</style>
