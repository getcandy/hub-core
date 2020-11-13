
// Pages
import CategoryIndex from './categories/pages/CategoryIndex'
import CategoryDetails from './categories/pages/edit/CategoryDetails'
import CategoryMedia from './categories/pages/edit/CategoryMedia'
import CategoryAvailability from './categories/pages/edit/CategoryAvailability'
import CategoryAssociations from './categories/components/CategoryAssociations'
import CategoryAssociationsPage from './categories/pages/edit/CategoryAssociations'
import CategoryRoutes from './categories/pages/edit/CategoryRoutes'
import CategoryDisplay from './categories/pages/edit/CategoryDisplay'
import { state, mutations, actions } from './categories/store/categories.js';

export default ({ app }, inject) => {
  const options = <%= JSON.stringify(options, null, 2) %>

  // TODO: Try and do this more effeciently
  app.router.addRoutes([
    {
      path: '/catalogue-manager/categories',
      name: 'categories',
      component: CategoryIndex,
      meta: {
        permissions: ['manage_catalogue']
      }
    },
    {
        path: '/catalogue-manager/categories/:id',
        name: 'categories.edit.details',
        component: CategoryDetails,
        meta: {
          permissions: ['manage_catalogue']
        }
    },
    {
      path: '/catalogue-manager/categories/:id/media',
      name: 'categories.edit.media',
      component: CategoryMedia,
    },
    {
        path: '/catalogue-manager/categories/:id/availability',
        name: 'categories.edit.availability',
        component: CategoryAvailability,
    },
    {
        path: '/catalogue-manager/categories/:id/associations',
        name: 'categories.edit.associations',
        component: CategoryAssociationsPage,
    },
    {
        path: '/catalogue-manager/categories/:id/display',
        name: 'categories.edit.display',
        component: CategoryDisplay,
    },
    {
        path: '/catalogue-manager/categories/:id/routes',
        name: 'categories.edit.routes',
        component: CategoryRoutes,
    }
  ])

  // Add our store module
  app.store.registerModule('categories', {
    namespaced: true,
    state,
    mutations,
    actions
  })

  app.store.commit('addSection', {
    title: 'Catalogue Manager',
    handle: 'catalogue-manager',
    icon: 'store-line',
    items: [
      {
        title: 'Categories',
        route: {
          name: 'categories'
        }
      }
    ]
  })

  app.store.commit('categories/setConfig', options)



  app.$hooks.hook('products.associations.tabs', (items) => {
    items.push({
        title: 'Categories',
        component: CategoryAssociations
    })
  })

  // app.$hooks.hook('tree-test', async (items) => {
  //   items.push('four');
  // })

}
