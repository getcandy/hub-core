<template>
  <div class="items-center bg-white border-b md:flex">
    <div class="w-full px-4 py-3 md:px-6">
      <div class="items-center md:flex">
        <div
          v-if="heading"
          :class="{
            'w-full md:w-1/2': !$slots.search,
            'w-full md:w-1/4': !!$slots.search
          }"
        >
          <div class="flex items-center">
            <h1 class="font-medium text-gray-600">
              {{ heading }}
            </h1>
            <template v-if="subHeading">
              <b-icon class="text-gray-300" icon="arrow-right-s-line" />
              <div>
                {{ truncate(subHeading) }}
                <slot name="subHeadingExtra" />
              </div>
            </template>
          </div>
        </div>
        <div class="flex items-center flex-grow w-3/4">
          <div v-if="$slots.search" class="w-1/2">
            <slot name="search" />
          </div>
          <div
            v-if="$slots.default"
            class="flex justify-end"
            :class="{
              'w-full': !$slots.search,
              'w-1/2': !!$slots.search,
            }"
          >
            <slot />
          </div>
        </div>
      </div>
      <!-- <div class="toolbar__header">
          <h1 class="toolbar__heading">{{heading}}</h1>
          <span class="toolbar__subheading" v-if="subHeading">
            <b-icon icon="arrow-right-s-line" />
            <span>{{subHeading}}</span>
          </span>
        </div>
        <div class="toolbar__search" v-if="$slots.search">
          <slot name="search" />
        </div>
        <div class="toolbar__slots">
          <slot />
        </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fixed: {
      type: Boolean,
      default: false
    },
    heading: {
      type: String,
      required: true
    },
    subHeading: {
      type: String,
      required: false
    },
    searchBar: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    truncate (string, maxLength = 70) {
      if (!string) { return null }
      if (string.length <= maxLength) { return string }
      return `${string.substring(0, maxLength)}...`
    }
  }
}
</script>
