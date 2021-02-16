import OrderIndex from './orders/pages/OrderIndex'
import OrderView from './orders/pages/OrderView'
import OrderDashboard from './orders/pages/OrderDashboard'
import CustomerOrderHistory from './orders/components/CustomerOrderHistory.vue'
import SalesReport from './orders/pages/reports/SalesReport.vue'
import OrdersReport from './orders/pages/reports/OrdersReport.vue'
import NewVsReturningCustomers from './orders/pages/reports/NewVsReturningCustomers.vue'
import BestSellers from './orders/pages/reports/BestSellers.vue'
import AvgOrderValue from './orders/pages/reports/AvgOrderValue.vue'

export default ({ app }, inject) => {

  app.i18n.mergeLocaleMessage('en', require('./orders/locales/en.json'))
  app.i18n.mergeLocaleMessage('fr', require('./orders/locales/fr.json'))

  // TODO: Try and do this more effeciently
  app.router.addRoutes([
    {
        path: '/order-processing/dashboard',
        name: 'order-processing.dashboard',
        component: OrderDashboard,
        meta: {
          permissions: ['manage_catalogue']
        }
    },
    {
      path: '/order-processing/orders',
      name: 'orders',
      component: OrderIndex,
      meta: {
        permissions: ['manage_catalogue']
      }
    },
    {
      path: '/order-processing/orders/:id',
      name: 'orders.view',
      component: OrderView,
      meta: {
        permissions: ['manage_catalogue']
      }
    },
    {
        path: '/order-processing/customers/:id/order-history',
        name: 'customers.edit.order-history',
        component: CustomerOrderHistory,
        meta: {
            permissions: ['manage_customers']
        }
    },
    {
        path: '/reports/sales',
        name: 'reports.sales',
        component: SalesReport,
        meta: {
            permissions: ['manage_catalogue']
        }
    },
    {
        path: '/reports/orders',
        name: 'reports.orders',
        component: OrdersReport,
        meta: {
            permissions: ['manage_catalogue']
        }
    },
    {
        path: '/reports/orders/avg-order-value',
        name: 'reports.orders.avg-order-value',
        component: AvgOrderValue,
        meta: {
            permissions: ['manage_catalogue']
        }
    },
    {
        path: '/reports/customers/new-vs-returning',
        name: 'reports.customers.new-vs-returning',
        component: NewVsReturningCustomers,
        meta: {
            permissions: ['manage_catalogue']
        }
    },
    {
        path: '/reports/products/best-sellers',
        name: 'reports.products.best-sellers',
        component: BestSellers,
        meta: {
            permissions: ['manage_catalogue']
        }
    }
  ])

  app.store.dispatch('addNavItems', {
    section: 'reports',
    items: [
      {
        label: 'Sales Report',
        position: 0,
        route: {
          name: 'reports.sales'
        }
      },
      {
        label: 'Order totals Report',
        position: 10,
        route: {
          name: 'reports.orders'
        }
      },
      {
        label: 'New Vs Returning Customers',
        position: 20,
        route: {
          name: 'reports.customers.new-vs-returning'
        }
      },
      {
        label: 'Avg. Order Value',
        position: 30,
        route: {
          name: 'reports.orders.avg-order-value'
        }
      },
      {
        label: 'Best selling products',
        position: 40,
        route: {
          name:  'reports.products.best-sellers'
        }
      }
    ]
  })

  // Add our store module
//   app.store.registerModule('collections', {
//     namespaced: true,
//     state,
//     mutations
//   })

app.store.dispatch('addNavItems', {
  section: 'order-processing',
  items: [
    {
      label: 'Orders',
      position: 0,
      route: {
        name: 'orders'
      }
    }
  ]
})


  app.$hooks.hook('customers.edit.tabs', (tabs) => {
    tabs.push({
        label: 'Order History',
        route: 'customers.edit.order-history'
    })
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
