import ReportsIndex from './reports/pages/ReportsIndex.vue'
export default ({ app }, inject) => {

  // TODO: Try and do this more effeciently
  app.router.addRoutes([
    {
      path: '/reports',
      name: 'reports.index',
      component: ReportsIndex,
      meta: {
        permissions: ['view_reports']
      }
    },

  ])

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
