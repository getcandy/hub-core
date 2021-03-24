<template>
  <div>
    <url-manager
      :routes="routes"
      :errors="formErrors"
      element-type="category"
      :element-id="category.id"
      @created="handleCreated"
      @added="handleAdded"
      @updated="handleUpdated"
      @deleted="handleDeleted"
    />
  </div>
</template>

<script>
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'
import HasDrafts from '@getcandy/hub-core/src/mixins/HasDrafts'
const each = require('lodash/each')
const find = require('lodash/find')
const get = require('lodash/get')
const first = require('lodash/first')

export default {
  layout: 'category',
  mixins: [
    HasDrafts,
    HandlesForms
  ],
  data () {
    return {
      routes: [],
      storeHandle: 'categories'
    }
  },
  computed: {
    category () {
      return JSON.parse(JSON.stringify(this.$store.state.categories.model))
    },
    languages () {
      return this.$store.state.core.languages
    }
  },
  mounted () {
    this.routes = this.category.routes.data
  },
  methods: {
    async handleCreated (callback) {
      await this.createDraft('categories', this.category.id, {
        afterRedirect: (draft) => {
          this.category.id = draft.id
        }
      })
      callback()
    },
    handleAdded (route) {
      this.routes.push(route)
    },
    async handleUpdated (route) {
      await this.createDraft('categories', this.category.id, {
        afterRedirect: (draft) => {
          this.category.id = draft.id
          const routes = draft.routes.data

          // We need to find the drafted route
          const routeDraft = find(routes, (r) => {
            if (r.published_parent && r.published_parent.data) {
              return r.published_parent.data.id === route.id
            }
          })
          route.id = routeDraft ? routeDraft.id : route.id
        }
      })

      try {
        await this.$gc.routes.put(route.id, route)
        this.$notify.queue('success', this.$t('URLs updated'))
      } catch (e) {
        const errors = get(e, 'response.data.errors', [])

        each(errors, (error) => {
          each(error, (e) => {
            this.$notify.queue('error', this.$t(e))
          })
        })
      }
    },
    async handleDeleted (index) {
      const route = this.routes[index]
      await this.createDraft('categories', this.category.id, {
        afterRedirect: (draft) => {
          this.category.id = draft.id
          const routes = draft.routes.data

          // We need to find the drafted route
          const routeDraft = find(routes, (r) => {
            if (r.published_parent && r.published_parent.data) {
              return r.published_parent.data.id === route.id
            }
          })
          route.id = routeDraft ? routeDraft.id : route.id
        }
      })
      await this.$gc.routes.delete(route.id)
      this.routes.splice(index, 1)
      if (this.routes.length === 1) {
        first(this.routes).default = true
      }
    }
  }
}
</script>
