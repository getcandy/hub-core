<template>
  <v-layout>
    <v-flex class="text-center">

      I'm a product, init.

      {{ items }}

    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      items: ['one', 'two', 'three'],
    }
  },
  mounted () {
    this.$nuxt.context.app.$hooks.callHook('card-test', this.items);
  }
}
</script>