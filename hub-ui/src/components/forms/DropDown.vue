<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
<div class="relative inline-block text-left" v-click-outside="() => menuVisible = false">
  <div>
    <button @click="menuVisible = !menuVisible" type="button" class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="options-menu" aria-haspopup="true" aria-expanded="true">
      {{ label }}
      <!-- Heroicon name: chevron-down -->
      <svg class="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

  <!--
    Dropdown panel, show/hide based on dropdown state.

    Entering: "transition ease-out duration-100"
      From: "transform opacity-0 scale-95"
      To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
      From: "transform opacity-100 scale-100"
      To: "transform opacity-0 scale-95"
  -->
  <div class="absolute right-0 z-50 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5" v-show="menuVisible">
    <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
      <slot/>
      <!-- <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Account settings</a>
      <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Support</a>
      <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">License</a>
      <form method="POST" action="#">
        <button type="submit" class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
          Sign out
        </button>
      </form> -->
    </div>
  </div>
</div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  directives: {
    ClickOutside
  },
  props: {
    label: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      menuVisible: false
    }
  }
}
</script>
