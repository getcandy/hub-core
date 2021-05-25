<template>
  <div v-click-outside="() => open = false" class="relative">
    <gc-input
      :value="keywords"
      @input="update"
      @focus="init"
    >
      <template v-slot:suffix>
        <div class="absolute top-0 right-0 mt-3 mr-3">
          <gc-icon icon="chevron-down " size="sm" />
        </div>
      </template>
    </gc-input>
    <div v-if="open && data.length" class="absolute z-50 w-full mt-1 overflow-y-scroll text-sm bg-white shadow-md max-h-64">
      <button v-for="(row, index) in data" :key="index" type="button" class="block w-full p-2 text-left cursor-pointer hover:bg-gray-100" @click="selectRow(row)">
        {{ row.name }}
      </button>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
const debounce = require('lodash/debounce')

export default {
  directives: {
    ClickOutside
  },
  props: ['value', 'data'],
  data () {
    return {
      open: false,
      keywords: this.value
    }
  },
  methods: {
    update (value) {
      this.open = true
      this.keywords = value
      this.$emit('input', value)
      this.search(value)
    },
    init () {
      this.open = true
      this.$emit('search', null)
    },
    search: debounce(function (value) {
      this.$emit('search', this.keywords)
    }, 300),
    selectRow (value) {
      this.$emit('input', value.name)
      this.keywords = value.name
      this.open = false
      this.$emit('select', value)
    }
  }
}
</script>
