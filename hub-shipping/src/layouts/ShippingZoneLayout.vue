<template>
  <default-layout>
    <loading-spinner v-if="loading" />
    <div v-else>
      <toolbar :heading="$t('Shipping Zones')" :subHeading="title">
        <gc-button @click="save">
          {{ $t('Save changes') }}
        </gc-button>
      </toolbar>
      <div class="card">
        <div class="tabs tabs-large">
          <ul>
            <nuxt-link
              :to="{
                name: 'shipping-zones.edit.details',
              }"
              exact-active-class="is-active"
              tag="li"
            >
              <a>{{ $t('Details') }}</a>
            </nuxt-link>
            <nuxt-link
              :to="{
                name: 'shipping-zones.edit.countries',
              }"
              exact-active-class="is-active"
              tag="li"
            >
              <a>{{ $t('Countries') }}</a>
            </nuxt-link>
          </ul>
        </div>
        <nuxt />
      </div>
    </div>
  </default-layout>
</template>

<script>
import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js';
import DefaultLayout from '@getcandy/hub-core/src/layouts/Default.vue'

export default {
  mixins: [
    NormalizesObjects
  ],
  components: {
    DefaultLayout
  },
  head () {
    return {
      title: this.title
    }
  },
  data () {
    return {
      loading: true
    }
  },
  methods: {
    async save () {
      await this.$gc.shippingZones.update(this.shippingZone.id, {
        name: this.shippingZone.name,
        countries: this.selectedCountries
      })
      this.$notify.queue('success', this.$t('Shipping Zone saved'))
    }
  },
  async mounted () {
    if (this.shippingZone && (this.shippingZone.id !== this.$route.params.id)) {
      this.$store.commit('shippingZones/setModel', null)
    }
    if (!this.shippingZone) {
      this.loading = true
      const response = await this.$gc.shippingZones.find(this.$route.params.id, {
        include: 'countries',
        full_response: true
      })
      this.$store.commit('shippingZones/setModel', response.data.data)
    }

    this.loading = false
  },
  computed: {
    shippingZone () {
      return this.$store.state.shippingZones.model
    },
    selectedCountries () {
      return this.$store.state.shippingZones.selectedCountries
    },
    channel () {
      return this.$store.state.core.channel
    },
    title () {
      return this.shippingZone ? this.shippingZone.name : null
    },
    locale () {
      return this.$store.state.core.locale
    }
  },
}
</script>
