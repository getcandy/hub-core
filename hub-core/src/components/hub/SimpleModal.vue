<template>
  <div v-show="open" class="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
    <transition
      v-on:enter="overlayEnter"
      v-on:leave="overlayLeave"
    >
      <div v-show="open">
        <div class="absolute inset-0 bg-gray-900 opacity-75" @click="$emit('close')"></div>
      </div>
    </transition>
    <transition
      v-on:enter="panelEnter"
      v-on:leave="panelLeave"
    >
    <div v-show="open" class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900" v-if="heading">
              {{ $t(heading) }}
            </h3>
            <div class="mt-4">
              <p class="text-sm leading-5 text-gray-700">
                <slot />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 p-4 sm:px-6 sm:py-4 sm:flex sm:flex-row-reverse" v-if="confirmable">
        <gc-button @click="$emit('confirmed')" type="button" theme="danger">
          {{ buttonText }}
        </gc-button>
          <gc-button @click="$emit('close')" type="button" theme="gray" class="mr-2">
            Cancel
          </gc-button>
      </div>
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
    open: {
      type: Boolean,
      default: false
    },
    confirmable: {
      type: Boolean,
      default: true
    },
    buttonText: {
      type: String,
      default: 'Confirm'
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
        scale: 0.75,
        duration: 0
      })
      tl.add({
        scale: 1,
        easing: 'spring'
      })
    }
  }
}
</script>
