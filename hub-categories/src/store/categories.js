const defaultIncludes = Array([
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
  'routes.language',
  'routes.publishedParent',
  'routes.draft'
]).join(',')

export const state = () => ({
  model: {},
  liveId: null,
  isDraft: false,
  state: 'idle',
  createDraft: false,
  creatingDraft: false,
  publishingDraft: false,
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
  setCreatingDraft (state, val) {
    state.creatingDraft = val
  },
  setPublishingDraft (state, val) {
    state.publishingDraft = val
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
  async createDraft ({ commit }, { id, $nuxt }) {
    commit('setCreatingDraft', true)
    const response = await $nuxt.$getcandy.on('categories', 'postCategoriesCategoryIdDrafts', id, defaultIncludes)
    commit('setIsDraft', true)
    commit('setModel', response.data.data)
    commit('setLiveId', id)
    commit('setCreatingDraft', false)
    return response
  },
  async fetch ({ commit, dispatch }, { $nuxt, id }) {
    const response = await $nuxt.$getcandy.on('categories', 'getCategoriesCategoryId',
      id,
      defaultIncludes,
      {
        query: {
          full_response: true,
          draft: 1,
          include: defaultIncludes
        }
      }
    )

    const category = response.data.data
    const isDraft = !!category.drafted_at
    const draftModel = category.draft.data

    if (draftModel) {
      await $nuxt.$router.replace({
        name: 'categories.edit.details',
        params: {
          id: draftModel.id
        }
      })
      await dispatch('fetch', {
        $nuxt,
        id: draftModel.id
      })
      return
    }

    commit('setModel', category)

    if (!isDraft) {
      commit('setLiveId', category.id)
    } else {
      commit('setLiveId', category.published_parent.data.id)
    }

    commit('setIsDraft', isDraft)

    return category
  },
  resetState ({ commit }) {
    commit('setModel', {})
    commit('setIsDraft', false)
    commit('setCreateDraft', false)
  },
  async publish ({ commit }, { id, $nuxt }) {
    commit('setPublishingDraft', true)
    const response = await $nuxt.$getcandy.on('categories', 'publishCategoryDraft', id, defaultIncludes, {
      query: {
        full_response: true
      }
    })

    const { params } = $nuxt.$route
    const publishedId = response.data.data.id

    // Only try and redirect if the ID for the current route
    // is different, otherwise we get an error.
    if (params.id !== publishedId) {
      await this.$router.replace({
        name: 'categories.edit.details',
        params: {
          id: publishedId
        }
      })
    }
    commit('setModel', response.data.data)
    commit('setIsDraft', false)
    commit('setPublishingDraft', false)
    return response
  },
  async save ({ state }, payload) {
    const { context, data } = payload
    await context.categories.update(state.model.id, data)
  }
}
