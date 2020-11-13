const get = require('lodash/get');
const truncate = require('lodash/truncate')
export default {
  methods: {
    /**
   * Gets an attribute value
    */
    attribute (data, attribute) {
      return truncate(
        get(data, `${attribute}.${this.channel}.${this.locale}`, get(data, `${attribute}.${this.channel}.en`)),
        {'length': 50}
      )
    }
  },
  computed: {
    channel () {
      return this.$store.state.core.channel
    },
    locale () {
      return this.$store.state.core.locale
    }
  }
}
