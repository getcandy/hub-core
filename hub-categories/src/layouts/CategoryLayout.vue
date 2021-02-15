<template>
  <default-layout>
    <div v-if="$fetchState.pending" class="h-screen flex w-full items-center justify-center">
      <div class="flex items-center text-gray-500">
        <loading-spinner class="mr-2" />
        <span class="text-xs uppercase font-medium">{{ $t('Fetching Category') }}</span>
      </div>
    </div>
    <div v-else>
      <div v-if="isDraft" class="bg-orange-100 text-orange-700 p-2 text-sm border-b border-orange-300 text-center">
        {{ $t("You are viewing a draft, changes below won't be reflected until published") }}
      </div>
      <toolbar heading="Category" :sub-heading="title">
        <div class="flex items-center">
          <div>
            <draft-tools
              :preview-url="previewUrl"
              :creating-draft="creatingDraft"
              :is-draft="isDraft"
              :versions="category.versions ? category.versions.data : []"
              :created-at="category.created_at"
              :updated-at="category.updated_at"
              @delete="triggerDelete"
              @discard="discard"
              @restore="restore"
              @publish="publish"
            />
          </div>
        </div>
      </toolbar>
      <div>
        <div class="flex">
          <gc-resource-nav :nav="navItems" />
        </div>
        <div>
          <nuxt />
        </div>
      </div>
    </div>
  </default-layout>
</template>

<script>
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'
import DefaultLayout from '@getcandy/hub-core/src/layouts/Default.vue'

export default {
  components: {
    DefaultLayout
  },
  mixins: [
    HasAttributes
  ],
  async fetch () {
    await this.load()

    const items = [
      {
        route: 'categories.edit.details',
        label: 'Attribute Details'
      },
      {
        route: 'categories.edit.media',
        label: 'Media'
      },
      {
        route: 'categories.edit.availability',
        label: 'Availability &amp; Pricing'
      },
      {
        route: 'categories.edit.associations',
        label: 'Associations'
      },
      {
        route: 'categories.edit.routes',
        label: 'Routes'
      }
    ]
    this.$nuxt.context.app.$hooks.callHook('category.main.tabs', items)

    this.navItems = {
      params: {
        id: this.category.id
      },
      items
    }
  },
  data () {
    return {
      section: 'details',
      navItems: {}
    }
  },
  computed: {
    creatingDraft () {
      return this.$store.state.categories.creatingDraft
    },
    title () {
      return this.category ? this.attribute(this.category.attribute_data, 'name') : 'Loading...'
    },
    category () {
      return this.$store.state.categories.model
    },
    isDraft () {
      return this.$store.state.categories.isDraft
    },
    liveId () {
      return this.$store.state.categories.liveId
    },
    previewUrl () {
      return this.config.preview_url.replace(':id', this.category.id) || null
    },
    config () {
      return this.$store.state.categories.config
    }
  },
  destroyed () {
    this.$store.dispatch('categories/resetState')
  },
  methods: {
    setSection (section) {
      this.section = section
    },
    async load (id) {
      try {
        await this.$store.dispatch('categories/fetch', {
          $nuxt: this.$nuxt,
          id: id || this.$route.params.id
        })
      } catch (e) {
        return this.$nuxt.error({ statusCode: e.response.status, message: e.message })
      }
    },
    async save () {
      await this.$store.dispatch('categories/save', {
        context: this.$gc,
        data: {
          attributes: this.category.attribute_data,
          layout_id: this.category.layout_id
        }
      })

      this.$notify.queue('success', this.$t('Category saved'))
      this.$store.commit('categories/setModel', this.category)
    },
    async triggerDelete () {
      try {
        await this.$gc.categories.destroy(this.category.id)
        this.$router.push({
          name: 'categories'
        })
        this.$notify.queue('success', this.$t('Category deleted'))
      } catch (error) {
        this.$notify.queue('error', this.$t('Unable to delete category'))
      }
    },
    async discard () {
      const categoryId = this.category.id
      this.$store.dispatch('categories/resetState')
      this.loading = true
      await this.$gc.categories.destroy(categoryId)
      await this.$router.replace({
        name: 'categories'
      })
      await this.$router.replace({
        name: 'categories.edit.details',
        params: {
          id: this.liveId
        }
      })
      this.load(this.liveId)
    },
    async publish () {
      try {
        await this.$store.dispatch('categories/publish', {
          id: this.category.id,
          $nuxt: this.$nuxt
        })
      } catch (error) {
        this.$notify.queue('error', this.$t('Unable to publish draft'))
      }
    },
    async restore (versionId) {
      const response = await this.$gc.versions.restore(versionId, {
        type: 'categories'
      })
      this.loading = true
      await this.$router.push({
        name: 'categories.edit.details',
        params: {
          id: response.data.id
        }
      })
      this.load(response.data.id)
    }

  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>
