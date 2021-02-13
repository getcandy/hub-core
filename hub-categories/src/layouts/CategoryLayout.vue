<template>
  <default-layout>
    <loading-spinner v-if="loading" />
    <div v-else>
      <toolbar heading="Category" :subHeading="title">
          <div class="flex items-center">
            <div>
              <draft-tools
                :preview-url="previewUrl"
                :is-draft="isDraft"
                @delete="triggerDelete"
                :versions="category.versions ? category.versions.data : []"
                @discard="discard"
                @restore="restore"
                @publish="publish"
                :created-at="category.created_at"
                :updated-at="category.updated_at"
              />
            </div>
          </div>
        <!-- <button @click="save" class="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-green-600 transition duration-150 ease-in-out bg-white border border-green-300 rounded-md shadow-sm hover:text-green-500 focus:outline-none focus:border-blue-300 focus:shadow-outline sm:text-sm sm:leading-5">
          {{ $t('Save changes') }}
        </button> -->
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
  mixins: [
    HasAttributes
  ],
  components: {
    DefaultLayout,
  },
  head () {
    return {
      title: this.title
    }
  },
  data() {
    return {
      loading: true,
      section: 'details',
      navItems: {}
    }
  },
  destroyed () {
    this.$store.dispatch('categories/resetState')
  },
  async mounted() {
    if (!this.category) {
      await this.load()
    } else {
      this.loading = false
    }
    const items = [
      {
        route: 'categories.edit.details',
        label: "Attribute Details"
      },
      {
        route: 'categories.edit.media',
        label: "Media"
      },
      {
        route: 'categories.edit.availability',
        label: "Availability &amp; Pricing"
      },
      {
        route: 'categories.edit.associations',
        label: "Associations"
      },
      {
        route: 'categories.edit.routes',
        label: "Routes"
      }
    ]
    this.$nuxt.context.app.$hooks.callHook('category.main.tabs', items)

    this.navItems = {
      params: {
        id: this.category.id
      },
      items
    };
  },
  methods: {
    setSection (section) {
      this.section = section
    },
    async load (id) {
      try {
        const response = await this.$store.dispatch('categories/fetch', {
          context: this.$getcandy,
          id: id || this.$route.params.id
        })
        const category = response
        const draftModel = category.draft.data

        if (draftModel) {
          await this.$router.replace({
            name: 'categories.edit.details',
            params: {
              id: draftModel.id
            }
          })
          await this.load(draftModel.id)
          return
        }
        this.$store.commit('categories/setModel', category)
      } catch (e) {
        return this.$nuxt.error({ statusCode: e.response.status, message: e.message })
      }
      this.loading = false
    },
    save: async function() {
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
          categoryId: this.category.id,
          context: this.$gc
        })
      } catch (error) {
        this.$notify.queue('error', this.$t('Unable to publish draft'))
      }

      await this.$router.push({
        name: 'categories.edit.details',
        params: {
          id: this.liveId
        }
      })
    },
    async restore (versionId) {
      const response = await this.$gc.versions.restore(versionId, {
        type: 'categories'
      });
      this.loading = true
      await this.$router.push({
        name: 'categories.edit.details',
        params: {
          id: response.data.id
        }
      })
      this.load(response.data.id);
    }

  },
  computed: {
    title () {
      return this.category ? this.attribute(this.category.attribute_data, "name") : 'Loading...'
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
    previewUrl() {
      return this.config.preview_url.replace(':id', this.category.id) || null
    },
    config () {
      return this.$store.state.categories.config
    },
  }
}
</script>
