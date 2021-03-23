<template>
  <div />
</template>

<script>
import Gravatar from 'vue-gravatar'

export default {
  components: {
    Gravatar
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
      return this.$store.state.core.sections
    },
    languages () {
      return this.$store.state.core.languages
    }
  },
  mounted () {
    // this.$nuxt.context.app.$hooks.callHook('menu', this.sections);
    this.$gc.root.get().then((response) => {
      const data = response.data
      this.$store.commit('setLocale', data.locale)
    })
  },
  methods: {
    logout () {
      this.$auth.logout().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    setLocale (val) {
      this.$store.commit('setLocale', val)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~bulma/sass/utilities/_all";

  .nav-bar {
    box-shadow: 0px 2px 4px rgba(0,0,0,.1);
  }
  .nav-section-links {
    background-color: #E6E6E6;
    a {
      display:inline-block;
      color: #656161;
      padding: .5em 15px;
      &.nuxt-link-active {
        border-radius:4px;
        background-color: $blue;
        color: $white;
      }
    }
  }
</style>
