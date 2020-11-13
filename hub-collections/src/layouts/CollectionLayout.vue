<template>
  <default-layout>
    <loading-spinner v-if="loading" />
    <div v-else>
      <toolbar heading="Collection" :subHeading="title">
          <div class="flex items-center">
            <div>
              <draft-tools
                :preview-url="previewUrl"
                :is-draft="isDraft"
                @delete="triggerDelete"
                :versions="collection.versions ? collection.versions.data : []"
                @discard="discard"
                @restore="restore"
                @publish="publish"
                :created-at="collection.created_at"
                :updated-at="collection.updated_at"
              />
            </div>
          </div>
        <!-- <button @click="save" class="inline-flex justify-center w-full rounded-md border border-green-300 px-4 py-2 bg-white text-base leading-6 font-medium text-green-600 shadow-sm hover:text-green-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 sm:text-sm sm:leading-5">
          {{ $t('Save changes') }}
        </button> -->
      </toolbar>
      <div class="card">
        <div class="tabs tabs-large tabs-large--flush">
          <ul>
            <nuxt-link tag="li" exact-active-class="is-active" :to="{
              name: 'collections.edit.details',
            }">
              <a>{{ $t('Collection Details') }}</a>
            </nuxt-link>
            <nuxt-link tag="li" exact-active-class="is-active" :to="{
              name: 'collections.edit.media',
            }">
              <a>{{ $t('Media') }}</a>
            </nuxt-link>
            <nuxt-link tag="li" exact-active-class="is-active" :to="{
              name: 'collections.edit.availability',
            }">
              <a>{{ $t('Availability') }}</a>
            </nuxt-link>
            <!-- <nuxt-link tag="li" exact-active-class="is-active" :to="{
              name: 'categories.edit.routes',
            }">
              <a>{{ $t('Routes') }}</a>
            </nuxt-link> -->
            <nuxt-link tag="li" exact-active-class="is-active" v-for="(tab, index) in additionalTabs" :to="tab.route"  :key="index">
              <a>{{ $t(tab.title) }}</a>
            </nuxt-link>
          </ul>
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
    DefaultLayout
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
      additionalTabs: []
    }
  },
  destroyed () {
    this.$store.dispatch('collections/resetState')
  },
  mounted() {
    if (!this.collection) {
      this.load()
    } else {
      this.loading = false
    }
    this.$nuxt.context.app.$hooks.callHook('collection.main.tabs', this.additionalTabs);
  },
  methods: {
    setSection (section) {
      this.section = section
    },
    async load (id) {
      try {
        const response = await this.$store.dispatch('collections/fetch', {
          context: this.$gc,
          id: id || this.$route.params.id
        })
        const collection = response
        const draftModel = collection.draft.data

        if (draftModel) {
          await this.$router.replace({
            name: 'collections.edit.details',
            params: {
              id: draftModel.id
            }
          })
          await this.load(draftModel.id)
          return
        }
        this.$store.commit('collections/setModel', collection)
      } catch (e) {
        return this.$nuxt.error({ statusCode: e.response ? e.response.status : 500, message: e.message })
      }
      this.loading = false
    },
    save: async function() {
      await this.$store.dispatch('collections/save', {
        context: this.$gc,
        data: {
          attributes: this.collection.attribute_data,
          layout_id: this.collection.layout_id
        }
      })

      this.$notify.queue('success', this.$t('Collection saved'))
      this.$store.commit('collections/setModel', this.collection)
    },
    async triggerDelete () {
      try {
        await this.$gc.collections.destroy(this.collection.id)
        this.$router.push({
          name: 'collections'
        })
        this.$notify.queue('success', this.$t('Collection deleted'))
      } catch (error) {
        this.$notify.queue('error', this.$t('Unable to delete collection'))
      }
    },
    async discard () {
      const collectionId = this.collection.id
      this.$store.dispatch('collections/resetState')
      this.loading = true
      await this.$gc.collections.destroy(collectionId)
      await this.$router.replace({
        name: 'collections'
      })
      await this.$router.replace({
        name: 'collections.edit.details',
        params: {
          id: this.liveId
        }
      })
      this.load(this.liveId)
    },
    async publish () {
      try {
        await this.$store.dispatch('collections/publish', {
          collectionId: this.collection.id,
          context: this.$gc
        })
      } catch (error) {
        this.$notify.queue('error', this.$t('Unable to publish draft'))
      }

      this.load(this.collection.id);
    },
    async restore (versionId) {
      const response = await this.$gc.versions.restore(versionId, {
        type: 'collections'
      });
      this.loading = true
      await this.$router.push({
        name: 'collections.edit.details',
        params: {
          id: response.data.id
        }
      })
      this.load(response.data.id);
    }
  },
  computed: {
    title () {
      return this.collection ? this.attribute(this.collection.attribute_data, "name") : 'Loading...'
    },
    collection () {
      return this.$store.state.collections.model
    },
    isDraft () {
      return this.$store.state.collections.isDraft
    },
    liveId () {
      return this.$store.state.collections.liveId
    },
    previewUrl() {
      return this.config.preview_url.replace(':id', this.collection.id) || null
    },
    config () {
      return this.$store.state.collections.config
    }
  }
}
</script>
