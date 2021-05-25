<template>
  <div>
    <div v-for="group in groups" :key="group.id" class="flex">
      <div class="w-1/2 border-r">
        <div class="flex justify-between px-6 py-2 bg-gray-200">
          <h2 class="text-sm font-medium text-gray-600 ">
            {{ getLocaleValue(group.name) }}
          </h2>
          <button v-if="assigned(group.attributes.data).length" class="text-xs font-medium text-gray-500 uppercase hover:text-red-600" @click="removeAll(group.id)">
            Remove all
          </button>
        </div>
        <div class="h-full bg-gray-100">
          <div v-for="attribute in assigned(group.attributes.data)" :key="attribute.id" class="px-6 py-2 bg-white border-b">
            <div class="flex items-center justify-between">
              {{ getLocaleValue(attribute.name) }}
              <button v-if="!attribute.system" class="px-2 py-1 text-xs font-medium text-gray-600 uppercase bg-gray-200 rounded-lg hover:bg-gray-300" @click="remove(attribute.id)">
                Remove
              </button>
              <span v-else class="inline-flex mr-6 text-orange-400">
                <i class="ri-lock-line" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="w-1/2">
        <div class="flex justify-between px-6 py-2 bg-gray-200">
          <h2 class="text-sm font-medium text-gray-600 ">
            {{ getLocaleValue(group.name) }}
          </h2>
          <button v-if="available(group.attributes.data).length" class="text-xs font-medium text-gray-500 uppercase hover:text-green-600 disabled:opacity-75" @click="addAll(group.id)">
            Add all
          </button>
        </div>
        <div class="h-full bg-gray-100">
          <div v-for="attribute in available(group.attributes.data)" :key="attribute.id" class="px-6 py-2 bg-white border-b">
            <div class="flex items-center justify-between">
              {{ getLocaleValue(attribute.name) }}
              <button class="px-2 py-1 text-xs font-medium text-gray-600 uppercase bg-gray-200 rounded-lg hover:bg-gray-300" @click="add(attribute.id)">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'
import HasLocalisedValues from '@getcandy/hub-core/src/mixins/HasLocalisedValues.js'

const orderBy = require('lodash/orderBy')
const each = require('lodash/each')
const filter = require('lodash/filter')
const find = require('lodash/find')
const findIndex = require('lodash/findIndex')
const map = require('lodash/map')

export default {
  mixins: [
    NormalizesObjects,
    HasLocalisedValues
  ],
  props: {
    value: {
      type: Array,
      default: () => []
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
  computed: {
    currentIds () {
      return map(this.value, att => att.id)
    }
  },
  methods: {
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
      const index = findIndex(current, att => attributeId === att.id)
      const attribute = this.getAttributeById(attributeId)

      if (attribute.system) {
        return
      }

      current.splice(index, 1)
      this.$emit('input', current)
      this.$emit('changed', current)
    },
    add (attributeId) {
      const current = this.value
      const attribute = this.getAttributeById(attributeId)
      // Is this attribute already in there?
      const index = findIndex(current, att => attribute.id === att.id)

      if (index < 0) {
        current.push(attribute)
        this.$emit('input', current)
        this.$emit('changed', current)
      }
    },
    getAttributeById (attributeId) {
      return find(this.attributes, att => attributeId === att.id)
    },
    getGroupAttributes (groupId) {
      const group = find(this.groups, group => group.id === groupId)
      if (!group) {
        this.$notify.queue('error', this.$t('Unable to find group'))
        return
      }
      return group.attributes.data
    },
    removeAll (groupId) {
      each(this.getGroupAttributes(groupId), (att) => {
        this.remove(att.id)
      })
    },

    addAll (groupId) {
      each(this.getGroupAttributes(groupId), (att) => {
        this.add(att.id)
      })
    }
  }
}
</script>
