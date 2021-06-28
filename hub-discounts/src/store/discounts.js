
export default {
    namespaced: true,
    state: {
      model: null,
    },
    mutations: {
      setModel(state, model) {
        state.model = model
      }
    },
    actions: {
      setModel ({ commit }, model) {
        commit('setModel', model)
      },
      async fetch({ commit }, context, id) {
          const response = await context.$getcandy.shippingZones.find(id)
          commit('setModel', response.data.data)
      }
    }
  }
