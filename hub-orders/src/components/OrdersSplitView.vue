<template>
  <div class="split-view">
    <div v-if="!orders.length" class="p-12 text-sm font-bold text-gray-500 uppercase">
      {{ $t('There are currently no orders to show.') }}
    </div>
    <div v-if="orders.length" class="flex">
      <div class="order-listing">
        <div class="px-4 py-4 bg-gray-500">
          <button class="text-white border border-gray-300 rounded hover:bg-white hover:text-gray-600" :disabled="page == 1" @click="prevPage">
            <b-icon icon="arrow-left-s-line" />
          </button>
          <button class="text-white border border-gray-300 rounded hover:bg-white hover:text-gray-600" @click="nextPage">
            <b-icon icon="arrow-right-s-line" />
          </button>
        </div>
        <div
          v-for="row in orders"
          :key="row.id"
          :class="{
            'order-item--active': order && (order.id === row.id)
          }"
          class="order-item"
          @click="load(row.id)"
        >
          <div v-if="row.placed_at" class="order-item__date">
            {{ $format.date(row.placed_at, 'ddd Do MMM YYYY @ hh:mma') }}
          </div>
          <div class="columns is-vcentered is-gapless">
            <div class="column">
              <span class="order-item__ref">{{ row.reference || row.display_id }}</span>
              <span v-if="row.billing_details" class="order-item__name">
                <b-tooltip type="is-black" :label="firstOrder(row) ? $t('Returning Customer') : $t('New Customer')">
                  <span class="tag">{{ firstOrder(row) ? 'R' : 'N' }}</span>
                </b-tooltip>
                {{ row.billing_details.firstname }} {{ row.billing_details.lastname }}
              </span>
            </div>
            <div class="column is-narrow">
              {{ $format.currency(row.order_total) }}
            </div>
          </div>
          <span class="tag order-item__status" :style="getStatusStyles(row.status)">{{ getStatusLabel(row.status) }}</span>
        </div>
      </div>

      <div class="w-2/3 mx-auto my-12 overflow-y-scroll rounded shadow-md">
        <div class="bg-white">
          <b-loading v-if="loading" :is-full-page="false" />
          <template v-else>
            <order-details-view :order="order" :settings="settings" @statusUpdate="handleStatusUpdate" />
          </template>
        </div>
      </div>
    </div>
    <!-- {{ orders }} -->
  </div>
</template>

<script>
import InteractsWithOrders from '../mixins/InteractsWithOrders.js'
import OrderDetailsView from './OrderDetailsView.vue'
const first = require('lodash/first')
const find = require('lodash/find')
export default {
  components: {
    OrderDetailsView
  },
  mixins: [
    InteractsWithOrders
  ],
  props: {
    page: {
      type: Number,
      default: 1
    },
    orders: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      order: null
    }
  },
  mounted () {
    const order = first(this.orders)
    if (order) {
      this.load(order.id)
    } else {
      this.order = null
    }
  },
  methods: {
    handleStatusUpdate (status) {
      const order = find(this.orders, o => o.id == this.order.id)
      order.status = status
    },
    async load (id) {
      if (this.order && (id === this.order.id)) {
        return
      }
      this.loading = true
      const response = await this.$gc.orders.find(id, {
        includes: 'user.customer,lines,transactions,discounts,shipping'
      })
      this.order = response.data.data
      this.loading = false
    },
    prevPage () {
      this.$emit('changePage', this.page - 1)
    },
    nextPage () {
      this.$emit('changePage', this.page + 1)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~bulma/sass/utilities/_all";

  .order-item {
    padding:20px 30px;
    border-bottom: 1px solid lighten(#F6F8FB, 6%);
    background-color: darken(#F6F8FB, 2%);
    cursor: pointer;
    &:hover {
      background-color: darken(#F6F8FB, 4%);
    }
    .columns {
      margin-bottom:0;
    }
    &--active {
      background-color: white;
      &:hover {
        background-color:inherit;
      }
    }
    &__date {
      font-size: $size-small;
      font-weight: $weight-medium;
    }
    &__ref {
      font-size: $size-medium;
      display:block;
      margin-top:6px;
    }
    &__name {
      font-size: $size-small;
      color: $grey;
    }
    &__status {
      margin-top:6px;
    }
  }
  .order-view {
    background-color: white;
    overflow-y:scroll;
    height:100vh;
    width:100%;
  }
  .order-listing  {
    width:20%;
    height:100vh;
    overflow-y:scroll;
    &__pagination {
      padding: 10px 30px;
    }
    .card {
      cursor: pointer;
      &:hover {
        background-color: #f5f5f5;
      }
      &.is-active {
        border-right:4px solid #6201C9;
      }
      .card-content {
        padding: 1rem;
      }
    }
  }
  .order-date {
    font-size:.875em;
    i {
      margin-right: 5px;
    }
  }
</style>
