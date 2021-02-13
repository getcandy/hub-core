<template>
  <div class="wrapper">
    <gc-icon-sprite />
    <main-nav />
    <div class="bg-gray-100 main-body">
      <nuxt v-if="!$slots.default" />
      <slot v-else />
    </div>
    <footer class="mt-8 ml-24 mr-12">
      <div class="flex items-center justify-end">
      <get-candy-stamp class="w-6 mr-2" />
      <a href="https://www.getcandy.io/" class="text-sm text-gray-500" target="_blank" rel="noopener">GetCandy Hub v2.0</a>
      </div>
    </footer>
    <div class="fixed bottom-0 z-50 flex justify-center w-full p-6" v-if="notify.pending.length">
      <div class="flex-none">
        <app-notification v-for="(alert, index) in notify.pending" :key="index" :message="alert.message" :level="alert.level" @close="closeNotification(index)"/>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  head () {
    return {
      htmlAttrs: {
        class: 'bg-gray-200'
      },
      meta: [
        { hid: 'robots', name: 'robots', content: 'noindex' }
      ]
    }
  },
  middleware: 'acl',
  data () {
    return {
      notify: this.$notify
    }
  },
  methods: {
    closeNotification (index) {
      this.notify.clear(index)
    }
  },
  computed: {
    apiVersion () {
      return this.$store.state.core.apiVersion
    }
  }
}
</script>
