<template>
  <div>
    <div>
      <date-picker :value="date" @input="handleInput" v-bind="options" :is-range="isRange">
        <template v-slot="{ inputValue, togglePopover, inputEvents }">
          <gc-input :value="inputValue" @focus="togglePopover({ placement: 'bottom' })" v-on="inputEvents" v-if="!isRange" />
          <gc-input :value="`${date.start} - ${date.end}`" v-else />
        </template>
      </date-picker>
    </div>
  </div>
</template>

<script>
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

export default {
  model: {
    prop: 'date',
    event: 'input'
  },
  props: {
    isRange: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Object|String,
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    DatePicker
  },
  data() {
    return {
    }
  },
  methods: {
    handleInput (e) {
      this.$emit('input', e)
    }
  }
}
</script>
