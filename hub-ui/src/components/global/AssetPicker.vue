<template>
  <div>
    <div v-if="current" class="flex items-center">
      <figure class="w-24">
        <img :src="thumbnail" class="p-2 border border-gray-200 rounded shadow-sm" />
      </figure>
      <div class="ml-4">
        <gc-button @click="pickerIsVisible = true">{{ $t('Change') }}</gc-button>
      </div>
    </div>
    <div v-else>
      <slot name="empty" />
      <gc-button @click="pickerIsVisible = true">{{ $t('Select an image') }}</gc-button>
    </div>
    <quick-view-panel :open="pickerIsVisible" @close="pickerIsVisible = false" heading="Select an asset" width="w-2/5">
      <div class="p-4">
        <form @submit.prevent="save">
          <div class="grid grid-cols-3 gap-4 ">
            <label
              v-for="asset in assets"
              :key="asset.id"
              class="p-2 border-gray-200 rounded cursor-pointer focus:outline-none hover:shadow-sm"
              :class="{
                'border-blue-500 shadow-sm border-2': asset.id === selected,
                'border': asset.id !== selected,
              }"
            >
              <input type="radio" v-model="selected" :value="asset.id" class="hidden" />
              <img :src="asset.thumbnail" />
            </label>
          </div>
          <div class="mt-4">
            <gc-button type="submit">{{ $t('Save Asset') }}</gc-button>
          </div>
        </form>
      </div>
    </quick-view-panel>
  </div>
</template>

<script>
const get = require('lodash/get')
const first = require('lodash/first')

export default {
  props: {
    assets: {
      type: Array,
      default: () => []
    },
    current: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pickerIsVisible: false,
      selected: null
    }
  },
  mounted () {
    if (this.current) {
      this.selected = this.current.id
    }
  },
  watch: {
    currentId () {
      if (this.current) {
        this.selected = this.current.id
      } else {
        this.selected = null
      }
    }
  },
  computed: {
    currentId () {
      return this.current ? this.current.id : null
    },
    thumbnail () {
      if (!this.current) {
        return
      }
      const transforms = get(this.current, 'transforms.data', [])

      const thumbnail = first(transforms)

      if (!thumbnail) {
        return this.current.thumbnail
      }
      return thumbnail.url
    }
  },
  methods: {
    save () {
      this.$emit('save', this.selected)
      this.pickerIsVisible = false
    }
  }
}
</script>
