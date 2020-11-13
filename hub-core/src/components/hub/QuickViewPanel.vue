<template>
  <div>
    <transition
      v-on:enter="overlayEnter"
      v-on:leave="overlayLeave"
    >
    <div
      v-if="open && takeover"
      class="fixed inset-0 opacity-0 bg-gray-900 z-60"
      @click="$emit('close')"
    />
    </transition>
    <transition
      v-on:enter="panelEnter"
      v-on:leave="panelLeave"
    >
    <div class="fixed bg-white right-0 top-0 shadow-2xl z-70 h-full" :class="`${width}`" v-if="open">
      <header class="py-4 px-3 border-b shadow-sm" v-if="heading">
        <div class="flex justify-between">
          <h3 class="text-sm uppercase font-bold" >{{ heading }}</h3>
          <span class="delete" data-dismiss="quickview" @click="$emit('close')"></span>
        </div>
      </header>
      <div :class="bg">
      <slot />
      </div>
      <footer class="bg-white px-3 mt-8">
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
