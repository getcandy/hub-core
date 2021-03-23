
export default {
  props: {
    currencyOverride: {
      type: Object,
      default: null
    }
  },
  computed: {
    currency () {
      return this.currencyOverride || this.$store.state.core.currency
    },
    currencies () {
      return this.$store.state.core.currencies
    }
  }
}
