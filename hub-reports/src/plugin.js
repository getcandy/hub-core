import ReportsIndex from './reports/pages/ReportsIndex.vue'
export default ({ app }, inject) => {

  // TODO: Try and do this more effeciently
  app.router.addRoutes([
    {
      path: '/reports/exports',
      name: 'reports.index',
      component: ReportsIndex,
      meta: {
        permissions: ['view-reports']
      }
    },

  ])


  app.store.dispatch('addNavItems', {
    section: 'reports',
    items: [
      {
        label: 'Exports',
        position: 0,
        route: {
          name: 'reports.index'
        }
      },
    ]
  })
//   app.store.commit('addSection', {
//     title: 'Reports',
//     handle: 'reports',
//     items: [
//       {
//         icon: 'pie-chart-line',
//         title: 'Reports',
//         route: {
//           name: 'reports.index'
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
