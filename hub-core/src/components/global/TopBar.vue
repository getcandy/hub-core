<template>
  <div>
    <b-navbar class="nav-bar" spaced>
      <template slot="brand">
        <b-navbar-item :to="{ path: '/' }" tag="router-link">
          <img src="/getcandy.png">
        </b-navbar-item>
      </template>
      <template slot="start">
        <template v-for="(section, handle) in sections">
          <b-navbar-dropdown v-if="section.items" :key="handle" :label="$t(section.title)">
            <b-navbar-item
              v-if="section.dashboard"
              :key="`${section.handle}-dashboard`"
              :to="{
                name: `${section.handle}.dashboard`
              }"
              tag="router-link"
            >
              Dashboard
            </b-navbar-item>
            <b-navbar-item v-for="(item, itemIndex) in section.items" :key="itemIndex" :to="item.route" tag="router-link">
              {{ $t(item.title) }}
            </b-navbar-item>
          </b-navbar-dropdown>
        </template>
        <!-- <b-navbar-item>
              <div class="search-container ">
                        <div class="search-icon-btn">
                           <b-icon class="is-size-7" icon="search" :both="true" size="is-small" style="display: inline-block;"/>
                        </div>
                        <div class="search-input">
                                <form action="" method="GET"><input type="search" class="search-bar"
                                                          placeholder="Search in..">
                                </form>
                        </div>
                    </div>
            </b-navbar-item> -->
      </template>
      <template slot="end">
        <div class="columns">
          <div class="column">
            <language-picker v-model="$i18n.locale" />
          </div>
          <div class="column">
            <b-dropdown aria-role="list" position="is-bottom-left">
              <b-navbar-item slot="trigger">
                <figure class="image is-32x32 has-margin-top-5">
                  <gravatar :email="user.email" class="is-rounded" />
                </figure>
              </b-navbar-item>
              <b-dropdown-item :has-link="true" aria-role="listitem">
                <nuxt-link :to="{ name: 'recycle-bin' }">
                  Recycling bin
                </nuxt-link>
                <nuxt-link :to="{ name: 'account' }">
                  {{ $t('Profile settings') }}
                </nuxt-link>
                <nuxt-link :to="{ name: 'settings' }">
                  {{ $t('Settings') }}
                </nuxt-link>
              </b-dropdown-item>
              <b-dropdown-item separator />
              <b-dropdown-item class="has-text-danger" aria-role="listitem" @click.native="logout">
                {{ $t('Logout') }}
              </b-dropdown-item>
            </b-dropdown>
            <!-- <b-navbar-item tag="div">
              {{ user.email }}
            </b-navbar-item>
            <b-icon @click.native="logout" icon="lock" /> -->
          </div>
        </div>
      </template>
    </b-navbar>
    <!-- <div class="nav-section-links">
      <div class="container">
        <nuxt-link :to="route.route" v-for="(route, routeIndex) in currentRoutes" :key="routeIndex">{{ route.title }}</nuxt-link>
      </div>
    </div> -->
  </div>
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
