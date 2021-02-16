<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center">
      <i class="ri-loader-5-line text-3xl spin-fast" />
    </div>
    <div v-else>
      <div>
        <header class="mb-2 font-bold text-gray-700 text-sm">
          <label>{{ $t('Product family') }}</label>
          <p class="text-red-600 leading-tight text-xs font-normal">
            {{ $t('Changing product family may lead to loss of data') }}
          </p>
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
  mixins: [
    HasAttributes
  ],
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      familyId: null,
      familyName: null,
      families: () => []
    }
  },
  computed: {
    family () {
      return this.product.family.data
    }
  },
  mounted () {
    this.familyId = this.family ? this.family.id : null
    this.familyName = this.family ? this.family.name : null
    this.loading = false
  },
  methods: {
    async searchFamilies (keywords) {
      const response = await this.$gc.productFamilies.get({
        keywords
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
