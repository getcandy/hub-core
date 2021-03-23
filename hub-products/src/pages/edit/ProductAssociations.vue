<template>
  <div v-if="product">
    <!-- Here we want to loop through any sections that have been hooked into -->
    <div class="flex pl-4 text-gray-600 bg-gray-200">
      <button
        v-for="(item, tabIndex) in tabs"
        :key="tabIndex"
        :class="activeTab == tabIndex ? 'bg-white text-gray-600' : 'hover:bg-gray-300'"
        class="px-6 py-4 text-sm border-none outline-none focus:border-none focus:outline-none "
        @click="activeTab = tabIndex"
      >
        {{ item.title }}
      </button>
    </div>
    <component :is="tab" :product="product" @changed="handleChanged" />
  </div>
</template>

<script>
import HubPage from '@getcandy/hub-core/src/mixins/HubPage'
import HasDrafts from '@getcandy/hub-core/src/mixins/HasDrafts.js'
import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'
import ProductAssociation from '../../components/ProductAssociation'

export default {
  layout: 'product',
  mixins: [
    HubPage,
    HasDrafts,
    NormalizesObjects
  ],
  data () {
    return {
      product: null,
      activeTab: 0,
      tabs: [{
        title: 'Products',
        component: ProductAssociation
      }]
    }
  },
  computed: {
    tab () {
      return this.tabs[this.activeTab].component
    }
  },
  mounted () {
    this.product = this.normalize(this.$store.state.product.model)
    this.$nextTick(async () => {
      await this.$nuxt.context.app.$hooks.callHook('products.associations.tabs', this.tabs)
    })
  },
  methods: {
    async handleChanged (callback) {
      await this.createDraft('product', this.product.id, {
        afterRedirect: (draft) => {
          this.product.id = draft.id
        }
      }, this.$getcandy)
      if (callback) {
        callback()
      }
    }
  }
}
</script>
