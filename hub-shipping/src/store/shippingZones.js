
export default {
  namespaced: true,
  state: {
      model: null,
      selectedCountries: [],
      selectedZones: [],
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
    setSelectedCountries (state, countries) {
      state.selectedCountries = countries
    },
    setSelectedZones (state, zones) {
      state.setSelectedZones = zones
    }
  },
  actions: {
    setModel ({ commit }, model) {
      commit('setModel', model)
    },
    setSelectedZones ({ commit }, zones) {
      commit('setSelectedZones', zones)
    },
    setSelectedCountries({ commit }, countries) {
      commit('setSelectedCountries', countries)
    },
    async fetch({ commit, state }, { context }) {
        const response = await context.on('shipping', 'getShippingZones')
        commit('setItems', response.data.data)
    }
  }
}
