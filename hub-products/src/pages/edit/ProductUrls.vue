<template>
  <div>
    <url-manager
      :routes="routes"
      :errors="formErrors"
      element-type="product"
      :element-id="product.id"
      @created="handleCreated"
      @added="handleAdded"
      @updated="handleUpdated"
      @deleted="handleDeleted"
    />
  </div>
</template>

<script>
import HubPage from '@getcandy/hub-core/src/mixins/HubPage'
import HasDrafts from '@getcandy/hub-core/src/mixins/HasDrafts'
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'

const each = require('lodash/each')
const first = require('lodash/first')
const find = require('lodash/find')
const get = require('lodash/get')

export default {
  layout: 'product',
  mixins: [
    HubPage,
    HasDrafts,
    HandlesForms
  ],
  data () {
    return {
      routes: [],
      redirects: []
    }
  },
  computed: {
    product () {
      return JSON.parse(JSON.stringify(this.$store.state.product.model))
    }
  },
  mounted () {
    this.routes = this.product.routes.data
    // const allRoutes = this.product.routes.data;
    // this.routes = filter(allRoutes, route => !route.redirect) || []
    // this.redirects = filter(allRoutes, route => route.redirect) || []
  },
  methods: {
    handleAdded (route) {
      this.routes.push(route)
    },
    async handleCreated (callback) {
      await this.createDraft('product', this.product.id, {
        afterRedirect: (draft) => {
          this.product.id = draft.id
        }
      }, this.$getcandy)
      callback()
    },
    async handleUpdated (route) {
      await this.createDraft('product', this.product.id, {
        afterRedirect: (draft) => {
          this.product.id = draft.id
          const routes = draft.routes.data

          // We need to find the drafted route
          const routeDraft = find(routes, (r) => {
            if (r.published_parent && r.published_parent.data) {
              return r.published_parent.data.id === route.id
            }
          })
          route.id = routeDraft ? routeDraft.id : route.id
        }
      }, this.$getcandy)

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
      await this.createDraft('product', this.product.id, {
        afterRedirect: (draft) => {
          this.product.id = draft.id
          const routes = draft.routes.data

          // We need to find the drafted route
          const routeDraft = find(routes, (r) => {
            if (r.published_parent && r.published_parent.data) {
              return r.published_parent.data.id === route.id
            }
          })
          route.id = routeDraft ? routeDraft.id : route.id
        }
      }, this.$getcandy)
      await this.$gc.routes.delete(route.id)
      this.routes.splice(index, 1)
      if (this.routes.length === 1) {
        first(this.routes).default = true
      }
    }
  }
}
</script>
