<template>
  <div>
    <toolbar heading="Orders">
      <template v-slot:search>
        <b-input icon="search-line" v-model="searchTerm" @input="initSearch" :placeholder="$t('Search orders...')"></b-input>
      </template>
      <div class="flex items-center">
        <div class="mr-4">
          <div class="flex bg-gray-200 text-xs p-1 rounded shadow-inner">
            <button class="py-2 px-3 rounded focus:outline-none" @click="view = 'table'" :class="{ 'bg-white shadow text-purple-600': view == 'table', 'bg-transparent text-gray-600 hover:text-gray-800' : view != 'table' }">Table View</button>
            <button class="py-2 px-3 rounded focus:outline-none" @click="view = 'split'" :class="{ 'bg-white shadow text-purple-600': view == 'split', 'bg-transparent text-gray-600 hover:text-gray-800' : view != 'split' }" >Split view</button>
          </div>
        </div>
        <gc-button @click="showFilters = true" theme="gray">
          <b-icon icon="equalizer-line" />
        </gc-button>
      </div>
    </toolbar>
    <quick-view-panel
            :open="showFilters"
            @close="showFilters = false"
            heading="Apply filters"
          >
            <form action="" class="mx-6 text-sm">
              <div class="mt-4">
                <header class="mb-1 font-bold text-gray-700 text-sm">
                  <label>{{ $t('Order date') }}</label>
                </header>
                <div>
                  <b-datepicker
                    v-model="dates"
                    @input="loadData"
                    icon="calendar-line"
                    :placeholder="$t('Select date')"
                    range
                  />
                </div>
              </div>
              <div class="my-4">
                <header class="mb-1 font-bold text-gray-700 text-sm">
                  <label>{{ $t('Shipping Zone') }}</label>
                </header>
                <div>
                  <select-input v-model="filters.zone" @input="loadData">
                    <option value>{{ $t('All Zones') }}</option>
                    <option v-for="(zone, handle) in zones" :key="handle" :value="zone.name">
                      {{ zone.name }}
                    </option>
                  </select-input>
                </div>
              </div>
              <div>
                <header class="mb-1 font-bold text-gray-700 text-sm">
                  <label>{{ $t('Status') }}</label>
                </header>
                <div>
                  <select-input @input="loadData" v-model="filters.status" >
                    <option value>{{ $t('All Statuses') }}</option>
                    <option v-for="(status, handle) in settings.statuses.options" :key="handle" :value="handle">
                      {{ status.label ? status.label : $t('Unknown') }}
                    </option>
                  </select-input>
                </div>
              </div>
            </form>
          </quick-view-panel>
    <orders-table-view
      v-if="view == 'table'"
      :orders="orders"
      :loading="loading"
      :total="total"
      :per-page="perPage"
      :settings="settings"
      @changePage="changePage"
      :meta="meta"
    />

    <orders-split-view
      v-if="view == 'split'"
      :orders="orders"
      :settings="settings"
      :page="page"
      @changePage="changePage"
    />
  </div>
</template>

<script>
const debounce = require('lodash/debounce')
const find = require('lodash/find')
const map = require('lodash/map')
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
import moment from 'moment'
import UpdateOrderStatus from '../components/UpdateOrderStatus.vue'
import OrderExport from '../components/OrderExport.vue'
import OrdersSplitView from '../components/OrdersSplitView.vue'
import OrdersTableView from '../components/OrdersTableView.vue'

export default {
  mixins: [
    HasAttributes,
  ],
  components: {
    UpdateOrderStatus,
    OrderExport,
    OrdersTableView,
    OrdersSplitView
  },
  async asyncData({app, params}) {
    const settingResponse = await app.$gc.settings.fetch('orders');

    return {
      loading: true,
      perPage: 30,
      dates: [],
      filters: {
        status: null,
        zone: null
      },
      checkedRows: [],
      page: 1,
      total: 0,
      orders: [],
      types: [],
      showFilters: false,
      zones: [],
      searchTerm: null,
      settings: settingResponse.data.data,
      view: 'table',
      meta: {}
    }
  },
  head() {
    return {
      title: 'Orders',
    }
  },
  mounted() {
    this.loadTypes()
    this.loadData()
    this.loadShippingZones()
  },
  methods: {
    changePage(page) {
      this.page = page
      this.loadData()
    },
    loadTypes() {
      this.$gc.orders.types().then(response => {
        this.types = response.data.data
      })
    },
    loadShippingZones() {
      this.$gc.shippingZones.get().then(response => {
        this.zones = response.data.data
      })
    },
    initSearch: debounce(function () {
      this.loadData()
    }, 500),
    loadData() {
      this.loading = true;

      let [ from, to ] = this.dates;

      if (to) {
        to = moment(to).format('YYYY-MM-DD');
      }

      if (from) {
        from = moment(from).format('YYYY-MM-DD');
      }

      this.$gc.orders.get({
        includes: 'user.firstOrder,shipping',
        to: to,
        from: from,
        page: this.page,
        sort: this.sort,
        status: this.filters.status,
        zone: this.filters.zone,
        keywords: this.searchTerm,
        per_page: this.perPage,
        type: this.filters.type,
      }).then(response => {
        this.orders = response.data.data
        this.meta = response.data.meta
        this.loading = false;
        const meta = response.data.meta
        this.total = meta.total
        this.perPage = meta.per_page
        this.page = meta.current_page;
      })
    }
  },
  computed: {
    currencies() {
      return this.$store.state.core.currencies
    },
    selectedIds() {
      return map(this.checkedRows, row => row.id)
    }
  }
}
</script>
