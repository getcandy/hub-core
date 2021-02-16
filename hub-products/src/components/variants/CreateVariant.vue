<template>
  <div class="p-6">
    <form @submit.prevent="create">
      <form-field v-for="(option, handle) in options" :key="handle" :label="$t(getLocaleValue(option.label))" required>
        <b-input v-model="fields.options[handle][locale]" />
      </form-field>

      <form-field :label="$t('Price')" :error="getFirstFormError('variants.0.price')" required>
        <price-input v-model="fields.price" :is-cents="false" />
      </form-field>

      <form-field :label="$t('SKU')" :error="getFirstFormError('variants.0.sku')" required>
        <b-input v-model="fields.sku" />
      </form-field>

      <form-field :label="$t('Inventory')" :error="getFirstFormError('variants.0.inventory')" required>
        <b-input v-model="fields.inventory" />
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
      type: Object,
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
  created () {
    each(this.options, (option, handle) => {
      this.$set(this.fields.options, handle, {})
      this.$set(this.fields.options[handle], this.locale, '')
    })
  },
  destroy () {
    this.fields = {
      sku: '',
      options: {},
      price: '',
      stock: '',
      inventory: ''
    }
  },
  mounted () {
    this.setFormErrors(this.errors)
  },
  methods: {
    async create () {
      this.$emit('saved', this.fields)
    }
  }
}
</script>
