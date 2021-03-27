<template>
  <div class="p-6">
    <form @submit.prevent="create">
      <form-field v-for="(option, handle) in options" :key="handle" :label="$t(getLocaleValue(option.label))" required>
        <gc-input v-model="fields.options[handle][locale]" />
      </form-field>

      <form-field :label="$t('Price')" :error="errors['variants.0.price'] ? errors['variants.0.price'][0] : null" required>
        <gc-price-input v-model="fields.price" :is-cents="false" />
      </form-field>

      <form-field :label="$t('SKU')" :error="errors['variants.0.sku'] ? errors['variants.0.sku'][0] : null" required>
        <gc-sku-input v-model="fields.sku" />
      </form-field>

      <form-field :label="$t('Inventory')" :error="errors['variants.0.inventory'] ? errors['variants.0.inventory'][0] : null" required>
        <gc-input v-model="fields.inventory" type="number" />
      </form-field>

      <gc-button>{{ $t('Create option') }}</gc-button>
    </form>
  </div>
</template>
<script>
import HasLocalisedValues from '@getcandy/hub-core/src/mixins/HasLocalisedValues.js'
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'
const each = require('lodash/each')

export default {
  mixins: [
    HasLocalisedValues,
    HandlesForms
  ],
  props: {
    options: {
      type: [Object, Array],
      required: true
    },
    errors: {
      type: Object,
      default: () => {}
    },
    productId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      fields: {
        sku: '',
        options: {},
        price: '',
        stock: '',
        inventory: ''
      }
    }
  },
  computed: {
    locale () {
      return this.$store.state.core.locale
    }
  },
  watch: {
    options: {
      handler () {
        each(this.options, (option, handle) => {
          this.$set(this.fields.options, handle, {})
          this.$set(this.fields.options[handle], this.locale, '')
        })
      },
      deep: true
    }
  },
  created () {
    // eslint-disable-next-line
    each(this.options, (option, handle) => {
      this.$set(this.fields.options, handle, {})
      this.$set(this.fields.options[handle], this.locale, '')
    })
  },
  mounted () {
    this.setFormErrors(this.errors)
  },
  methods: {
    create () {
      this.$emit('saved', this.fields)

      if (!Object.keys(this.errors).length) {
        const fields = {
          sku: '',
          options: {},
          price: '',
          stock: '',
          inventory: ''
        }
        each(this.options, (option, handle) => {
          this.$set(fields.options, handle, {})
          this.$set(fields.options[handle], this.locale, '')
        })
        this.fields = fields
      }
    }
  }
}
</script>
