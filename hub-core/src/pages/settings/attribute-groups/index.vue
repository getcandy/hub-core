<template>
  <div>
    <toolbar :heading="$t('Attribute Groups')">
      <gc-button @click="showCreatePanel = true" size="small">{{ $t('Create attribute group') }}</gc-button>
      <quick-view-panel :heading="$t('Create attribute group')" @close="showCreatePanel = false" :open="showCreatePanel">
        <form  @submit.prevent="create" class="p-6">
          <div class="mb-4">
            <header class="mb-1 font-bold text-gray-700 text-sm">
              <label>{{ $t('Name') }}</label>
            </header>
            <div>
              <gc-input
                v-model="newName"
                :placeholder="$t('The display name of the attribute group')"
                required
              >
              </gc-input>
            </div>
            <div class="text-red-600 text-xs" v-if="hasFormError('name')">
              {{ getFirstFormError('name') }}
            </div>
          </div>
          <div class="mb-4">
            <header class="mb-1 font-bold text-gray-700 text-sm">
              <label>{{ $t('Handle') }}</label>
            </header>
            <div>
              <!--<gc-input
                v-model="newHandle"
                :placeholder="$t('The handle of the attribute group')"
                required
              >
              </gc-input>-->
              <handle-input v-model="newHandle" @raw="rawHandle = $event"/>
            </div>
            <div class="text-gray-600 text-xs mt-2" v-if="rawHandle != newHandle">
              This will be sanitized to <span class="font-mono font-bold">{{ newHandle }}</span>
            </div>
            <div class="text-red-600 text-xs" v-if="hasFormError('handle')">
              {{ getFirstFormError('handle') }}
            </div>
          </div>
          <footer>
            <gc-button type="submit" @click="showCreatePanel = true" size="small">{{ $t('Create attribute group') }}</gc-button>
          </footer>
        </form>
      </quick-view-panel>
    </toolbar>

    <div class="search-table">
      <div class="b-table">
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Handle</th>
            </tr>
          </thead>
          <tbody v-sortable="{
            handle: '.sorter',
            group: 'root',
            onEnd: this.reorder,
            animation: 150,
          }">
            <tr v-for="(group, index) in groups" :key="group.id">
              <td>
                <div class="sorter cursor-grab">
                  <svg width="13px" viewBox="0 0 13 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Artboard" fill="#ABABAB">
                        <rect id="Rectangle" x="2" y="2" width="3" height="3"></rect>
                        <rect id="Rectangle-Copy-2" x="2" y="8" width="3" height="3"></rect>
                        <rect id="Rectangle-Copy-4" x="2" y="14" width="3" height="3"></rect>
                        <rect id="Rectangle-Copy-5" x="8" y="14" width="3" height="3"></rect>
                        <rect id="Rectangle-Copy" x="8" y="2" width="3" height="3"></rect>
                        <rect id="Rectangle-Copy-3" x="8" y="8" width="3" height="3"></rect>
                      </g>
                    </g>
                  </svg>
                </div>
              </td>
              <td>
                <nuxt-link :to="{ name: 'settings-attribute-groups-id', params: { id: group.id }}">
                  {{ getLocaleValue(group.name) }}
                </nuxt-link>
              </td>
              <td>{{ group.handle }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script>
const get = require('lodash/get')
const map = require('lodash/map')
const each = require('lodash/each')
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'
import HubPage from '@getcandy/hub-core/src/mixins/HubPage.js'

export default {
  layout: 'settings',
  mixins: [
    HandlesForms,
    HubPage
  ],
  head () {
    return {
      title: this.$t('Attribute Groups')
    }
  },
  data () {
    return {
      groups: [],
      page: 1,
      perPage: 15,
      total: 0,
      showCreatePanel: false,
      showDeleteConfirm: true,
      newName: '',
      newHandle: '',
      rawHandle: ''
    }
  },
  async mounted () {
    await this.fetch()
  },
  methods: {
    getLocaleValue (data) {
      return get(data, this.locale, data.en)
    },
    async create () {
      try {
        const response = await this.$gc.attributeGroups.post({
          name: {
            [this.locale] : this.newName
          },
          handle: this.newHandle
        }, { include: 'attributes'})

        this.groups.push(response.data.data)
        this.rawHandle = ''
        this.newHandle = ''
        this.newName = ''
        this.showCreatePanel = false
        this.$notify.queue('success', this.$t('Group created'))
      } catch (error) {
        const response = error.response
          if (response.status != 422) {
            this.$notify.queue('error', this.$t('Unable to create group'))
          } else {
            this.setFormErrors(response.data)
          }
      }
    },
    async reorder (event) {

      // Take it out the list and re add, then update the positions
      const moved = this.groups[event.oldIndex]
      this.groups.splice(event.oldIndex, 1)
      this.groups.splice(event.newIndex, 0, moved)

      const mapping = {}

      each(this.groups, (group, index) => {
        group.position = index + 1
        mapping[group.id] = group.position
      })

      await this.$gc.attributeGroups.reorder(mapping)

      this.$notify.queue('success', this.$t('Attribute groups order saved'))
    },
    async fetch () {
      const response = await this.$gc.attributeGroups.get({
        all_records: true,
        includes: 'attributes'
      })

      const data = response.data.data

      this.groups = data
    },
    changePage (page) {
      this.page = page
      this.fetch()
    }
  },
  locale () {
    return this.$store.state.core.locale
  }
}
</script>

<style scoped>

</style>
