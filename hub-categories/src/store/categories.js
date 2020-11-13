export const state = () => ({
  model: null,
  liveId: null,
  isDraft: false,
  state: 'idle',
  createDraft: false,
  pendingAssets: [],
  assets: [],
  config: {}
})
export const mutations = {
  setModel (state, model) {
    state.model = model
  },
  setOnModel (state, conf) {
    state.model[conf.field] = conf.value
  },
  setIsDraft (state, val) {
    state.isDraft = val
  },
  setConfig (state, conf) {
    state.config = conf
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
  },
  async createDraft ({ commit }, { context, id }) {
    return context.on('Categories').postCategoriesCategoryIdDrafts(id, [
        'layout',
        'attributes.group.attributes',
        'assets.transforms',
        'routes',
        'assets.tags',
        'channels',
        'customerGroups',
        'children'
      ])
  },
  async fetch ({ commit, state }, { context, id }) {
    const response = await context.categories.find(id, {
      full_response: true,
      draft: true,
      include: [
        'assets.tags',
        'assets.transforms',
        'attributes.group.attributes',
        'channels',
        'draft',
        'publishedParent',
        'children',
        'customerGroups',
        'layout',
        'versions.user',
        'routes'
      ]
    })

    const category = response.data.data

    const isDraft = !!category.drafted_at

    if (!isDraft) {
        commit('setLiveId', category.id)
    } else {
        commit('setLiveId', category.published_parent.data.id)
    }

    commit('setIsDraft', isDraft)

    return category
  },
  resetState ({ commit }) {
    commit('setModel', null)
    commit('setIsDraft', false)
    commit('setCreateDraft', false)
  },
  async publish ( { commit, state }, { categoryId, context }) {
    await context.categories.publish(categoryId);
    commit('setLiveId', categoryId)
    commit('setIsDraft', false)
  },
  save ( { commit, state }, payload) {
    const { context, data } = payload;
    context.categories.update(state.model.id, data).then(response => {
    })
},
}
