
export default {
  namespaced: true,
  state: {
      model: null,
      items: [],
  },
  mutations: {
    setItems(state, items) {
      state.items = items
    },
    setModel (state, model) {
        state.model = model
    },
    setOnModel (state, conf) {
        state.model[conf.field] = conf.value
    },
  },
  actions: {
    async fetch({ commit, state }, context) {
        const response = await context.$getcandy.shippingZones.get()
        commit('setItems', response.data.data)
    }
  }
}
