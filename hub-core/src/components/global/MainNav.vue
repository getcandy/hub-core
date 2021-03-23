<template>
  <div>
    <div class="flex items-center py-2 bg-white border-b xl:hidden">
      <div class="mx-4">
        <button @click="menuVisible = true">
          <gc-icon icon="menu-2" class="text-gray-600" />
        </button>
      </div>
    </div>
    <div v-show="menuVisible" class="fixed inset-0 z-20 bg-gray-900 opacity-75 xl:hidden" @click="menuVisible = false" />
    <div
      class="fixed top-0 z-50 h-screen overflow-y-auto text-white transition duration-500 ease-in-out transform bg-gray-900 w-72"
      :class="{
        '-translate-x-72 xl:translate-x-0': !menuVisible,
        'translate-x-0': menuVisible
      }"
    >
      <div class="absolute top-0 right-0 mt-4 mr-4 xl:hidden">
        <button @click="menuVisible = false">
          <gc-icon icon="x" />
        </button>
      </div>

      <!-- <nuxt-link :to="{ name: 'index'}" class="inline-block w-10 m-4">
        <img src="/getcandy-icon.svg" alt="GetCandy" class="w-full">
      </nuxt-link> -->

      <div class="px-5 mt-16 xl:mt-8">
        <div class="pb-4 mb-4 border-b border-gray-800">
          <main-menu-link :to="{ name: 'order-processing.dashboard' }" inactive-class="text-gray-300 hover:bg-gray-800 hover:text-white" class="flex items-center px-3 py-2 text-sm rounded" active-class="text-white bg-purple-500 hover:text-white">
            <gc-icon icon="gauge" class="mr-2" size="sm" />
            <span>Dashboard</span>
          </main-menu-link>
        </div>

        <div v-for="(section, handle) in sections" :key="handle" class="mb-4">
          <header class="flex items-center mb-2">
            <span class="p-2 mr-3 bg-gray-800 rounded-md"><gc-icon :icon="section.icon" class="text-gray-300" size="sm" /></span>
            <span class="text-sm text-white">{{ section.label }}</span>
          </header>
          <nav v-for="(item, itemIndex) in availableItems(section.items)" :key="itemIndex" class="pl-4 ml-4 space-y-2 text-sm border-l border-gray-800">
            <main-menu-link v-if="item.route" :to="item.route" inactive-class="text-gray-400 hover:bg-gray-800 hover:text-white" class="block px-3 py-1 rounded" active-class="text-white bg-purple-500 hover:text-white">
              {{ item.label }}
            </main-menu-link>
            <a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer" class="flex items-center block px-3 py-1 text-gray-400 rounded hover:bg-gray-800 hover:text-white">
              <span class="mr-1">{{ item.label }}</span> <gc-icon icon="external-link" size="sm" />
            </a>
          </nav>
        </div>
      </div>
      <div class="pt-4 mx-4 mb-12 text-sm border-t border-gray-800">
        <main-menu-link :to="{ name: 'settings' }" inactive-class="text-gray-400 hover:bg-gray-800 hover:text-white" class="inline-flex items-center block w-full px-3 py-2 rounded" active-class="text-white bg-purple-500 hover:text-white">
          <gc-icon icon="settings" size="sm" class="mr-2" /> <span>Settings</span>
        </main-menu-link>
        <main-menu-link :to="{ name: 'recycle-bin' }" inactive-class="text-gray-400 hover:bg-gray-800 hover:text-white" class="inline-flex items-center block w-full px-3 py-2 rounded" active-class="text-white bg-purple-500 hover:text-white">
          <gc-icon icon="trash" size="sm" class="mr-2" /> <span>Recycle Bin</span>
        </main-menu-link>

        <div class="flex items-center mt-5 ">
          <nuxt-link :to="{ name: 'account' }" class="inline-flex items-center w-4/5 ml-2 mr-2 text-gray-400 hover:text-white">
            <gravatar :email="$auth.user.email" class="inline-block w-8 h-8 mr-3 rounded-full" />
            <span class="block truncate">{{ authName }}</span>
          </nuxt-link>
          <button class="text-gray-600 hover:text-red-500" @click="$auth.logout()">
            <gc-icon icon="logout" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Gravatar from 'vue-gravatar'
const sortBy = require('lodash/sortBy')
const filter = require('lodash/filter')

export default {

  components: {
    Gravatar
  },
  data () {
    return {
      current: null,
      menuVisible: false
    }
  },
  computed: {
    authName () {
      return this.user.name || this.user.email
    },
    user () {
      return this.$auth.user
    },
    currentSection () {
      const segments = this.$route.path.split('/')
      return segments[1]
    },
    currentRoutes () {
      return this.sections[this.currentSection].items
    },
    sections () {
      return filter(this.$store.state.core.sections, section => section.items.length)
    },
    languages () {
      return this.$store.state.core.languages
    }
  },
  methods: {
    availableItems (items) {
      return sortBy(filter(items, (item) => {
        return this.$auth.user.can(item.access)
      }), 'position')
    },
    sectionIsActive (section) {
      return this.$route.path.split('/').includes(section)
    }
  }
}
</script>
