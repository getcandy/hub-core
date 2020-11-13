<template>
  <b-menu class="side-menu">
    <b-menu-list v-for="(section, handle) in sections" :key="handle" :label="section.title" >
      <b-menu-item tag="router-link" :to="item.route" :label="item.title" v-for="(item, itemKey) in section.items || []" :key="itemKey" >
      </b-menu-item>
    </b-menu-list>
    <b-menu-list label="Actions">
      <b-menu-item label="Logout" @click="logout"></b-menu-item>
    </b-menu-list>
  </b-menu>
</template>

<script>
export default {
  middleware: 'acl',
  data () {
    return {
    }
  },
  methods: {
    logout() {
      this.$auth.logout();
    }
  },
  mounted () {
    // this.$nuxt.context.app.$hooks.callHook('menu', this.sections);
    this.$gc.root.get().then(response => {
      const data = response.data;
      this.$store.commit('setLocale', data.locale)
    });
  },
  computed: {
    sections () {
      return this.$store.state.core.sections
    },
    currentRoute() {
    }
  }
}
</script>
