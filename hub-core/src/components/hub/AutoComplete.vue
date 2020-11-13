<template>
  <div class="relative">
    <input
      class="border w-full shadow-inner focus:border-purple-600 outline-none px-2 py-2 rounded border-gray-400"
      :value="keywords"
      @input="update"
      @focus="init"
    />
    <div class="absolute z-50 bg-white  overflow-y-scroll max-h-64 text-sm shadow-md mt-1 w-full" v-if="open && data.length">
      <button type="button" class="p-2 hover:bg-gray-100 w-full text-left cursor-pointer block" v-for="(row, index) in data" :key="index" @click="selectRow(row)">
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
