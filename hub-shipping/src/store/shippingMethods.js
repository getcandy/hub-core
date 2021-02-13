export const state = () => ({
    model: null
})
export const mutations = {
    setModel (state, model) {
        state.model = model
    },
    setOnModel (state, conf) {
        state.model[conf.field] = conf.value
    },
}

export const actions = {
    setModel ({ commit }, model) {
        commit('setModel', model)
    }
}
