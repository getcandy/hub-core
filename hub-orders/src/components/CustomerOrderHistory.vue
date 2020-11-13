<template>
  <div>
      <!--<div class="container order-kpi">
        <div class="columns is-v-centered">
          <div class="column is-one-fourth">
            <strong class="is-size-3">{{ getOrderCount(data.customer.orders.data) }}</strong>
            <span class="has-text-grey">{{ $t('Complete Orders') }}</span>
          </div>
          <div class="column is-one-fourth">
            <strong class="is-size-3" v-html="$format.currency(totalSpent(data.customer.orders.data))" />
            <span class="has-text-grey">{{ $t('Spent') }}</span>
          </div>
          <div class="column is-one-fourth">
            <strong class="is-size-3">
              {{ getUnfinishedOrdersCount(data.customer.orders.data) }}
            </strong>
            <span class="has-text-grey">{{ $t('Unfinished orders') }}</span>
          </div>
          <div class="column is-one-fourth">
            <strong class="is-size-3">
              {{ getLastOrderDate(data.customer.orders.data) || '---' }}
            </strong>
            <span class="has-text-grey">{{ $t('Last ordered') }}</span>
          </div>
        </div>
      </div> -->
      <div class="search-table">
        <b-table :data="orders" paginated>
          <template slot-scope="props">
            <b-table-column :label="$t('Status')">
              {{ props.row.status }}
            </b-table-column>
            <b-table-column :label="$t('Display ID')">
              <nuxt-link :to="{ name: 'orders.view', params: { id: props.row.id }}">
              {{ props.row.display_id }}
              </nuxt-link>
            </b-table-column>
            <b-table-column :label="$t('Reference')">
              {{ props.row.reference || '---' }}
            </b-table-column>
            <b-table-column :label="$t('Total')">
              {{ $format.currency(props.row.order_total) }}
            </b-table-column>
            <b-table-column :label="$t('Date')">
              <span v-if="props.row.placed_at">
                {{ $format.date(props.row.placed_at) }}
              </span>
              <span v-else>---</span>

            </b-table-column>
          </template>
          <template slot="empty">
            <section class="section">
                <div class="content has-text-grey has-text-centered">
                    <p>{{ $t('Customer has no order history') }}</p>
                </div>
            </section>
          </template>
        </b-table>
      </div>
  </div>
</template>


<script>
  const filter = require('lodash/filter')
  const orderBy = require('lodash/orderBy')
  const first = require('lodash/first')

  export default {
    layout: 'customer',
    async asyncData({app, params}) {
      const customerResponse = await app.$gc.customers.find(params.id, {
        includes: 'orders'
      })

      const customer = customerResponse.data.data


      return {
        orders: customer.orders.data,
      }
    },
    methods: {
      getOrderCount(data) {
        return data.length
      },
      getLastOrderDate (data) {
        const placedOrders = filter(data, (order) => order.placed_at)
        const sortedOrders = orderBy(placedOrders, (order) => order.placed_at)

        const lastOrder = first(sortedOrders)

        if (!lastOrder) {
          return null
        }
        return this.$format.dateRaw(lastOrder.placed_at).fromNow()
      },
      getUnfinishedOrdersCount (orders) {
        return filter(orders, (o) => !o.placed_at).length
      },
      totalSpent (data) {
        let total = 0

        data.forEach(element => {
          if (element.placed_at) {
            total += element.order_total
          }
        });

        return total
      }
    }
  }
</script>

<style scoped>
  .order-kpi {
    margin-bottom:15px;
  }
</style>
