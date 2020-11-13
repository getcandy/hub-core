<template>
  <div>
      <div v-for="group in groups" :key="group.id" class="flex">
          <div class="w-1/2 border-r">
            <div class="flex justify-between py-2 px-6 bg-gray-200">
              <h2 class="text-gray-600 text-sm font-medium ">{{ getLocaleValue(group.name) }}</h2>
              <button @click="removeAll(group.id)" v-if="assigned(group.attributes.data).length" class="text-gray-500 text-xs font-medium uppercase hover:text-red-600">Remove all</button>
            </div>
            <div class="bg-gray-100  h-full">
              <div class="px-6 bg-white py-2 border-b" v-for="attribute in assigned(group.attributes.data)" :key="attribute.id">
                <div class="flex items-center justify-between">
                  {{ getLocaleValue(attribute.name) }}
                  <button v-if="!attribute.system" @click="remove(attribute.id)" class="bg-gray-200 text-gray-600 text-xs font-medium rounded-lg px-2 py-1 uppercase hover:bg-gray-300">Remove</button>
                  <span class="inline-flex text-orange-400 mr-6" v-else>
                    <i class="ri-lock-line"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="w-1/2">
            <div class="flex justify-between py-2 px-6 bg-gray-200">
              <h2 class="text-gray-600 text-sm font-medium ">{{ getLocaleValue(group.name) }}</h2>
              <button @click="addAll(group.id)" v-if="available(group.attributes.data).length" class="text-gray-500 text-xs font-medium uppercase hover:text-green-600 disabled:opacity-75">Add all</button>
            </div>
            <div class="bg-gray-100 h-full">
              <div class="px-6 bg-white py-2 border-b" v-for="attribute in available(group.attributes.data)" :key="attribute.id">
                <div class="flex items-center justify-between">
                  {{ getLocaleValue(attribute.name) }}
                  <button @click="add(attribute.id)" class="bg-gray-200 text-gray-600 text-xs font-medium rounded-lg px-2 py-1 uppercase hover:bg-gray-300">Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
const orderBy = require('lodash/orderBy')
const each = require('lodash/each')
const filter = require('lodash/filter')
const find = require('lodash/find')
const findIndex = require('lodash/findIndex')
const groupBy = require('lodash/groupBy')
const map = require('lodash/map')

import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'
import HasLocalisedValues from '@getcandy/hub-core/src/mixins/HasLocalisedValues.js'

export default {
  props: {
    value: {
      type: Array
    },
    attributes: {
      type: Array,
      default: () => []
    },
    initialAvailable: {
      type: Array,
      required: true
    },
    groups: {
      type: Array,
      default: () => []
    }
  },
  mixins: [
    NormalizesObjects,
    HasLocalisedValues
  ],
  computed: {
    currentIds () {
      return map(this.value, (att) => att.id)
    }
  },
  methods : {
    order (attributes) {
      return orderBy(attributes, att => att.position)
    },
    assigned (attributes) {
      return filter(attributes, att => this.currentIds.includes(att.id))
    },
    available (attributes) {
      return filter(attributes, att => !this.currentIds.includes(att.id))
    },
    remove (attributeId) {
      const current = this.value
      // Get the index.
      const index = findIndex(current, att => attributeId == att.id)
      const attribute = this.getAttributeById(attributeId)

      if (attribute.system) {
        return;
      }

      current.splice(index, 1)
      this.$emit('input', current)
      this.$emit('changed', current)
    },
    add (attributeId) {
      const current = this.value
      const attribute = this.getAttributeById(attributeId)
      // Is this attribute already in there?
      const index = findIndex(current, att => attribute.id == att.id)

      if (index < 0) {
        current.push(attribute)
        this.$emit('input', current)
        this.$emit('changed', current)
      }
    },
    getAttributeById (attributeId) {
      return find(this.attributes, att => attributeId == att.id)
    },
    getGroupAttributes (groupId) {
      const group = find(this.groups, group => group.id == groupId)
      if (!group) {
        this.$notify.queue('error', this.$t('Unable to find group'))
        return;
      }
      return group.attributes.data
    },
    removeAll (groupId) {
      each (this.getGroupAttributes(groupId), att => {
        this.remove(att.id)
      })
    },

    addAll (groupId) {
      each (this.getGroupAttributes(groupId), att => {
        this.add(att.id)
      })
    }
  }
}
</script>
