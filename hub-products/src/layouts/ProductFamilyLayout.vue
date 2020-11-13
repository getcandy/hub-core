<template>
  <default-layout>
    <div class="h-screen flex items-center justify-center" v-if="loading">
      <i class="ri-loader-5-line text-3xl spin-fast"></i>
    </div>
    <div v-else>
      <toolbar :heading="family.name" >
        <gc-button @click="save">
          {{ $t('Save changes') }}
        </gc-button>
      </toolbar>
      <nuxt v-if="!loading" />
    </div>
  </default-layout>
</template>

<script>
  const find = require('lodash/find')
  const map = require('lodash/map')
  import DefaultLayout from '@getcandy/hub-core/src/layouts/Default.vue'
  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'
  import HasAttributes from '@getcandy/hub-core/src/mixins/HasAttributes'

  export default {
    mixins: [
      NormalizesObjects,
      HasAttributes
    ],
    components: {
      DefaultLayout
    },
    data () {
      return {
        loading: true,
      }
    },
    computed: {
      family () {
        return this.$store.state.productFamily.model
      }
    },
    async mounted() {
      if (this.family && (this.family.id !== this.$route.params.id)) {
        this.$store.commit('productFamily/setModel', null)
      }
      // If we don't have a family already loaded in the state, get it.
      if (!this.family) {
        this.loading = true
        const response = await this.$gc.productFamilies.find(this.$route.params.id, {
          include: 'attributes.group.attributes',
          full_response: true
        })
        this.$store.commit('productFamily/setModel', response.data.data)
      }

      this.loading = false;
    },
    methods: {
      async save () {
        try {
          await this.$gc.productFamilies.update(this.family.id, {
            name: this.family.name,
            attributes: map(this.family.attributes.data, att => att.id)
          })
        } catch (e) {
          this.$notify.queue('error', this.$t('Unable to save product family'))
          return;
        }
        this.$notify.queue('success', this.$t('Product family updated'))
        // this.$store.commit('productFamily/setModel', this.family)
      }
    }
  }
</script>
