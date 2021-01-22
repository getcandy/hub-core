<template>
<div>
    <form-field
      v-for="attribute in attributes"
      :label="$t(getLabel(attribute))"
      :key="attribute.handle"
      :errors="getErrors(attribute.handle)"
    >
      <b-input
        :value="getValue(attribute.handle)"
        @input="setValue(attribute.handle, $event)"
        :type="attribute.type"
        v-if="(['text', 'number', 'textarea']).includes(attribute.type)"
      />
      <template v-if="attribute.type == 'select'">
        <!-- <b-autocomplete
          :value="getValue(attribute.handle)"
          @input="setValue(attribute.handle, $event)"
          :placeholder="data[attribute.handle][fallbackChannel][fallbackLanguage]"
          :data="attribute.lookups"
          :open-on-focus="true"
        /> -->
      </template>
      <b-switch
        :value="getValue(attribute.handle)"
        @input="setValue(attribute.handle, $event)"
        v-if="attribute.type == 'toggle'"
      />
      <rich-text
        :value="getValue(attribute.handle)"
        @input="setValue(attribute.handle, $event)"
        @change="(value) => $emit('change', value)"
        v-if="attribute.type == 'richtext'"
      />

      <!-- <b-input
          v-if="(['text', 'number', 'textarea']).includes(attribute.type)"
          :value="get(attribute.handle, 'default')"
          @input="set(attribute.handle, $event, 'default')"
          :required="attribute.required"
          :type="attribute.type"
      ></b-input>
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
      data: this.attributeData // So we can manipulate it
    }
  },
  computed: {
    fallbackLanguage () {
      // Get our default language
      const defaultLang = find(this.languages, lang => lang.default);
      return defaultLang.lang || 'en';
    },
    fallbackChannel () {
      // Get our default language
      const defaultChannel = find(this.channels, channel => channel.default);
      return defaultChannel.handle || 'webstore';
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
  methods: {
    getLabel (attribute) {
      return get(attribute, `name.${this.locale}`, attribute.name[this.fallbackLanguage]);
    },
    getErrors (handle) {
      return get(this.errors, `attribute_data.${handle}.${this.channel}.${this.locale}`)
    },
    /**
     * Get the value for an attribute from the attribute data.
     */
    getValue (attributeHandle) {
      // If the attribute doesn't exist for this channel
      return get(this.attributeData, `${attributeHandle}.${this.channel}.${this.language}`)
    },
    setValue (handle, value) {
      if (value) {
        if (!this.attributeData[handle]) {
          this.$set(this.attributeData, handle, {})
        }
        if (!this.attributeData[handle][this.channel]) {
          this.$set(this.attributeData[handle], this.channel, {})
        }
        this.$set(this.attributeData[handle][this.channel], this.language, value)
      } else {
        this.$set(this.attributeData[handle][this.channel], this.language, null)
      }
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped>

</style>
