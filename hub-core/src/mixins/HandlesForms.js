const first = require('lodash/first')

export default {
  data () {
    return {
      formErrors: {}
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
      return !!this.formErrors[field]
    },
    getFormErrors (field) {
      return this.formErrors[field]
    },
    getFirstFormError (field) {
      return first(this.formErrors[field])
    }
  }
}
