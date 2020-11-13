<template>
  <div class="bg-white flex items-center justify-between border-gray-200">
    <div class="flex-1 flex justify-between sm:hidden">
      <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
        Previous
      </button>
      <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
        Next
      </button>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div v-if="showFigures">
        <p class="text-sm leading-5 text-gray-700">
          Showing
          <span class="font-medium">1</span>
          to
          <span class="font-medium">10</span>
          of
          <span class="font-medium">97</span>
          results
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex shadow-sm">
          <button :disabled="currentPage == 1" @click="$emit('page', currentPage - 1)" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150" aria-label="Previous">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
          <template v-if="totalPages <= maxSteps + 1">
            <button v-for="n in totalPages" :key="n" :class="pillClass + ' ' + (totalPages == currentPage ? activeClass : null)">
              {{ n }}
            </button>
          </template>
          <template v-else>
            <button v-for="n in firstSteps" @click="$emit('page', n)" :key="n" :class="pillClass + ' ' + (n == currentPage ? activeClass : null)">
              {{ n }}
            </button>
            <span v-if="!currentPageOutsideSteps" class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700">
            ...
            </span>
            <span v-if="currentPageOutsideSteps" :class="pillClass + ' ' + activeClass">
              {{ currentPage }}
            </span>
            <button :key="n" @click="$emit('page', totalPages - 2)" :class="pillClass + ' ' + (totalPages - 2 == currentPage ? activeClass : null)">
              {{ totalPages - 2 }}
            </button>
            <button :key="n" @click="$emit('page', totalPages - 1)" :class="pillClass + ' ' + (totalPages - 1 == currentPage ? activeClass : null)">
              {{ totalPages - 1 }}
            </button>
            <button @click="$emit('page', totalPages)" :key="n" :class="pillClass + ' ' + (totalPages == currentPage ? activeClass : null)">
              {{ totalPages }}
            </button>
          </template>
          <button :disabled="currentPage == totalPages" @click="$emit('page', currentPage + 1)" class="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150" aria-label="Next">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeClass: 'bg-blue-100 text-blue-600',
      pillClass: '-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150'
    }
  },
  computed: {
    currentPageOutsideSteps() {
      return this.currentPage > (this.maxSteps / 2) && this.currentPage < (this.totalPages - 2)
    },
    firstSteps () {
      return (this.maxSteps / 2);
    }
  },
  props: {
    showFigures: {
      type: Boolean,
      default: true,
    },
    maxSteps: {
      type: Number,
      default: 6,
    },
    currentPage: {
      type: Number,
      default: 1
    },
    totalPages: {
      type: Number,
      default: 10,
    }
  }
}
</script>
