<template>
  <div class="flex items-center justify-between">
    <div class="text-xl">
      <template v-if="!money">
        {{ $format.number(top) }}  <span class="text-gray-500 text-sm block">from {{ $format.number(bottom) }}</span>
      </template>
      <template v-else>
        <span v-html="$format.currency(top)" /> <span class="text-gray-500 text-sm block">from <span v-html="$format.currency(bottom)" /></span>
      </template>
    </div>
    <section class="rounded p-1 text-sm font-bold" :class="{
      'text-green-500 bg-green-100' : percentage > 0,
      'text-gray-600 bg-gray-100': percentage == 0,
      'text-red-500 bg-red-100' : percentage < 0
    }">
      <span v-if="percentage == 0">~</span>
      <i class="ri-arrow-up-line" v-if="percentage > 0"></i>
      <i class="ri-arrow-down-line" v-if="percentage < 0"></i>
      <span v-html="percentage" />%
    </section>
  </div>
</template>

<script>
  export default {
    props: {
      top: {
        type: Number,
        default: 0
      },
      bottom: {
        type: Number,
        default: 0
      },
      money: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      percentage () {
        const newFigure = this.top
        const oldFigure = this.bottom

        if (!newFigure && !oldFigure) {
          return 0;
        }

        let percent;

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
