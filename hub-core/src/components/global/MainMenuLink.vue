<template>
  <nuxt-link v-bind="$props" v-slot="{ isActive, href, navigate }">
    <a
      v-bind="$attrs"
      v-on="$listeners"
      :href="href"
      @click="navigate"
      :class="isActive ? activeClass : inactiveClass"
    >
      <slot />
    </a>
  </nuxt-link>
</template>

<script lang="ts">
import Vue from 'vue'

const RouterLink = Vue.component('RouterLink')

export default {
  name: 'AppLink',
  props: {
    // @ts-ignore
    ...RouterLink.options.props,
    inactiveClass: String,
  },
}
</script>
