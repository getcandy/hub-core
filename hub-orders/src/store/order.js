export const state = () => ({
  history: []
})
export const mutations = {
  setOrderHistory (state, val) {
    state.history = val
  },
}

export const actions = {
  async addOrderNote ({ commit, state }, note) {
    const notes = state.history
    commit('setOrderHistory', [
      ...[note],
      ...state.history,
    ]);
  }
}
