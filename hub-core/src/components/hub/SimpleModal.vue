<template>
  <div v-show="open" class="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
    <transition
      enter-class="opacity-0"
      enter-active-class="duration-300 ease-out opacity-1"
      enter-to-class="opacity-1"
      leave-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-to-class="opacity-0"
    >
      <div v-show="open">
        <div class="absolute inset-0 bg-gray-900 opacity-75" @click="$emit('close')"></div>
      </div>
    </transition>
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    <transition
      enter-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
      enter-active-class="duration-300 ease-out"
      enter-to-class="translate-y-0 opacity-100 sm:scale-100"
      leave-class="translate-y-0 opacity-100 sm:scale-100"
      leave-active-class="duration-200 ease-in"
      leave-to-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
    >
    <div class="overflow-hidden transition-all transform bg-white rounded-lg shadow-xl sm:max-w-lg sm:w-full">
      <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg font-medium leading-6 text-gray-900" v-if="heading">
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
      <div class="p-4 bg-gray-50 sm:px-6 sm:py-4 sm:flex sm:flex-row-reverse" v-if="confirmable">
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
  }
}
</script>
