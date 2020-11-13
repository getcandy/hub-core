<template>
  <default-layout>
    <div class="flex">
      <div class="w-1/5 min-h-screen  bg-gray-300">
        <div>
          <header class="font-bold uppercase text-gray-500 text-xs pt-6 mb-4 px-6">
            {{ $t('Attributes') }}
          </header>
          <div class="text-sm font-medium">
            <nuxt-link :to="{ name: 'settings' }" active-class="bg-white text-gray-800 border-purple-500 border-r-4"  class="block px-6 py-4 text-gray-700 hover:text-gray-800 hover:bg-white">{{ $t('Available Attributes') }}</nuxt-link>
            <nuxt-link :to="{ name: 'settings-attribute-groups' }" active-class="bg-white text-gray-800 border-purple-500 border-r-4" class="block px-6 py-4 text-gray-700 hover:text-gray-800 hover:bg-white">{{ $t('Attribute Groups') }}</nuxt-link>
          </div>
        </div>

        <div v-for="(section, index) in additionalSections" :key="index">
          <header class="font-bold uppercase text-gray-500 text-xs pt-6 mb-4 px-6">
            {{ $t(section.title) }}
          </header>
          <div class="text-sm font-medium">
            <nuxt-link
              v-for="(route, index) in section.routes"
              :to="route.route"
              :key="index"
              active-class="bg-white text-gray-800 border-purple-500 border-r-4"
              class="block px-6 py-4 text-gray-700 hover:text-gray-800 hover:bg-white"
            >
              {{ $t(route.title) }}
            </nuxt-link>
          </div>
        </div>



        <!--<b-menu-list :label="$t('API Settings')">
          <b-menu-item
            tag="nuxt-link"
            v-for="(setting, index) in settings"
            :key="index"
            :to="{ name: 'settings-api-handle', params : { handle: setting.handle } }"
            :label="$t(setting.name)"
          ></b-menu-item>
        </b-menu-list>-->
        <!-- <b-menu-list :label="$t('Plugins')">
          <b-menu-item icon="swatchbook" :label="$t('Available Attributes')"></b-menu-item>
          <b-menu-item icon="layer-group" :label="$t('Attribute Groups')"></b-menu-item>
        </b-menu-list> -->
      </div>
      <div class="w-full">
        <nuxt />
      </div>
    </div>
  </default-layout>
</template>

<script>
  import DefaultLayout from '@getcandy/hub-core/src/layouts/Default.vue'
  import { map, get, debounce } from 'lodash'
  export default {
    components: {
      DefaultLayout,
    },
    data() {
      return {
        settings: {},
        additionalSections: [],
      }
      // this.settings = this.$gc.settings.get()
    },
    async mounted() {
      try {
        const settingResponse = await this.$gc.settings.get();
        this.settings = settingResponse.data.data
      } catch {
      }
      this.$nuxt.context.app.$hooks.callHook('settings.sections', this.additionalSections);
    },
    methods: {
    },
    computed: {
      product() {
        return this.$store.state.product.model
      },
      channel() {
        return this.$store.state.core.channel
      },
      locale() {
        return this.$store.state.core.locale
      }
    }
  }
</script>

<style scoped>

</style>
