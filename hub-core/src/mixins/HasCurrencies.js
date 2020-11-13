
export default {
  computed: {
    currency () {
      return this.$store.state.core.currency
    },
    currencies () {
      return this.$store.state.core.currencies
    }
  }
}
