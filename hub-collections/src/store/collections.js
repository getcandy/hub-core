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
      return context.collections.createDraft(id, null, {
        excl_tax: true,
        full_response: true,
        option_data: true,
        draft: true,
        includes: [
          'attributes.group.attributes',
          'assets.transforms',
          'routes',
          'assets.tags',
          'channels',
          'customerGroups',
          'children'
        ]
      })
    },
    async fetch ({ commit, state }, { context, id }) {
      const response = await context.collections.find(id, {
        full_response: true,
        draft: true,
        include: [
          'assets.tags',
          'assets.transforms',
          'attributes.group.attributes',
          'channels',
          'draft',
          'publishedParent',
          'customerGroups',
          'versions.user',
          'routes'
        ]
      })

      const collection = response.data.data

      const isDraft = !!collection.drafted_at

      if (!isDraft) {
          commit('setLiveId', collection.id)
      } else {
          commit('setLiveId', collection.published_parent.data.id)
      }

      commit('setIsDraft', isDraft)

      return collection
    },
    resetState ({ commit }) {
      commit('setModel', null)
      commit('setIsDraft', false)
      commit('setCreateDraft', false)
    },
    async publish ( { commit, state }, { collectionId, context }) {
      await context.collections.publish(collectionId);
      commit('setLiveId', categoryId)
      commit('setIsDraft', false)
    },
    save ( { commit, state }, payload) {
      const { context, data } = payload;
      context.collections.update(state.model.id, data).then(response => {
      })
  },
  }
