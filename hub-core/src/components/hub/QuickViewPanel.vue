<template>
  <div>
    <transition
      enter-active-class="duration-500 ease-in-out"
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-500 ease-in-out"
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
      enter-active-class="transition duration-300 ease-in-out transform sm:duration-700"
      enter-class="translate-x-full"
      leave-to-class="translate-x-full"
      leave-class="translate-x-0"
      leave-active-class="transition duration-300 ease-in-out transform sm:duration-700"
    >
    <div class="fixed top-0 right-0 z-50 h-full bg-white shadow-2xl" :class="`${width}`" v-show="open">
      <header class="px-3 py-4 border-b shadow-sm" v-if="heading">
        <div class="flex justify-between">
          <h3 class="text-sm font-bold uppercase" >{{ heading }}</h3>
          <span class="delete" data-dismiss="quickview" @click="$emit('close')"></span>
        </div>
      </header>
      <div>
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
import anime from 'animejs/lib/anime.es.js';

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
      default: 'bg-white',
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    overlayEnter (element, done) {
      anime({
        targets: element,
        opacity: .75,
        easing: 'linear',
        duration: 200,
        complete: () => done()
      });
    },
    overlayLeave (element, done) {
      anime({
        targets: element,
        opacity: 0,
        easing: 'linear',
        duration: 200,
        complete: () => done()
      });
    },
    panelLeave (element, done) {
      anime({
        targets: element,
        translateX: '100%',
        easing: 'easeOutQuint',
        duration: 350,
        complete: () => done()
      });
    },
    panelEnter (element, done) {
      var tl = anime.timeline({
        targets: element,
        easing: 'linear',
        duration: 350
      })
      tl.add({
        translateX: '100%',
        duration: 0
      })
      tl.add({
        translateX: 0,
        easing: 'easeOutQuint'
      })
    }
  }
}
</script>
