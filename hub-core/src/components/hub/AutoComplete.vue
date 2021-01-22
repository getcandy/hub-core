<template>
  <div class="relative">
    <gc-input
      :value="keywords"
      @input="update"
      @focus="init"
    />
    <div class="absolute z-50 w-full mt-1 overflow-y-scroll text-sm bg-white shadow-md max-h-64" v-if="open && data.length">
      <button type="button" class="block w-full p-2 text-left cursor-pointer hover:bg-gray-100" v-for="(row, index) in data" :key="index" @click="selectRow(row)">
        {{ row.name }}
      </button>
    </div>
  </div>
</template>

<script>
  const debounce = require('lodash/debounce')

  export default {
    props: ['value', 'data'],
    data () {
      return {
        open: false,
        keywords: this.value
      }
    },
    methods: {
      update (event) {
        this.open = true
        this.keywords = event.target.value
        this.$emit('input', event.target.value)
        this.search(event.target.value)
      },
      init () {
        this.open = true
        this.$emit('search', null)
      },
      search: debounce(function(value) {
        this.$emit('search', this.keywords)
      }, 300),
      selectRow (value) {
        this.$emit('input', value.name)
        this.keywords = value.name
        this.open = false;
        this.$emit('select', value)
      }
    }
  }
</script>
