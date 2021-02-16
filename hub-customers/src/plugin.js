import CustomerIndex from './customers/pages/CustomerIndex.vue'
import CustomerEdit from './customers/pages/CustomerEdit.vue'
import CustomerOrderHistory from './customers/pages/CustomerOrderHistory.vue'
import { state, mutations, actions } from './customers/store/customer.js';

export default ({ app }, inject) => {

  app.router.addRoutes([
    {
      path: '/order-processing/customers',
      name: 'customers',
      component: CustomerIndex,
      meta: {
        permissions: ['manage_customers']
      }
    },
    {
      path: '/order-processing/customers/:id',
      name: 'customers.edit',
      component: CustomerEdit,
      meta: {
        permissions: ['manage_customers']
      }
    }
  ])

  app.store.dispatch('addNavItems', {
    section: 'order-processing',
    items: [
      {
        label: 'Customers',
        position: 10,
        route: {
          name: 'customers'
        }
      }
    ]
  })


  app.store.registerModule('customer', {
    namespaced: true,
    state,
    mutations,
    actions
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
