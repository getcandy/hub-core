import DiscountsIndex from './discounts/pages/DiscountsIndex.vue'
import DiscountDetails from './discounts/pages/edit/DiscountDetails.vue'
import DiscountSets from './discounts/pages/edit/DiscountSets.vue'
import DiscountRewards from './discounts/pages/edit/DiscountRewards.vue'
import DiscountAvailability from './discounts/pages/edit/DiscountAvailability.vue'
import discountStore from './discounts/store/discounts.js'

export default ({ app }, inject) => {
  const routes = [
    {
      path: '/marketing-suite/discounts',
      name: 'discounts',
      component: DiscountsIndex,
      meta: {
        permissions: ['manage_discounts']
      }
    },
    {
      path: '/marketing-suite/discounts/:id',
      name: 'discounts.edit.details',
      component: DiscountDetails,
      meta: {
        permissions: ['manage_discounts']
      }
    },
    {
      path: '/marketing-suite/discounts/:id/sets',
      name: 'discounts.edit.sets',
      component: DiscountSets,
      meta: {
        permissions: ['manage_discounts']
      }
    },
    {
      path: '/marketing-suite/discounts/:id/rewards',
      name: 'discounts.edit.rewards',
      component: DiscountRewards,
      meta: {
        permissions: ['manage_discounts']
      }
    },
    {
      path: '/marketing-suite/discounts/:id/availability',
      name: 'discounts.edit.availability',
      component: DiscountAvailability,
      meta: {
        permissions: ['manage_discounts']
      }
    }
  ]
  routes.forEach(route => {
    app.router.addRoute(route)
  });

  app.store.dispatch('addNavItems', {
    section: 'marketing-suite',
    items: [
      {
        label: 'Discounts',
        route: {
            name: 'discounts'
        }
      }
    ]
  })


  app.store.registerModule('discounts', discountStore)
}
