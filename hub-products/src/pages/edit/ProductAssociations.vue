<template>
  <div v-if="product">
    <!-- Here we want to loop through any sections that have been hooked into -->
    <gc-tabs secondary>
      <gc-tab-item v-for="(tab, tabIndex) in tabs" :key="tabIndex" :label="tab.title">
        <component :is="tab.component" :product="product" @changed="handleChanged" />
      </gc-tab-item>
      <!-- <button  class="tab-active">{{ tab.title }}</button> -->
    </gc-tabs>
    <!-- <b-tabs :animated="false" class="secondary-tabs" horizontal position="tabs is-toggle is-left" v-model="activeTab">
      <b-tab-item :label="tab.title" v-for="(tab, tabIndex) in tabs" :key="tabIndex">
        <component :is="tab.component" :product="product" @changed="handleChanged" />
      </b-tab-item>
    </b-tabs> -->
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
      this.$nuxt.context.app.$hooks.callHook('products.associations.tabs', this.tabs);
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
