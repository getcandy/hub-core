<template>
  <div>
    <nav class="main-nav">
      <nuxt-link :to="{ name: 'index'}">
        <img src="/getcandy-icon.svg" alt="GetCandy" class="main-nav__icon">
      </nuxt-link>

      <ul>
        <li
          v-for="item in sections"
          :key="item.handle"
          class="main-nav__item"
          @mouseover="current = item.handle"
          @mouseleave="current = null"
        >
          <div
            class="main-nav__item__icon"
            :class="{
              'main-nav__item__icon--active': sectionIsActive(item.handle),
              'main-nav__item__icon--open': current == item.handle && !sectionIsActive(item.handle),
            }"
          >
            <b-icon :icon="item.icon" />
          </div>
          <span class="main-nav__item__title">{{ $t(item.label) }}</span>
        </li>
        <li class="main-nav__item">
          <nuxt-link :to="{ name: 'settings' }">
            <div
              class="main-nav__item__icon"
              :class="{
                'main-nav__item__icon--active': sectionIsActive('settings')
              }"
            >
              <b-icon icon="settings-4-line" />
            </div>
            <span class="main-nav__item__title">{{ $t('Settings') }}</span>
          </nuxt-link>
        </li>
      </ul>
      <ul class="utility-menu">
        <!--<li class="main-nav__item">
          <div class="main-nav__item__icon">
            <b-icon icon="search-line" />
          </div>
          <span class="main-nav__item__title">{{ $t('Search') }}</span>
        </li>-->
        <li class="main-nav__item">
          <nuxt-link :to="{ name: 'recycle-bin' }">
            <div
              class="main-nav__item__icon"
              :class="{
                'main-nav__item__icon--active': sectionIsActive('recycle-bin')
              }"
            >
              <b-icon icon="delete-bin-line" />
            </div>
            <span class="main-nav__item__title">{{ $t('Recycle Bin') }}</span>
          </nuxt-link>
        </li>
        <!--<li class="main-nav__item">
            <button @click="$auth.logout()" class="main-nav__item__icon main-nav__item__icon--danger">
                <b-icon icon="shut-down-line" />
            </button>
            <span class="main-nav__item__title">{{ $t('Log out') }}</span>
        </li>-->
      </ul>

      <div class="main-nav__profile">
        <nuxt-link :to="{ name: 'account' }">
          <figure class="image is-64x64">
            <gravatar :email="$auth.user.email" class="is-rounded" />
          </figure>
        </nuxt-link>
      </div>
    </nav>

    <nav
      v-for="(section, handle) in sections"
      :key="handle"
      class="sub-nav"
      :class="{ active: current == handle }"
      @mouseover="current = handle"
      @mouseleave="current = null"
    >
      <h3 class="sub-nav__title">
        {{ $t(section.title) }}
      </h3>
      <ul class="sub-nav__items">
        <li v-for="(item, itemIndex) in sortedItems(section.items)" :key="itemIndex" class="sub-nav__item">
          <nuxt-link :to="item.route">
            {{ $t(item.title) }}
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import Gravatar from 'vue-gravatar'
import { sortBy } from 'lodash'

export default {

  components: {
    Gravatar
  },
  data () {
    return {
      current: null
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
      return this.$store.state.core.sections
    },
    languages () {
      return this.$store.state.core.languages
    }
  },
  methods: {
    sortedItems (items) {
      return sortBy(items, 'title')
    },
    sectionIsActive (section) {
      return this.$route.path.split('/').includes(section)
    }
  }
}
</script>
