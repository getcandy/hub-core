/* eslint-disable */

import Vue from 'vue'

import Sortable from 'sortablejs'
import ProductAssociations from './products/pages/edit/ProductAssociations.vue'
import ProductAvailability from './products/pages/edit/ProductAvailability.vue'
import ProductDetails from './products/pages/edit/ProductDetails.vue'
import ProductFamilyAttributes from './products/pages/families/ProductFamilyAttributes.vue'
import ProductFamilyEdit from './products/pages/families/ProductFamilyEdit.vue'
import ProductFamilyIndex from './products/pages/families/ProductFamilyIndex.vue'
import ProductFamilyProducts from './products/pages/families/ProductFamilyProducts.vue'
import ProductFamilyStore from './products/store/product-family.js'
import ProductIndex from './products/pages/ProductIndex.vue'
import ProductMedia from './products/pages/edit/ProductMedia.vue'
import ProductUrls from './products/pages/edit/ProductUrls.vue'
import { state, mutations, actions } from './products/store/product.js'

export default ({ app }, inject) => {
  // eslint-disable-next-line no-alert, quotes, semi
  const options = <%= JSON.stringify(options, null, 2) %>

  // Example if you wanted a global component
  // Vue.component('productlisting', ProductListing)
  app.i18n.mergeLocaleMessage('en', require('./products/locales/en.json'))
  app.i18n.mergeLocaleMessage('fr', require('./products/locales/fr.json'))

  // TODO: Move this into a more global thingy
  Vue.directive('sortable', {
    inserted (el, binding) {
      const sortable = new Sortable(el, binding.value || {})
    }
  })
  const routes = [
    {
      path: '/catalogue-manager/products',
      name: 'products',
      component: ProductIndex,
      meta: {
        permissions: ['manage-catalogue']
      }
    },
    {
      path: '/catalogue-manager/products/:id',
      name: 'products.view',
      component: ProductDetails,
      meta: {
        permissions: ['manage-catalogue']
      }
    },
    {
      path: '/catalogue-manager/products/:id/media',
      name: 'products.edit.media',
      component: ProductMedia,
      meta: {
        permissions: ['manage-catalogue']
      }
    },
    {
      path: '/catalogue-manager/products/:id/availability-pricing',
      name: 'products.edit.availability',
      component: ProductAvailability,
      meta: {
        permissions: ['manage-catalogue']
      }
    },
    {
      path: '/catalogue-manager/products/:id/associations',
      name: 'products.edit.associations',
      component: ProductAssociations,
      meta: {
        permissions: ['manage-catalogue']
      }
    },
    {
      path: '/catalogue-manager/products/:id/urls',
      name: 'products.edit.urls',
      component: ProductUrls,
      meta: {
        permissions: ['manage-catalogue']
      }
    },
    {
      path: '/catalogue-manager/product-families/',
      name: 'product-families',
      component: ProductFamilyIndex,
      meta: {
        permissions: ['manage-catalogue']
      }
    },
    {
      path: '/catalogue-manager/product-families/:id',
      name: 'product-families.edit',
      component: ProductFamilyEdit,
      meta: {
        permissions: ['manage-catalogue']
      }
    },
    {
      path: '/catalogue-manager/product-families/:id/attributes',
      name: 'product-families.edit.attributes',
      component: ProductFamilyAttributes,
      meta: {
        permissions: ['manage-catalogue']
      }
    },
    {
      path: '/catalogue-manager/product-families/:id/products',
      name: 'product-families.edit.products',
      component: ProductFamilyProducts,
      meta: {
        permissions: ['manage-catalogue']
      }
    }
  ]

  routes.forEach(route => {
    app.router.addRoute(route)
  });

  // Add our store module
  app.store.registerModule('product', {
    namespaced: true,
    state,
    mutations,
    actions
  })

  app.store.registerModule('productFamily', ProductFamilyStore)

  app.store.commit('product/setConfig', options)

  app.store.dispatch('addNavItems', {
    section: 'catalogue-manager',
    items: [
      {
        label: 'Products',
        position: 0,
        access: ['manage-catalogue'],
        route: {
          name: 'products'
        }
      },
      {
        label: 'Product Families',
        position: 5,
        access: ['manage-catalogue'],
        route: {
          name: 'product-families'
        }
      }
    ]
  })

  // app.$hooks.hook('menu', (items) => {
  //   items.push({
  //     icon: 'mdi-tshirt-crew',
  //     title: 'Products',
  //     to: '/products'
  //   })
  // })

  // app.$hooks.hook('tree-test', async (items) => {
  //   items.push('four');
  // })
}
