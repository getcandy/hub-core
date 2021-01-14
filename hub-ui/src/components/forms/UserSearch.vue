<template>
  <div class="relative" v-click-outside="reset">
    <gc-input v-model="keywords" @input="search" :placeholder="$t('Search users')" />
    <!-- <div v-for="user in users" :key="user.id">
      <gravatar :email="user.email" class="is-rounded" />
    </div> -->
    <div class="absolute w-full mt-1 bg-white rounded-md shadow-lg" v-if="users.length">
      <nav tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3" class="py-1 overflow-auto text-base rounded-md max-h-56 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        <!--
          Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

          Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"
        -->
        <button @click="choose(user)" role="option" class="relative block w-full py-2 pl-3 text-gray-900 cursor-pointer select-none focus:outline-none pr-9 hover:bg-gray-100" v-for="user in users" :key="user.id">
          <div class="flex items-center">
            <gravatar :email="user.email" class="flex-shrink-0 w-6 h-6 rounded-full" />
            <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
            <span class="block ml-3 font-normal truncate">
              {{ user.email }}
            </span>
          </div>
        </button>

        <!-- More items... -->
      </nav>
    </div>
  </div>
</template>
<script>
const debounce = require('lodash/debounce')
import Gravatar from 'vue-gravatar'
import ClickOutside from 'vue-click-outside'

export default {
  directives: {
    ClickOutside
  },
  components: {
    Gravatar
  },
  data () {
    return {
      keywords: null,
      users: []
    }
  },
  methods: {
    reset () {
      this.keywords = null
      this.users = []
    },
    choose (user) {
      this.$emit('click', user)
      this.reset()
    },
    search: debounce(async function () {
      const response = await this.$getcandy.on('Users').getUsers(
        null,
        10,
        {
          query: {
            keywords: this.keywords
          }
        }
      )
      this.users = response.data.data
    }, 300)
  }
}
</script>
