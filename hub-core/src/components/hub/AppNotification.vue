<template>
  <div
    class="py-4 mb-4 text-xs font-medium text-gray-800 bg-white border-l-4 rounded-md shadow-lg"
    :class="{
      'border-blue-500' : level == 'info',
      'border-green-500' : level == 'success',
      'border-red-500' : level == 'error'
    }"
    @mouseover="clearTimeout"
    @mouseleave="startCountdown"
  >
    <div class="flex items-center">
      <div
        class="pl-4"
        :class="{
          'text-blue-500' : level == 'info',
          'text-green-500' : level == 'success',
          'text-red-500' : level == 'error'
        }"
      >
        <template v-if="level == 'info'">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6"><path fill="none" d="M0 0h24v24H0z" /><path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z" /></svg>
        </template>
        <template v-if="level == 'success'">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6"><path fill="none" d="M0 0h24v24H0z" /><path fill="currentColor" d="M11.602 13.76l1.412 1.412 8.466-8.466 1.414 1.414-9.88 9.88-6.364-6.364 1.414-1.414 2.125 2.125 1.413 1.412zm.002-2.828l4.952-4.953 1.41 1.41-4.952 4.953-1.41-1.41zm-2.827 5.655L7.364 18 1 11.636l1.414-1.414 1.413 1.413-.001.001 4.951 4.951z" /></svg>
        </template>
        <template v-if="level == 'error'">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6"><path fill="none" d="M0 0h24v24H0z" /><path fill="currentColor" d="M13 19.9a5.002 5.002 0 0 0 4-4.9v-3a4.98 4.98 0 0 0-.415-2h-9.17A4.98 4.98 0 0 0 7 12v3a5.002 5.002 0 0 0 4 4.9V14h2v5.9zm-7.464-2.21A6.979 6.979 0 0 1 5 15H2v-2h3v-1c0-.643.087-1.265.249-1.856L3.036 8.866l1-1.732L6.056 8.3a7.01 7.01 0 0 1 .199-.3h11.49c.069.098.135.199.199.3l2.02-1.166 1 1.732-2.213 1.278c.162.59.249 1.213.249 1.856v1h3v2h-3c0 .953-.19 1.862-.536 2.69l2.5 1.444-1 1.732-2.526-1.458A6.986 6.986 0 0 1 12 22a6.986 6.986 0 0 1-5.438-2.592l-2.526 1.458-1-1.732 2.5-1.443zM8 6a4 4 0 1 1 8 0H8z" /></svg>
        </template>
      </div>
      <div class="px-4">
        {{ message }}
      </div>
      <button class="px-4 text-gray-500 hover:text-gray-800 focus:outline-none" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4"><path fill="none" d="M0 0h24v24H0z" /><path fill="currentColor" d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" /></svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    index: {
      type: [String, Number],
      default: 0
    },
    level: {
      type: String,
      default: 'info'
    }
  },
  data () {
    return {
      timeout: null
    }
  },
  mounted () {
    this.startCountdown()
  },
  methods: {
    startCountdown () {
      this.timeout = setInterval(() => {
        this.$emit('close')
      }, 3000)
    },
    clearTimeout () {
      clearInterval(this.timeout)
    }
  }
}
</script>
