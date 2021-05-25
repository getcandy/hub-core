
<template>
  <div class="attribute-accordian">
    <div class="bg-white">
      <div class="px-6 py-4">
        <div class="flex justify-between">
          <gc-button
            v-if="attributeGroups.length > 1"
            theme="gray"
            @click="() => {
              expandAll = !expandAll
              currentGroup = null
            }"
          >
            <template v-if="expandAll">
              {{ $t('Collapse all') }}
            </template>
            <template v-else>
              {{ $t('Expand all') }}
            </template>
          </gc-button>
          <gc-button icon-left="language" theme="gray" @click="translating = !translating">
            <template v-if="translating">
              {{ $t('Stop Translating') }}
            </template>
            <template v-else>
              {{ $t('Translate') }}
            </template>
          </gc-button>
        </div>
      </div>

      <!-- Translate dropdown -->
      <div v-if="translating" class="flex text-sm bg-white border-t">
        <div class="w-1/2">
          <div class="flex items-center">
            <div class="relative w-1/2">
              <select v-model="channel" class="w-full p-4 bg-white border-r rounded-none appearance-none focus:outline-none">
                <option
                  v-for="chan in channels"
                  :key="chan.id"
                  :value="chan.handle"
                >
                  {{ chan.name }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
            <div class="relative w-1/2">
              <select v-model="language" class="w-full p-4 bg-white border-r rounded-none appearance-none focus:outline-none">
                <option
                  v-for="lang in languages"
                  :key="lang.id"
                  :value="lang.code"
                >
                  {{ lang.name }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>
        </div>
        <div class="w-1/2">
          <div class="flex items-center">
            <div class="relative w-1/2">
              <select v-model="translateChannel" class="w-full p-4 bg-white border-r rounded-none appearance-none focus:outline-none">
                <option :value="null">
                  {{ $t('Please select') }}
                </option>
                <option
                  v-for="chan in channels"
                  :key="chan.id"
                  :value="chan.handle"
                >
                  {{ chan.name }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
            <div class="relative w-1/2">
              <select v-model="translateLanguage" class="w-full p-4 bg-white border-r rounded-none appearance-none focus:outline-none">
                <option :value="null">
                  {{ $t('Please select') }}
                </option>
                <option
                  v-for="lang in languages"
                  :key="lang.id"
                  :value="lang.code"
                >
                  {{ lang.name }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasErrors" class="px-6 py-3 text-sm text-white bg-red-500">
      Please check missing fields below.
    </div>
    <template v-if="attributeGroups.length == 1">
      <div v-for="group in attributeGroups" :key="group.id" class="flex py-3 bg-white">
        <div class="px-6" :class="{ 'w-full' : !translating, 'w-1/2': translating }">
          <localised-attributes
            :attribute-data="attributeData"
            :language="language"
            :channel="channel"
            :attributes="filteredAttributes(group.attributes.data)"
            :errors="errors"
            @change="handleChange"
          />
        </div>
        <div v-show="translating" class="w-1/2 px-6">
          <localised-attributes
            :attribute-data="attributeData"
            :attributes="filteredAttributes(group.attributes.data)"
            :language="translateLanguage"
            :channel="translateChannel"
            :errors="errors"
            @change="handleChange"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <div v-for="group in attributeGroups" :key="group.id" class="card">
        <header class="flex items-center px-6 py-4 text-sm text-gray-600 uppercase bg-gray-100 cursor-pointer" @click.prevent="currentGroup = (currentGroup === group.id ? null : group.id)">
          <i class="mr-3" :class="`ri-${currentGroup == group.id || expandAll ? 'checkbox-indeterminate-line' : 'add-box-line'}`" />
          <span class="font-bold">{{ getTabLabel(group) }}</span>
        </header>
        <div v-show="currentGroup == group.id || expandAll">
          <div class="flex py-3">
            <div class="px-6" :class="{ 'w-full' : !translating, 'w-1/2': translating }">
              <localised-attributes
                :attribute-data="attributeData"
                :language="language"
                :channel="channel"
                :attributes="filteredAttributes(group.attributes.data)"
                :errors="errors"
                @change="handleChange"
              />
            </div>
            <div v-show="translating && translateLanguage && translateChannel" class="w-1/2 px-6">
              <localised-attributes
                :attribute-data="attributeData"
                :attributes="filteredAttributes(group.attributes.data)"
                :language="translateLanguage"
                :channel="translateChannel"
                :errors="errors"
                @change="handleChange"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { filter, get, find, first } from 'lodash'
import NormalizesOBjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'

export default {
  mixins: [
    NormalizesOBjects
  ],
  props: {
    request: {
      type: Object,
      default: () => {}
    },
    attributeGroups: {
      type: Array,
      default: () => []
    },
    errors: {
      type: Object,
      default: () => {}
    },
    attributes: {
      type: Array,
      default: () => []
    },
    attributeData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isDefault: true,
      originalData: [],
      language: null,
      translateLanguage: null,
      channel: null,
      translateChannel: null,
      translating: false,
      currentGroup: null,
      expandAll: true
    }
  },
  computed: {
    languages () {
      return this.$store.state.core.languages
    },
    channels () {
      return this.$store.state.core.channels
    },
    hasErrors () {
      return this.errors ? !!Object.keys(this.errors).length : false
    }
  },
  watch: {
    translateChannel () {
      this.isDefault = (this.channel === this.translateChannel && this.defaultLanguage === this.translateLanguage)
    },
    translateLanguage () {
      this.isDefault = (this.defaultChannel === this.translateChannel && this.defaultLanguage === this.translateLanguage)
    },
    errors () {
      if (this.hasErrors) {
        this.expandAll = true
      }
    }
  },
  mounted () {
    this.channel = find(this.channels, channel => channel.default).handle
    this.language = find(this.languages, lang => lang.default).code
    const group = first(this.attributeGroups)
    this.currentGroup = group ? group.id : null
    this.originalData = this.normalize(this.attributeData)
  },
  methods: {
    getTabLabel (tab) {
      return get(tab, `name.${this.locale}`, tab.name.en)
    },
    handleChange (value) {
      this.$emit('changed', value)
    },
    filteredAttributes (attributes) {
      return filter(attributes, (att) => {
        return !!this.attributeData[att.handle]
      })
    }
  }
}
</script>
