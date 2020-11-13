<template>
  <div>
    <url-manager
      :routes="routes"
      @added="handleAdded"
      @updated="handleUpdated"
      :errors="formErrors"
      @deleted="handleDeleted"
    />
  </div>
</template>

<script>
  const filter = require('lodash/filter')
  const each = require('lodash/each')
  const first = require('lodash/first')

  import HubPage from '@getcandy/hub-core/src/mixins/HubPage'
  import HasDrafts from '@getcandy/hub-core/src/mixins/HasDrafts'
  import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'

  export default {
    layout: 'product',
    mixins: [
      HubPage,
      HasDrafts,
      HandlesForms
    ],
    data() {
      return {
        routes: [],
        redirects: [],
      }
    },
    methods: {
      async handleAdded (route) {
        await this.createDraft('product', this.product.id, {
          afterRedirect: async (draft) => {
            this.product.id = draft.id
          }
        }, this.$getcandy)
        try {
          const response = await this.$gc.products.addRoute(this.product.id, route)
          this.routes.push(response.data.data)
        } catch (e) {
          this.setFormErrors(e.response.data)
        }
      },
      async handleSaved (routes, callback) {
        await this.createDraft('product', this.product.id, {
          afterRedirect:  async (draft) => {
            this.product.id = draft.id
          }
        }, this.$getcandy)

        each(routes, async (r) => {
          const response = await this.$gc.products.addRoute(this.product.id, r)
          r.id = response.data.data.id
        })
      },
      async handleUpdated (route) {
        await this.createDraft('product', this.product.id, {
          afterRedirect:  async (draft) => {
            this.product.id = draft.id
          }
        }, this.$getcandy)

        try {
          await this.$gc.routes.put(route.id, route)
        } catch (e) {
          this.$notify.queue('error', this.$t('Unable to add route'))
        }
      },
      async handleDeleted (index) {
        await this.createDraft('product', this.product.id, {
          afterRedirect:  async (draft) => {
            this.product.id = draft.id
          }
        }, this.$getcandy)
        await this.$gc.routes.delete(this.routes[index].id)
        this.routes.splice(index, 1)
        if (this.routes.length == 1) {
          first(this.routes).default = true
        }
      }
    },
    mounted() {
      this.routes = this.product.routes.data
      // const allRoutes = this.product.routes.data;
      // this.routes = filter(allRoutes, route => !route.redirect) || []
      // this.redirects = filter(allRoutes, route => route.redirect) || []
    },
    computed: {
      product() {
        return JSON.parse(JSON.stringify(this.$store.state.product.model))
      }
    }
  }
</script>

