<template>
  <div>
    <toolbar :heading="$t('Available Groups')" :subHeading="getLocaleValue(group.name)">
      <div class="flex">
        <div>
          <gc-button @click="save" size="small">{{ $t('Save Changes') }}</gc-button>
          <!-- <button  class="inline-flex justify-center w-full rounded-md border border-green-300 px-4 py-2 bg-white text-base leading-6 font-medium text-green-600 shadow-sm hover:text-green-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            {{ $t('Save changes') }}
          </button> -->
        </div>
        <div class="ml-4">
          <button @click="showDeleteConfirm = true" class="inline-flex justify-center w-full rounded-md border border-transparent px-1 py-1 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            <b-icon icon="delete-bin-line" />
          </button>
        </div>
      </div>
    </toolbar>
    <div class="bg-white shadow">
      <div class="p-6">
        <basic-translate v-model="fields" />
        <hr />
        <h2 class="subtitle">{{ $t('Attributes') }}</h2>
          <div class="mt-4 text-blue-500" v-if="!attributes.length">
            <div class="bg-blue-100 text-blue-700 p-4 rounded text-sm border-l-4 border-blue-500">
            {{ $t('Attributes can be assigned to groups by editing the attribute directly') }}
            </div>
          </div>
      </div>

      <div class="search-table" v-if="attributes.length">
        <div class="b-table">
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Handle</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody v-sortable="{
              handle: '.sorter',
              group: 'root',
              onEnd: this.reorder,
              animation: 150,
            }">
              <tr v-for="(attribute, index) in attributes" :key="attribute.id" :class="{ 'bg-gray-100' : index % 2 }">
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
                  <nuxt-link :to="{ name: 'settings-attributes-id', params: { id: attribute.id }}">
                    {{ getLocaleValue(attribute.name) }}
                  </nuxt-link>
                </td>
                <td>{{ attribute.handle }}</td>
                <td>{{ attribute.type }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <simple-modal heading="Permanent delete" :open="!!(showDeleteConfirm && !attributes.length)" @confirmed="deleteGroup" @close="showDeleteConfirm = false">
      {{ $t('Are you sure you want to delete this record? This action cannot be undone.') }}
    </simple-modal>
    <simple-modal heading="Unable to delete" :open="!!(showDeleteConfirm && attributes.length)" @confirmed="showDeleteConfirm = false" @close="showDeleteConfirm = false">
      {{ $t('You cannot delete an attribute group that contains attributes, please update the affected attributes and try again.') }}
    </simple-modal>
  </div>
</template>

<script>
  const get = require('lodash/get')
  const each = require('lodash/each')
  import HasLocalisedValues from '@getcandy/hub-core/src/mixins/HasLocalisedValues'

  export default {
    layout: 'settings',
    mixins: [
      HasLocalisedValues
    ],
    head () {
      return {
        title: this.getLocaleValue(this.group.name)
      }
    },
    data() {
      return {
        lookups: [],
        showDeleteConfirm: false
      }
    },
    async asyncData({ app, params }) {
      const response = await app.$gc.attributeGroups.find(params.id, {
        include: 'attributes'
      })
      return {
        group: response.data.data,
        attributes: response.data.data.attributes.data,
        fields: {
          name: {
            values: response.data.data.name,
            type: 'text',
          }
        }
      }
    },
    methods: {
      async save () {
        try {
          await this.$gc.attributeGroups.put(this.group.id, {
            name: this.group.name
          })
          this.$notify.queue('success', this.$t('Attribute group saved'))
        } catch (e) {
          this.$notify.queue('error', this.$t('Unable to save Attribute group'))
        }
      },
      async deleteGroup (id) {
        try {
          await this.$gc.attributeGroups.delete(this.group.id)
          await this.$router.replace({
            name: 'settings-attribute-groups'
          })
          this.$notify.queue('success', this.$t('Group deleted'))
        } catch (error) {
          this.$notify.queue('error', this.$t('Unable to delete group'))
        }

      },
      async reorder (event) {

        // Take it out the list and re add, then update the positions
        const moved = this.attributes[event.oldIndex]
        this.attributes.splice(event.oldIndex, 1)
        this.attributes.splice(event.newIndex, 0, moved)

        const mapping = {}

        each(this.attributes, (attribute, index) => {
          attribute.position = index + 1
          mapping[attribute.id] = attribute.position
        })

        await this.$gc.attributes.reorder(mapping)

        this.$notify.queue('success', this.$t('Attributes order saved'))
      }
    }
  }
</script>

<style scoped>

</style>
