<template>
  <div>
    <transition
      enter-active-class="duration-200 ease-in-out"
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in-out"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="open"
        class="absolute inset-0 z-40 transition-opacity bg-gray-800 bg-opacity-75"
        @click="$emit('close')"
      />
    </transition>
    <transition
      enter-to-class="translate-x-0"
      enter-active-class="transition duration-100 ease-in-out transform sm:duration-100"
      enter-class="translate-x-full"
      leave-to-class="translate-x-full"
      leave-class="translate-x-0"
      leave-active-class="transition duration-100 ease-in-out transform sm:duration-100"
    >
      <div v-show="open" class="fixed top-0 right-0 z-50 h-full bg-white shadow-2xl" :class="`${width}`">
        <header v-if="heading" class="px-3 py-4 border-b shadow-sm">
          <div class="flex justify-between">
            <h3 class="text-sm font-bold uppercase">
              {{ heading }}
            </h3>
            <span class="delete" data-dismiss="quickview" @click="$emit('close')" />
          </div>
        </header>
        <div :class="containerClass">
          <slot />
        </div>
        <footer class="px-3 mt-8 bg-white">
          <slot name="footer" />
        </footer>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  props: {
    heading: {
      type: String,
      default: null
    },
    takeover: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: 'w-1/5'
    },
    bg: {
      type: String,
      default: 'bg-white'
    },
    open: {
      type: Boolean,
      default: false
    },
    containerClass: {
      type: String,
      default: null
    }
  }
}
</script>
