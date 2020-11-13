<template>
  <nav class="flex">
    <nuxt-link
      :to="{
        name: item.route,
        params: nav.params || {}
      }"
      exact-active-class="border-purple-700 text-purple-700"
      v-for="(item, key) in nav.items"
      :key="key"
      v-html="item.label"
      class="px-10 py-10 text-xs text-gray-500 uppercase font-bold hover:text-purple-700 border-b-4 border-transparent"
    >
    </nuxt-link>
  </nav>
</template>

<script>
export default {
  props: {
    nav: {
      type: Object,
    }
  }
}
</script>
