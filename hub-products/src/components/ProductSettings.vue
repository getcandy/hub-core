<template>
  <div>
      <div class="flex items-center justify-center" v-if="loading">
        <i class="ri-loader-5-line text-3xl spin-fast"></i>
      </div>
      <div v-else>
        <div>
          <header class="mb-2 font-bold text-gray-700 text-sm">
            <label>{{ $t('Product family') }}</label>
            <p class="text-red-600 leading-tight text-xs font-normal">{{ $t('Changing product family may lead to loss of data') }}</p>
          </header>
          <div>
            <auto-complete
              v-model="familyName"
              :data="families"
              @select="setProductFamily"
              @search="searchFamilies"
            />
          </div>
        </div>
        <footer class="mt-4">
          <gc-button @click="save">
            {{ $t('Save settings') }}
          </gc-button>
        </footer>
      </div>
  </div>
</template>

<script>
  import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes.js'

  export default {
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    mixins: [
      HasAttributes
    ],
    data () {
      return {
        loading: true,
        familyId: null,
        familyName: null,
        families: () => []
      }
    },
    mounted () {
      this.familyId = this.family ? this.family.id : null
      this.familyName = this.family ? this.family.name : null
      this.loading = false
    },
    computed: {
      family () {
        return this.product.family.data
      }
    },
    methods: {
      async searchFamilies (keywords) {
        const response = await this.$gc.productFamilies.get({
          keywords: keywords
        })

        this.families = response.data.data
      },
      setProductFamily (family) {
        this.familyId = family.id
      },
      save () {
        this.$emit('save', {
          familyId: this.familyId
        })
      }
    }
  }
</script>
