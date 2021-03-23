<template>
  <div>
    <div v-if="parent" class="mb-4">
      <small class="block">{{ $t(`Creating child category for`) }}</small>
      <strong>{{ parent.name }}</strong>
    </div>
    <form @submit.prevent="save">
      <form-field :label="$t('Category name')" :error="getFirstFormError('name')" required>
        <gc-input v-model="model.name[locale]" @input="setUrl" />
      </form-field>
      <form-field :label="$t('Category URL')" :error="getFirstFormError('url')" required>
        <gc-slug-input v-model="model.url" :initial="model.name[locale]" />
      </form-field>
      <gc-button type="submit" :disabled="processing">
        {{ $t('Create Category') }}
      </gc-button>
    </form>
  </div>
</template>

<script>
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes.js'
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'

export default {
  mixins: [
    HasAttributes,
    HandlesForms
  ],
  props: {
    parent: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      create: false,
      model: this.base(),
      processing: false
    }
  },
  methods: {
    setUrl () {
      if (!this.manualUrl) {
        this.model.url = this.$format.slug(this.model.name[this.locale])
      }
    },
    handleManualUrl (event) {
      this.manualUrl = true
      this.model.url = this.$format.slug(event)
    },
    async save () {
      this.clearFormErrors()
      this.processing = true

      try {
        const data = this.model
        if (this.parent) {
          data.parent = {
            id: this.parent.id
          }
        }
        const response = await this.$gc.categories.post(data)
        this.$notify.queue('success', this.$t('Category created'))
        this.$emit('created', response.data)
        this.$router.push({
          name: 'categories.edit.details',
          params: {
            id: response.data.data.id
          }
        })
        this.model = this.base()
      } catch (e) {
        if (e.response) {
          this.setFormErrors(e.response.data)
        }
        this.$notify.queue('error', this.$t('Unable to create category'))
      }

      this.processing = false
    },
    base () {
      return {
        name: {
          en: ''
        },
        description: {
          en: ''
        },
        url: ''
      }
    }
  }
}
</script>
