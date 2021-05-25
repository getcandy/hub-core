<template>
  <div>
    <main-nav />
    <div class="xl:ml-72">
      <div>
        <nuxt v-if="!$slots.default" />
        <slot v-else />
      </div>
      <footer class="mt-8 mb-12 ml-24 mr-12">
        <div class="flex items-center justify-end">
          <get-candy-stamp class="w-6 mr-2" />
          <a href="https://www.getcandy.io/" class="text-sm text-gray-500" target="_blank" rel="noopener">GetCandy Hub v{{ apiVersion }}</a>
        </div>
      </footer>
      <div v-if="notify.pending.length" class="fixed bottom-0 right-0 z-50 flex justify-end w-full p-4 pointer-events-none">
        <div class="flex-none">
          <app-notification v-for="(alert, index) in notify.pending" :key="index" :message="alert.message" :level="alert.level" @close="closeNotification(index)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const pjson = require('~/package.json')

export default {
  data () {
    return {
      notify: this.$notify
    }
  },
  computed: {
    apiVersion () {
      return pjson.version
    }
  },
  methods: {
    closeNotification (index) {
      this.notify.clear(index)
    }
  },
  head () {
    return {
      htmlAttrs: {
        class: 'bg-gray-50'
      },
      meta: [
        { hid: 'robots', name: 'robots', content: 'noindex' }
      ]
    }
  },
  middleware: 'acl'
}
</script>
