<template>
  <div>
    <div class="flex pl-4 text-white bg-gray-800">
      <button
        v-for="(tab, tabIndex) in tabs"
        :key="tabIndex"
        @click="activate(tab)"
        :class="tab.active ? 'bg-white text-gray-800' : 'hover:bg-gray-700'"
        class="px-6 py-4 text-sm border-none outline-none focus:border-none focus:outline-none "
      >
        {{ getTabLabel(tab) }}
      </button>
    </div>
    <slot />
  </div>
</template>

<script>
const filter = require('lodash/filter')
const map = require('lodash/map')
const each = require('lodash/each')

export default {
  props: {
    secondary: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tabs: []
    }
  },
  computed: {
    tabClass () {
      return this.secondary ? 'gc-secondary-tabs' : `gc-default-tabs`;
    },
    filteredTabs () {
      return filter(this.$slots.default, (vNode) => {
        return !!vNode.componentOptions
      })
    }
  },
  methods: {
    isActive (tab) {
      // return tab.componentInstance && tab.componentInstance.active
      // return tab.componentInstance.active
    },
    getTabLabel (tab) {
      return tab.node.componentOptions.propsData.label
    },
    activate (tab) {
      each(this.tabs, tab => {
        tab.node.componentInstance.active = false
        tab.active = false
      })
      tab.node.componentInstance.active = true
      tab.active = true
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.tabs = map(this.filteredTabs, (tab, index) => {
        if (index === 1) {
          tab.componentInstance.active = true
        }
        return {
          active: index == 1,
          node: tab
        }
      })
    })
    // this.$on('activate', (event) => {
    //   this.$slots.default.forEach(vNode => {
    //     vNode.componentInstance.active = false
    //     // element.active = false
    //   });
    //   event.active = true
    // })
  }
}
</script>
