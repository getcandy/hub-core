export default {
  data () {
    return {}
  },
  computed: {
    channel () {
      return this.$store.state.core.channel
    },
    locale () {
      return this.$i18n.locale
    },
    languages () {
      return this.$store.state.core.languages
    },
    channels () {
      return this.$store.state.core.channels
    },
    customerGroups () {
      return this.$store.state.core.customerGroups
    }
  }
}
