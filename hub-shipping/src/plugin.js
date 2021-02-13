import ShippingMethodsIndex from './shipping/pages/methods/ShippingMethodsIndex.vue'
import ShippingMethodDetails from './shipping/pages/methods/edit/ShippingMethodDetails.vue'
import ShippingMethodPricing from './shipping/pages/methods/edit/ShippingMethodPricing.vue'
import ShippingMethodAvailability from './shipping/pages/methods/edit/ShippingMethodAvailability.vue'
import ShippingZonesIndex from './shipping/pages/zones/ShippingZonesIndex.vue'
import ShippingZoneCountries from './shipping/pages/zones/edit/ShippingZoneCountries.vue'
import ShippingZonesDetails from './shipping/pages/zones/edit/ShippingZonesDetails.vue'
import { state, mutations, actions } from './shipping/store/shippingMethods.js';
import ShippingZoneState from './shipping/store/shippingZones.js';

export default ({ app }, inject) => {

  app.router.addRoutes([
    {
      path: '/order-processing/shipping-methods',
      name: 'shipping-methods',
      component: ShippingMethodsIndex,
      meta: {
        permissions: ['manage_shipping']
      }
    },
    {
        path: '/order-processing/shipping-methods/:id',
        name: 'shipping-methods.edit.details',
        component: ShippingMethodDetails,
        meta: {
          permissions: ['manage_shipping']
        }
    },
    {
        path: '/order-processing/shipping-methods/:id/pricing',
        name: 'shipping-methods.edit.pricing',
        component: ShippingMethodPricing,
        meta: {
          permissions: ['manage_shipping']
        }
    },
    {
        path: '/order-processing/shipping-methods/:id/availability',
        name: 'shipping-methods.edit.availability',
        component: ShippingMethodAvailability,
        meta: {
          permissions: ['manage_shipping']
        }
    },
    {
        path: '/order-processing/shipping-zones',
        name: 'shipping-zones',
        component: ShippingZonesIndex,
        meta: {
          permissions: ['manage_shipping']
        }
    },
    {
        path: '/order-processing/shipping-zones/:id',
        name: 'shipping-zones.edit.details',
        component: ShippingZonesDetails,
        meta: {
          permissions: ['manage_shipping']
        }
    },
    {
      path: '/order-processing/shipping-zones/:id/countries',
      name: 'shipping-zones.edit.countries',
      component: ShippingZoneCountries,
      meta: {
        permissions: ['manage_shipping']
      }
    }
  ])

  // Add our store module
  app.store.registerModule('shippingMethods', {
    namespaced: true,
    state,
    mutations,
    actions
  })

  app.store.registerModule('shippingZones', ShippingZoneState)

  app.store.commit('addSection', {
    title: 'Order Processing',
    handle: 'order-processing',
    icon: 'shopping-basket-line',
    items: [
      {
        title: 'Shipping Methods',
        route: {
            name: 'shipping-methods'
        }
      },
      {
        title: 'Shipping Zones',
        route: {
            name: 'shipping-zones'
        }
      }
    ]
  })
  // TODO: Try and do this more effeciently
//   app.router.addRoutes([
//     {
//       path: '/catalogue-manager/categories',
//       name: 'categories',
//       component: CategoryIndex,
//       meta: {
//         permissions: ['manage_catalogue']
//       }
//     },
//     {
//         path: '/catalogue-manager/categories/:id',
//         name: 'categories.edit.details',
//         component: CategoryDetails,
//         meta: {
//           permissions: ['manage_catalogue']
//         }
//     },
//     {
//       path: '/catalogue-manager/categories/:id/media',
//       name: 'categories.edit.media',
//       component: CategoryMedia,
//     },
//     {
//         path: '/catalogue-manager/categories/:id/availability',
//         name: 'categories.edit.availability',
//         component: CategoryAvailability,
//     },
//     {
//         path: '/catalogue-manager/categories/:id/associations',
//         name: 'categories.edit.associations',
//         component: CategoryAssociationsPage,
//     },
//     {
//         path: '/catalogue-manager/categories/:id/display',
//         name: 'categories.edit.display',
//         component: CategoryDisplay,
//     },
//     {
//         path: '/catalogue-manager/categories/:id/routes',
//         name: 'categories.edit.routes',
//         component: CategoryRoutes,
//     }
//   ])

  // Add our store module
//   app.store.registerModule('categories', {
//     namespaced: true,
//     state,
//     mutations
//   })

//   app.store.commit('addSection', {
//     title: 'Catalogue Manager',
//     handle: 'catalogue-manager',
//     items: [
//       {
//         icon: 'mdi-tshirt-crew',
//         title: 'Categories',
//         route: {
//           name: 'categories'
//         }
//       }
//     ]
//   })


//   app.$hooks.hook('products.associations.tabs', (items) => {
//     items.push({
//         title: 'Categories',
//         component: CategoryAssociations
//     })
//   })

  // app.$hooks.hook('tree-test', async (items) => {
  //   items.push('four');
  // })

}
