const sortBy = require('lodash/sortBy')

export const state = () => ({
  apiVersion: null,
  storename: null,
  fetchedRoot: false,
  logo: null,
  locale: null,
  channel: null,
  maxUploadSize: 1000,
  settings: {},
  currency: null,
  currencies: [],
  sections: {
    'catalogue-manager': {
      label: 'Catalogue Manager',
      icon: 'building-store',
      position: 0,
      items: []
    },
    'order-processing': {
      label: 'Order Processing',
      icon: 'credit-card',
      position: 10,
      items: []
    },
    'marketing-suite': {
      label: 'Marketing Suite',
      icon: 'speakerphone',
      position: 20,
      items: []
    },
    reports: {
      label: 'Reports',
      icon: 'chart-bar',
      position: 30,
      items: []
    }
  },
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
  setFormErrors (state, errors) {
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
  setFetchedRoot (state, bool) {
    state.fetchedRoot = bool
  },
  setMaxUploadSize (state, size) {
    state.maxUploadSize = size
  },
  setStoreName (state, storename) {
    state.storename = storename
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
  setSections (state, sections) {
    state.sections = sections
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
  addSection (state, { section, items }) {
    // Deprecated...

    // const { sections } = state
    // const { handle, items } = options
    // if (handle) {
    //   if (sections[handle] !== undefined) {
    //     if (options.dashboard) {
    //       sections[handle].dashboard = true
    //     }
    //     if (items && sections[handle].items) {
    //       sections[handle].items = [...sections[handle].items, ...items]
    //     }
    //   } else {
    //     sections[handle] = options
    //   }
    // }
  },
  addNavItems (state, { section, items }) {
    const { sections } = state
    if (!sections[section]) {
      throw new Error(`Section "${section}" doesn't exist`)
    }

    const existingItems = sections[section].items

    state.sections[section].items = [
      ...existingItems,
      ...items
    ]
  }
}

export const actions = {
  addSection ({ commit, state }, section) {
    const { sections } = state
    if (sections[section.handle]) {
      throw new Error(`Section with ${section.handle} already exists`)
    }
    sections[section.handle] = section
    commit('setSections', sortBy(sections, section => section.position || 1))
  },
  addNavItems ({ commit, state }, { section, items }) {
    commit('addNavItems', { section, items })
  }
}
