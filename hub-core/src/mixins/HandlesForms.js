const first = require('lodash/first')

export default {
  data () {
    return {
      formErrors: {}
    }
  },
  computed: {
    storeFormErrors () {
      return this.$store.state.core.formErrors
    }
  },
  methods: {
    setFormErrors (errors) {
      this.formErrors = errors
    },
    clearFormErrors () {
      this.formErrors = {}
    },
    hasFormError (field) {
      return !!this.formErrors[field] || !!this.storeFormErrors[field]
    },
    getFormErrors (field) {
      return this.formErrors[field] || this.storeFormErrors[field]
    },
    getFirstFormError (field) {
      return first(this.formErrors[field]) || first(this.storeFormErrors[field])
    }
  }
}
