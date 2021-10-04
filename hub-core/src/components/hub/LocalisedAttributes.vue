<template>
  <div>
    <form-field
      v-for="attribute in attributes"
      :key="attribute.handle"
      :label="$t(getLabel(attribute))"
      :errors="getErrors(attribute.handle)"
    >
      <gc-input
        v-if="(['text', 'number', 'textarea']).includes(attribute.type)"
        :value="getValue(attribute.handle)"
        :type="attribute.type"
        @input="setValue(attribute.handle, $event)"
      />
      <template v-if="attribute.type == 'select'">
        <gc-select
          :value="getValue(attribute.handle)"
          @change="setValue(attribute.handle, $event)"
        >
          <option
            v-for="(lookup, lookupIndex) in attribute.lookups"
            :key="lookupIndex"
            :value="lookup.value || lookup"
            :selected="(lookup.value || lookup) === getValue(attribute.handle)"
          >
            {{ lookup.label || lookup }}
          </option>
        </gc-select>
      </template>
      <b-switch
        v-if="attribute.type == 'toggle'"
        :value="getValue(attribute.handle)"
        @input="setValue(attribute.handle, $event)"
      />
      <gc-rich-text
        v-if="attribute.type == 'richtext'"
        :value="getValue(attribute.handle)"
        @input="setValue(attribute.handle, $event)"
        @change="setValue(attribute.handle, $event)"
      />

      <!-- <gc-input
          v-if="(['text', 'number', 'textarea']).includes(attribute.type)"
          :value="get(attribute.handle, 'default')"
          @input="set(attribute.handle, $event, 'default')"
          :required="attribute.required"
          :type="attribute.type"
      ></gc-input>
      <b-autocomplete
          v-model="attributeData[attribute.handle][defaultChannel][defaultLanguage]"
          :data="attribute.lookups"
          :open-on-focus="true"
          v-if="attribute.type == 'select'"
      >
      </b-autocomplete>
      <b-switch
          v-model="attributeData[attribute.handle][defaultChannel][defaultLanguage]"
          v-if="attribute.type == 'toggle'"
      >
      </b-switch>
      <rich-text v-model="attributeData[attribute.handle][defaultChannel][defaultLanguage]" v-if="attribute.type == 'richtext'" /> -->
    </form-field>
  </div>
</template>

<script>
import { get, find } from 'lodash'

export default {
  props: {
    attributes: {
      type: Array,
      required: true
    },
    attributeData: {
      type: Object,
      required: true
    },
    language: {
      type: String,
      default: 'en'
    },
    channel: {
      type: String,
      default: null
    },
    errors: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    fallbackLanguage () {
      // Get our default language
      const defaultLang = find(this.languages, lang => lang.default)
      return defaultLang.code || 'en'
    },
    fallbackChannel () {
      // Get our default language
      const defaultChannel = find(this.channels, channel => channel.default)
      return defaultChannel.handle || 'webstore'
    },
    channels () {
      return this.$store.state.core.channels
    },
    languages () {
      return this.$store.state.core.languages
    },
    locale () {
      return this.$i18n.locale
    }
  },
  mounted () {
    this.data = JSON.parse(
      JSON.stringify(this.attributeData)
    ) // So we can manipulate it
  },
  methods: {
    getLabel (attribute) {
      return get(attribute, `name.${this.locale}`, attribute.name[this.fallbackLanguage])
    },
    getErrors (handle) {
      return get(this.errors, `attribute_data.${handle}.${this.channel}.${this.locale}`)
    },
    /**
     * Get the value for an attribute from the attribute data.
     */
    getValue (attributeHandle) {
      // If the attribute doesn't exist for this channel
      return get(this.data, `${attributeHandle}.${this.channel}.${this.language}`)
    },
    setValue (handle, value) {
      if (value) {
        if (!this.data[handle]) {
          this.$set(this.data, handle, {})
        }
        if (!this.data[handle][this.channel]) {
          this.$set(this.data[handle], this.channel, {})
        }
        this.$set(this.data[handle][this.channel], this.language, value)
      } else {
        this.$set(this.data[handle][this.channel], this.language, null)
      }
      this.$emit('change', this.data)
    }
  }
}
</script>

<style scoped>

</style>
