export const state = () => ({
    apiVersion: null,
    storename: null,
    logo: null,
    locale: null,
    channel: null,
    settings: {},
    currency: null,
    currencies: [],
    sections: {},
    languages: [],
    channels: [],
    taxes: [],
    formErrors: {},
    error: null,
    customerGroups: []
  })

  export const mutations = {
    setLocale (state, locale) {
      state.locale = locale
    },
    setError (state, error) {
      state.error = error
    },
    setFormErrors(state, errors) {
      state.formErrors = errors
    },
    setSetting (state, config) {
      const { handle, value } = config
      if (state.settings[handle]) {
        state.settings[handle] = { ...state.settings[handle], ...value }
      } else {
        state.settings[handle] = value
      }
      state.config = config
    },
    setApiVersion (state, apiVersion) {
      state.apiVersion = apiVersion
    },
    setCurrency (state, currency) {
      state.currency = currency
    },
    setChannel (state, channel) {
      state.channel = channel
    },
    setCurrencies (state, currencies) {
      state.currencies = currencies
    },
    setTaxes (state, taxes) {
      state.taxes = taxes
    },
    setCustomerGroups (state, customerGroups) {
      state.customerGroups = customerGroups
    },
    setLanguages (state, languages) {
      state.languages = languages
    },
    setChannels (state, channels) {
      state.channels = channels
    },
    addSection (state, options) {
      const { sections } = state
      const { handle, items } = options
      if (handle) {
        if (sections[handle] !== undefined) {
          if (options.dashboard) {
            sections[handle].dashboard = true
          }
          if (items && sections[handle].items) {
            sections[handle].items = [...sections[handle].items, ...items]
          }
        } else {
          sections[handle] = options
        }
      }
    },
    addNavItem (state, data) {
      const { sections } = state
      const { section, item } = data
      if (!sections[section]) {
        throw new Error(`Section "${section}" doesn't exist`)
      }
      sections[section].items.push(item)
    }

  }

  export const actions = {
    addNavItems ({ commit, state }, { section, items }) {
      // const { sections } = state
      // const { section, items } = data
      items.forEach(item => {
        commit('addNavItem', {
          section,
          item
        })
      })

    }
  }
