<template>
  <div>
    <url-manager
      :routes="routes"
      :errors="formErrors"
      @added="handleAdded"
      @updated="handleUpdated"
      @deleted="handleDeleted"
    />
  </div>
</template>

<script>
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'
import HasDrafts from '@getcandy/hub-core/src/mixins/HasDrafts'
const filter = require('lodash/filter')
const each = require('lodash/each')
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
      redirects: [],
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
    const allRoutes = this.category.routes.data
    this.routes = filter(allRoutes, route => !route.redirect) || []
    this.redirects = filter(allRoutes, route => route.redirect) || []
  },
  methods: {
    setDefault (items, index) {
      each(items, (item, itemIndex) => {
        if (itemIndex !== index) {
          item.default = false
        }
      })
    },
    add (items) {
      items.push({
        path: null,
        slug: null,
        locale: first(this.languages).lang,
        default: false
      })
    },
    cancel (items, index) {
      items.splice(index, 1)
      if (items.length === 1) {
        first(items).default = true
      }
    },
    async handleAdded (route) {
      await this.createDraft('categories', this.category.id, {
        afterRedirect: (draft) => {
          this.category.id = draft.id
        }
      })
      try {
        const response = await this.$gc.categories.addRoute(this.category.id, route)
        this.routes.push(response.data.data)
      } catch (e) {
        // this.setFormErrors(e.response.data)
      }
    },
    async handleUpdated (route) {
      await this.createDraft('categories', this.category.id, {
        afterRedirect: (draft) => {
          this.category.id = draft.id
        }
      })

      try {
        await this.$gc.routes.put(route.id, route)
      } catch (e) {
        this.$notify.queue('error', this.$t('Unable to add route'))
      }
    },
    async handleDeleted (index) {
      await this.createDraft('categories', this.category.id, {
        afterRedirect: (draft) => {
          this.category.id = draft.id
        }
      })
      await this.$gc.routes.delete(this.routes[index].id)
      this.routes.splice(index, 1)
      if (this.routes.length === 1) {
        first(this.routes).default = true
      }
    }
  }
}
</script>
