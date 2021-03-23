<template>
  <div class="flex items-center justify-between">
    <div v-if="loading">
      <loading-spinner />
    </div>
    <template v-else>
      <div class="text-xl">
        <template v-if="!money">
          {{ $format.number(top) }}  <span v-if="showBottom" class="block text-sm text-gray-500">from {{ $format.number(bottom) }}</span>
        </template>
        <template v-else>
          <span v-html="$format.currency(top)" /> <span v-if="showBottom" class="block text-sm text-gray-500">from <span v-html="$format.currency(bottom)" /></span>
        </template>
      </div>
      <section
        v-if="showBottom"
        class="p-1 text-sm font-bold rounded"
        :class="{
          'text-green-500 bg-green-100' : percentage > 0,
          'text-gray-600 bg-gray-100': percentage == 0,
          'text-red-500 bg-red-100' : percentage < 0
        }"
      >
        <span v-if="percentage == 0">~</span>
        <i v-if="percentage > 0" class="ri-arrow-up-line" />
        <i v-if="percentage < 0" class="ri-arrow-down-line" />
        <span v-html="percentage" />%
      </section>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    top: {
      type: [String, Number],
      default: 0
    },
    bottom: {
      type: [String, Number],
      default: 0
    },
    showBottom: {
      type: Boolean,
      default: true
    },
    money: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    percentage () {
      const newFigure = this.top
      const oldFigure = this.bottom

      if (!newFigure && !oldFigure) {
        return 0
      }

      let percent

      if (!oldFigure) {
        percent = 100
      } else {
        percent = (newFigure - oldFigure) / oldFigure * 100
      }

      return this.$format.number(percent)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~bulma/sass/utilities/_all";
  .metric-box {
    &__comparison {
      font-size: $size-normal;
    }
  }
</style>
