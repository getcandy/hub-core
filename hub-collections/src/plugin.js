import CollectionIndex from './collections/pages/CollectionIndex.vue'
import CollectionDetails from './collections/pages/edit/CollectionDetails.vue'
import CollectionMedia from './collections/pages/edit/CollectionMedia.vue'
import CollectionAvailability from './collections/pages/edit/CollectionAvailability.vue'
import CollectionAssociations from './collections/pages/edit/CollectionAssociations.vue'
import CollectionRoutes from './collections/pages/edit/CollectionRoutes.vue'
import { state, mutations, actions } from './collections/store/collections.js';

export default ({ app }, inject) => {
  const options = <%= JSON.stringify(options, null, 2) %>

  // TODO: Try and do this more effeciently
  app.router.addRoutes([
    {
      path: '/catalogue-manager/collections',
      name: 'collections',
      component: CollectionIndex,
      meta: {
        permissions: ['manage_catalogue']
      }
    },
    {
        path: '/catalogue-manager/collections/:id',
        name: 'collections.edit.details',
        component: CollectionDetails,
        meta: {
          permissions: ['manage_catalogue']
        }
    },
    {
        path: '/catalogue-manager/collections/:id/media',
        name: 'collections.edit.media',
        component: CollectionMedia,
        meta: {
          permissions: ['manage_catalogue']
        }
    },
    {
        path: '/catalogue-manager/collections/:id/availability',
        name: 'collections.edit.availability',
        component: CollectionAvailability,
        meta: {
          permissions: ['manage_catalogue']
        }
    },
    {
        path: '/catalogue-manager/collections/:id/associations',
        name: 'collections.edit.associations',
        component: CollectionAssociations,
        meta: {
          permissions: ['manage_catalogue']
        }
    },
    {
        path: '/catalogue-manager/collections/:id/routes',
        name: 'collections.edit.routes',
        component: CollectionRoutes,
        meta: {
          permissions: ['manage_catalogue']
        }
    }
  ])

  // Add our store module
  app.store.registerModule('collections', {
    namespaced: true,
    state,
    mutations,
    actions
  })

  app.store.commit('collections/setConfig', options)

  app.store.commit('addSection', {
    title: 'Catalogue Manager',
    handle: 'catalogue-manager',
    icon: 'store-line',
    items: [
      {
        icon: 'mdi-tshirt-crew',
        title: 'Collections',
        route: {
          name: 'collections'
        }
      }
    ]
  })


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
