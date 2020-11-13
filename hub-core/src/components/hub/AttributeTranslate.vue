
<template>
  <div class="attribute-accordian">
    <div class="bg-white">
      <div class="p-6">
        <div class="flex justify-between">
          <gc-button
            theme="gray"
            @click="() => {
              expandAll = !expandAll
              currentGroup = null
            }"
            v-if="attributeGroups.length > 1"
          >
            <template v-if="expandAll">
              {{ $t('Collapse all') }}
            </template>
            <template v-else>
              {{ $t('Expand all') }}
            </template>
          </gc-button>
          <gc-button @click="translating = !translating" icon-left="language" theme="gray">
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
    <div class="flex bg-white border-t text-sm" v-if="translating">
      <div class="w-1/2">
        <div class="flex items-center">
          <div class="relative w-1/2">
            <select v-model="channel" class="appearance-none w-full rounded-none bg-white border-r p-4 focus:outline-none">
              <option
                v-for="chan in channels"
                :value="chan.handle"
                :key="chan.id">
                {{ chan.name }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <div class="relative w-1/2">
            <select v-model="language" class="appearance-none w-full rounded-none bg-white border-r p-4 focus:outline-none">
              <option
                v-for="lang in languages"
                :value="lang.lang"
                :key="lang.id">
                {{ lang.name }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>
      <div class="w-1/2">
        <div class="flex items-center">
          <div class="relative w-1/2">
            <select v-model="translateChannel" class="appearance-none w-full rounded-none bg-white border-r p-4 focus:outline-none">
              <option
                v-for="chan in channels"
                :value="chan.handle"
                :key="chan.id">
                {{ chan.name }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <div class="relative w-1/2">
            <select  class="appearance-none w-full rounded-none bg-white border-r p-4 focus:outline-none">
              <option
                v-for="lang in languages"
                :value="lang.lang"
                :key="lang.id"
              >
                {{ lang.name }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div v-if="hasErrors" class="bg-red-500 text-white px-6 py-3 text-sm">
      Please check missing fields below.
    </div>
    <template v-if="attributeGroups.length == 1">
      <div v-for="group in attributeGroups" :key="group.id" class="flex py-3" >
        <div class="px-6" :class="{ 'w-full' : !translating, 'w-1/2': translating }">
          <localised-attributes @change="handleChange" :attribute-data="attributeData" :language="language" :channel="channel" :attributes="filteredAttributes(group.attributes.data)" :errors="errors" />
        </div>
        <div class="w-1/2 px-6" v-show="translating">
          <localised-attributes @change="handleChange" :attribute-data="attributeData" :attributes="filteredAttributes(group.attributes.data)" :language="translateLanguage" :channel="translateChannel" :errors="errors" />
        </div>
      </div>
    </template>
    <template v-else>
      <div v-for="group in attributeGroups" :key="group.id" class="card">
        <header class="flex bg-gray-100 py-4 px-6 cursor-pointer text-sm items-center uppercase text-gray-600" @click.prevent="currentGroup = (currentGroup === group.id ? null : group.id)">
          <i class="mr-3" :class="`ri-${currentGroup == group.id || expandAll ? 'checkbox-indeterminate-line' : 'add-box-line'}`" />
          <span class="font-bold">{{ getTabLabel(group) }}</span>
        </header>
        <div v-show="currentGroup == group.id || expandAll">
          <div class="flex py-3">
            <div class="px-6" :class="{ 'w-full' : !translating, 'w-1/2': translating }">
              <localised-attributes @change="handleChange" :attribute-data="attributeData" :language="language" :channel="channel" :attributes="filteredAttributes(group.attributes.data)" :errors="errors" />
            </div>
            <div class="w-1/2 px-6" v-show="translating">
              <localised-attributes @change="handleChange" :attribute-data="attributeData" :attributes="filteredAttributes(group.attributes.data)" :language="translateLanguage" :channel="translateChannel" :errors="errors" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- <b-tabs type="is-boxed">
      <b-tab-item :label="getTabLabel(group)" >
        <div class="columns">
          <div class="column">
            <localised-attributes :attribute-data="attributeData" :language="language" :channel="channel" :attributes="filteredAttributes(group.attributes.data)" />
          </div>
          <div v-if="translating" class="column">
            <localised-attributes :attribute-data="attributeData" :attributes="filteredAttributes(group.attributes.data)" :language="translateLanguage" :channel="translateChannel" />
          </div>
        </div>
      </b-tab-item>
    </b-tabs> -->
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
      this.isDefault = (this.channel === this.translateChannel && this.defaultLanguage === this.translateLanguage);
    },
    translateLanguage () {
      this.isDefault = (this.defaultChannel === this.translateChannel && this.defaultLanguage === this.translateLanguage);
    },
    errors () {
      if (this.hasErrors) {
        this.expandAll = true
      }
    }
  },
  mounted () {
    this.channel = find(this.channels, channel => channel.default).handle
    this.language = find(this.languages, lang => lang.default).lang
    const group = first(this.attributeGroups)
    this.currentGroup = group ? group.id : null
    this.originalData = this.normalize(this.attributeData)
  },
  methods: {
    getTabLabel (tab) {
      return get(tab, `name.${this.locale}`, tab.name.en)
    },
    handleChange () {
      this.$emit('changed', this.attributeData)
    },
    filteredAttributes (attributes) {
      return filter(attributes, (att) => {
        return !!this.attributeData[att.handle]
      })
    }
  }
}
</script>
