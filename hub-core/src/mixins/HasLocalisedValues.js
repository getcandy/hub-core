import { get } from 'lodash'

export default {
  methods: {
    /**
   * Gets an localised value
    */
    getLocaleValue (data) {
      return get(data, this.locale, data.en)
    }
  },
  computed: {
    locale () {
      return this.$store.state.core.locale
    }
  }
}
