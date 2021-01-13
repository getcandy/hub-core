import color from 'color'

export default {
  props: {
    settings: {
      type: Object,
      default() {
        return {
          statuses: {
            options: {}
          }
        }
      }
    }
  },
  methods: {
    getStatusLabel(handle) {
      const status = this.statuses[handle]
      return status ? status.label : handle
    },
    formatSubTotal(order) {
        var currency = find(this.currencies, item => {
            return item.code == order.currency;
        });
        return this.$format.currency(order.order_total, currency)
    },
    firstOrder(order) {
      const user = order.user.data;
      if (!user || !user.first_order.data) {
          return false;
      }
      return user.first_order.data.id == order.id;
    },
    getStatusStyles (handle) {
        const status = this.statuses[handle] || null

        if (!status) {
            return {
                color: '#f5f5f5',
                'background-color': '#333'
            }
        }

        const colorVal = status.color || status.colour

        return {
            color: color(colorVal).darken(.2),
            'background-color': color(colorVal).alpha(0.1)
        }
    }
  },
  computed: {
    statuses () {
        return this.settings.statuses ? this.settings.statuses.options : {}
    }
  }
}
