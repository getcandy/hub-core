export const state = () => ({
  model: null,
  liveId: null,
  isDraft: false,
  createDraft: false,
  attributes: null,
  defaultIncludes: [
    'assets.tags',
    'assets.transforms',
    'associations.association.assets.transforms',
    'associations.group',
    'attributes.group.attributes',
    'categories.assets.transforms',
    'categories.routes',
    'channels',
    'collections',
    'collections.routes',
    'customerGroups',
    'draft',
    'publishedParent',
    'family.attributes.group',
    'layout',
    'routes',
    'variants.customerPricing.group',
    'variants.customerPricing.tax',
    'variants.image.transforms',
    'variants.tax',
    'variants.tiers.group',
    'versions.user'
  ],
  state: 'idle',
  pendingAssets: [],
  assets: [],
  config: {},
  errors: {}
})
export const mutations = {
  setModel (state, model) {
    state.model = model
  },
  setErrors  (state, errors) {
    state.errors = errors
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
  setIsDraft (state, val) {
    state.isDraft = val
  },
  setModelId (state, val) {
    state.model.id = val
  },
  setLiveId (state, val) {
    state.liveId = val
  },
  setCreateDraft (state, val) {
    state.createDraft = val
  },
  addAttribute (state, options) {
    state.model.attribute_data[options.handle] = options.value
  },
  setState (state, value) {
    state.state = value
  },
  setPendingAssets (state, assets) {
    state.pendingAssets = assets
  },
  setAssets (state, assets) {
      state.assets = assets
  },
  addPendingAsset (state, asset) {
      const pending = state.pendingAssets
      pending.push(asset)
      state.pendingAssets = pending
  }
}

export const actions = {
    resetState ({ commit }) {
        commit('setModel', null)
        commit('setIsDraft', false)
        commit('setCreateDraft', false)
    },
    async createDraft ({ commit, state }, { context, id }) {
        return await context.on('Products').postProductsIdDrafts(id, {
            excl_tax: true,
            full_response: true,
            option_data: true,
            draft: 1,
            includes: state.defaultIncludes
          })
    },
    async fetch ({ commit, state }, { context, id }) {
      const response = await context.on('Products').getProductsProductId(
        id || this.$route.params.id,
        Array(state.defaultIncludes).join(','),
        true,
        true,
        true,
        1
      )

      const product = response.data.data
      const isDraft = !!product.drafted_at

      if (!isDraft) {
          commit('setLiveId', product.id)
      } else {
          commit('setLiveId', product.published_parent.data.id)
      }

      commit('setIsDraft', isDraft)

      return product
    },
    save ( { commit, state }, payload) {
        const { context, data } = payload;
        commit('setState', 'saving')
        commit('setErrors', {})
        context.on('Products').putProductsProductId(state.model.id, data).then(response => {
            commit('setState', 'saved')
        }).catch(error => {
            commit('setErrors', error.body)
        })
    },

    async publish ( { commit, state }, { productId, context }) {
        await context.products.publish(productId);
        commit('setLiveId', productId)
        commit('setIsDraft', false)
    }
}
