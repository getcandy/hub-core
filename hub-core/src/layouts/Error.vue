<template>
  <div class="flex items-center justify-center w-full h-screen bg-gray-900">
    <div class="w-1/3">
      <div class="bg-white rounded shadow">
        <header class="flex items-center justify-between px-4 py-3 border-b">
          <div class="flex items-center">
            <img src="/getcandy-icon.svg" alt="GetCandy" class="w-8 mr-2">
            <span class="text-gray-600">{{ $t('Something went wrong!') }}</span>
          </div>
          <NuxtLink to="/" class="inline-flex items-center px-3 py-2 text-xs font-medium leading-4 text-gray-700 transition duration-150 ease-in-out border border-transparent border-gray-400 rounded-md disabled:cursor-not-allowed focus:outline-none hover:bg-gray-200 focus:border-gray-700 focus:shadow-outline-gray">
            {{ $t('Start again') }}
          </NuxtLink>
        </header>
        <div class="p-4">
          <div class="p-3 font-mono bg-gray-200 rounded">
            {{ error.message }}
          </div>
          <div class="mt-2">
            <div class="text-center">
              <a :href="issueLink" target="_blank" class="inline-flex items-center px-3 py-2 mt-2 text-xs font-medium leading-4 text-gray-700 transition duration-150 ease-in-out border border-transparent border-gray-400 rounded-md disabled:cursor-not-allowed focus:outline-none hover:bg-gray-200 focus:border-gray-700 focus:shadow-outline-gray">Create issue on Github</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="relative text-center">
      <template v-if="error.statusCode != 404">
        <div class="rounded ">
          <header class="px-4 py-2 text-sm font-bold text-left text-white bg-red-500 rounded-t">
           {{ $t('Internal Server Errorssss') }}
          </header>
          <div class="p-6 text-red-800 border border-red-500 rounded-b border-t-none">
            {{ error.message }}
          </div>
        </div>
      </template>
      <template v-else>
        <h1 class="text-6xl text-gray-500">{{ error.statusCode }}</h1>
        <p class="mb-4">{{ error.message }}</p>
        <NuxtLink to="/">
          {{ $t('Back to start') }}
        </NuxtLink>
      </template>
    </div> -->
  </div>
</template>

<script>
export default {
  layout: (context) => {
    const state = context.app.store.state
    if (state && state.error) {
      return state.error.statusCode === '404' ? 'default' : 'auth'
    }
    return 'auth'
  },
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  computed: {
    route () {
      return this.$route
    },
    issueLink () {
      const query = `title=${this.error.message}&labels=bug&body=Page%0A${this.route.name}%0A%0ASteps to reproduce:`
      return `https://github.com/getcandy/hub/issues/new?${query}`
    }
  },
  created () {
    this.$store.commit('setError', this.error)
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>
