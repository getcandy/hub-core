<template>
  <div v-click-outside="() => showPicker = false">
    <button @click="showPicker = !showPicker" class="block w-10 p-1 border rounded" :style="{
      'background-color': colour
    }">&nbsp;</button>
    <div class="absolute z-50">
      <colour-picker :value="colour" @input="(e) => $emit('input', e.hex)"  v-show="showPicker" />
    </div>
  </div>
</template>

<script>
import { Sketch } from 'vue-color'
import ClickOutside from 'vue-click-outside'

export default {
  directives: {
    ClickOutside
  },
  components: {
    'colour-picker': Sketch
  },
  model: {
    prop: 'colour',
    event: 'input'
  },
  props: {
    colour: {
      type: null,
      default: null
    }
  },
  data () {
    return {
      showPicker: false
    }
  },
  methods: {
    setColour (colour) {
    }
  }
}
</script>
