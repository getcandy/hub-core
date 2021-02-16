export default {
  namespaced: true,
  state: {
    model: null,
    attributes: null,
    config: {}
  },
  mutations: {
    setModel (state, model) {
      state.model = model
    },
    setOnModel (state, conf) {
      state.model[conf.field] = conf.value
    },
    setConfig (state, conf) {
      state.config = conf
    },
    setAttributes (state, attributes) {
      state.attributes = attributes
    },
    addAttribute (state, options) {
      state.model.attribute_data[options.handle] = options.value
    },
    setState (state, value) {
      state.state = value
    }
  },
  actions: {
    async fetch ({ commit, state }, { context, id }) {
      const response = await context.productFamilies.find(id, {
        excl_tax: true,
        full_response: true,
        option_data: true,
        draft: true,
        include: [
          'products',
          'attributes.group.attributes'
        ]
      })
      return response.data.data
    },
    save ({ commit, state }, payload) {
    }
  }
}
