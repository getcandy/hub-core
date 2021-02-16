<template>
  <div>
    <div class="flex items-center py-2 bg-white border-b xl:hidden">
      <div class="mx-6">
        <button @click="menuVisible = true"><gc-icon icon="menu-2" class="text-gray-600" /></button>
      </div>
    </div>
    <div class="fixed inset-0 z-20 bg-gray-900 opacity-75 xl:hidden" v-show="menuVisible" @click="menuVisible = false" />
    <div class="fixed top-0 z-50 h-screen overflow-y-auto text-white bg-gray-900 w-72" :class="{
      '-ml-72 md:ml-0': !menuVisible,
      'ml-0': menuVisible
    }">
      <nuxt-link :to="{ name: 'index'}" class="inline-block w-10 m-4">
        <img src="/getcandy-icon.svg" alt="GetCandy" class="w-full">
      </nuxt-link>

      <div class="p-4">
        <div class="mb-4" v-for="(section, handle) in sections" :key="handle">
          <header class="flex items-center mb-2">
            <span class="p-2 mr-3 bg-gray-800 rounded-md"><gc-icon :icon="section.icon" class="text-gray-300" size="sm" /></span>
            <span class="text-sm text-white">{{ section.label }}</span>
          </header>
          <nav class="pl-4 ml-4 space-y-2 text-sm border-l border-gray-800" v-for="(item, itemIndex) in sortedItems(section.items)" :key="itemIndex">
            <main-menu-link :to="item.route" inactive-class="text-gray-400 hover:bg-gray-800 hover:text-white" class="block px-3 py-1 rounded" active-class="text-white bg-purple-500 hover:text-white" >{{ item.label }}</main-menu-link>
          </nav>
        </div>
      </div>
      <div class="pt-4 mx-4 text-sm border-t border-gray-800">
        <main-menu-link :to="{ name: 'settings' }" inactive-class="text-gray-400 hover:bg-gray-800 hover:text-white" class="inline-flex items-center block w-full px-3 py-2 rounded" active-class="text-white bg-purple-500 hover:text-white" >
          <gc-icon icon="settings" size="sm" class="mr-2" /> <span>Settings</span>
        </main-menu-link>
        <main-menu-link :to="{ name: 'recycle-bin' }" inactive-class="text-gray-400 hover:bg-gray-800 hover:text-white" class="inline-flex items-center block w-full px-3 py-2 rounded" active-class="text-white bg-purple-500 hover:text-white" >
          <gc-icon icon="trash" size="sm" class="mr-2" /> <span>Recycle Bin</span>
        </main-menu-link>

        <nuxt-link :to="{ name: 'account' }" class="inline-flex items-center mt-4 ml-2 text-white ">
          <gravatar :email="$auth.user.email" class="inline-block w-8 h-8 mr-3 rounded-full" />
          {{ $auth.user.email }}
        </nuxt-link>
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
    sortedItems (items) {
      return sortBy(items, 'position')
    },
    sectionIsActive (section) {
      return this.$route.path.split('/').includes(section)
    }
  }
}
</script>
