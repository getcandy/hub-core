<template>
  <div class="flex h-screen w-full items-center justify-center bg-gray-900">
    <div class="w-1/3">
      <div class="bg-white shadow rounded">
        <header class="px-4 py-3 flex items-center border-b justify-between">
          <div class="flex items-center">
            <img src="/getcandy-icon.svg" alt="GetCandy" class="w-8 mr-2">
            <span class="text-gray-600">{{ $t('Something went wrong!') }}</span>
          </div>
          <NuxtLink to="/" class="px-3 py-2 text-xs leading-4 disabled:cursor-not-allowed inline-flex items-center border border-transparent font-medium rounded-md  focus:outline-none transition ease-in-out duration-150 text-gray-700 border-gray-400 hover:bg-gray-200 focus:border-gray-700 focus:shadow-outline-gray">
            {{ $t('Start again') }}
          </NuxtLink>
        </header>
        <div class="p-4">
          <div class="bg-gray-200 rounded font-mono p-3">
            {{ error.message }}
          </div>
          <div class="mt-2">
            <div class="text-center">
              <a :href="issueLink" target="_blank" class="px-3 py-2 mt-2 text-xs leading-4 disabled:cursor-not-allowed inline-flex items-center border border-transparent font-medium rounded-md  focus:outline-none transition ease-in-out duration-150 text-gray-700 border-gray-400 hover:bg-gray-200 focus:border-gray-700 focus:shadow-outline-gray">Create issue on Github</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="text-center relative">
      <template v-if="error.statusCode != 404">
        <div class="rounded ">
          <header class="rounded-t font-bold text-sm bg-red-500 text-white px-4 py-2 text-left">
           {{ $t('Internal Server Errorssss') }}
          </header>
          <div class="border border-t-none p-6 rounded-b border-red-500 text-red-800">
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
    if (state.error) {
      return state.error.statusCode == '404' ? 'default' : 'auth';
    }
    return 'auth'
  },
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  created () {
    this.$store.commit('setError', this.error)
  },
  computed: {
    route () {
      return this.$route;
    },
    issueLink () {
      const query = `title=${this.error.message}&labels=bug&body=Page%0A${this.route.name}%0A%0ASteps to reproduce:`;
      return `https://github.com/getcandy/hub/issues/new?${query}`;
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  }
}
</script>
