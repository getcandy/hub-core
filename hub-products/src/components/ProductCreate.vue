
<template>
  <div>
    <form v-if="product" @submit.prevent="save">
      <form-field :label="$t('Product name')" for="name" :error="getFirstFormError('name')" required>
        <gc-input id="name" v-model="product.name[locale]" />
      </form-field>
      <form-field :label="$t('SKU')" :error="getFirstFormError('sku')" for="sku" required>
        <gc-sku-input id="sku" v-model="product.sku" />
      </form-field>
      <div class="mb-4">
        <header class="mb-2 text-sm">
          <label class="block font-bold text-gray-700">{{ $t('Product Family') }}</label>
        </header>
        <div>
          <auto-complete
            v-model="selectedFamily"
            :data="families"
            @select="setProductFamily"
            @search="searchFamilies"
          />
        </div>
      </div>
      <form-field :label="$t('Price')" :error="getFirstFormError('price')" for="price" required>
        <gc-price-input id="price" v-model="product.price" :is-cents="false" />
      </form-field>
      <form-field :label="$t('Stock')" for="stock">
        <gc-input id="stock" v-model="product.stock" type="number" steps="1" />
      </form-field>
      <form-field :label="$t('Slug')" :error="getFirstFormError('url')" for="slug" required>
        <gc-slug-input id="slug" v-model="product.url" :initial="product.name[locale]" />
      </form-field>

      <gc-button :disabled="processing" :loading="processing" type="submit">
        {{ $t('Create product') }}
      </gc-button>
    </form>
  </div>
</template>

<script>
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'
import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes.js'

export default {
  mixins: [
    HasAttributes,
    HandlesForms
  ],
  data () {
    return {
      request: null,
      selectedFamily: null,
      createProduct: false,
      product: null,
      families: [],
      isFetching: false,
      processing: false,
      page: 1
    }
  },
  computed: {
    productName () {
      return this.product.name[this.locale]
    },
    slug () {
      return this.$format.slug(this.product.url)
    },
    productUrl: {
      get () {
        return this.product.url.slugify()
      }
    }
  },
  mounted () {
    this.product = this.baseProduct()
  },
  methods: {
    async save () {
      this.clearFormErrors()
      this.processing = true
      try {
        const data = JSON.parse(
          JSON.stringify(this.product)
        )

        if (!this.productName) {
          delete data.name
        }
        const response = await this.$gc.products.create(data)

        this.$router.push({
          name: 'products.view',
          params: {
            id: response.data.data.id
          }
        })
      } catch (e) {
        this.setFormErrors(e.response.data)
      }

      this.processing = false
    },
    setProductFamily (option) {
      this.product.family_id = option ? option.id : null
    },
    async searchFamilies () {
      const response = await this.$gc.products.families.get({
        page: this.page,
        keywords: this.selectedFamily
      })
      this.families = response.data.data
    },
    baseProduct () {
      return {
        name: {
          [this.locale]: ''
        },
        family_id: null,
        sku: '',
        price: '',
        url: '',
        stock: 1
      }
    }
  }
}
</script>
