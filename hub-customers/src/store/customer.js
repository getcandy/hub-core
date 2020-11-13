export const state = () => ({
    model: null,
    customerGroups: []
})

export const mutations = {
    setModel (state, model) {
        state.model = model
    },
    setCustomerGroups (state, customerGroups) {
        state.customerGroups = customerGroups
    }
}

export const actions = {
}