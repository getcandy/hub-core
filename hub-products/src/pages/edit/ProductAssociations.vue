<template>
  <div v-if="product">
    <!-- Here we want to loop through any sections that have been hooked into -->
    <div class="flex pl-4 text-white bg-gray-800">
      <button
        v-for="(tab, tabIndex) in tabs"
        :key="tabIndex"
        @click="activeTab = tabIndex"
        :class="activeTab == tabIndex ? 'bg-white text-gray-800' : 'hover:bg-gray-700'"
        class="px-6 py-4 text-sm border-none outline-none focus:border-none focus:outline-none "
      >
        {{ tab.title }}
      </button>
    </div>
    <component :is="tab" :product="product" @changed="handleChanged" />
    <!-- <gc-tabs secondary>
      <gc-tab-item v-for="(tab, tabIndex) in tabs" :key="tabIndex" :label="tab.title">
        <component :is="tab.component" :product="product" @changed="handleChanged" />
      </gc-tab-item>
    </gc-tabs> -->
  </div>
</template>

<script>
  import ProductAssociation from '../../components/ProductAssociation'
  import HubPage from '@getcandy/hub-core/src/mixins/HubPage'
  import HasDrafts from '@getcandy/hub-core/src/mixins/HasDrafts.js'
  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'

  export default {
    layout: 'product',
    mixins: [
      HubPage,
      HasDrafts,
      NormalizesObjects
    ],
    data() {
      return {
        product: null,
        activeTab: 0,
        tabs: [{
          title: 'Products',
          component: ProductAssociation
        }]
      }
    },
    mounted() {
      this.product = this.normalize(this.$store.state.product.model)
      this.$nextTick(async () => {
        await this.$nuxt.context.app.$hooks.callHook('products.associations.tabs', this.tabs);
      })
    },
    computed: {
      tab () {
        return this.tabs[this.activeTab].component
      }
    },
    methods: {
      async handleChanged (callback) {
        const product = await this.createDraft('product', this.product.id, {
          afterRedirect:  async (draft) => {
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
