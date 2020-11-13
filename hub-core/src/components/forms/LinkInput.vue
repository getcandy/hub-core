<template>
  <div class="flex items-top justify-between">
    <div class="w-full">
      <b-input v-model="data.url" @input="handleInput" />
      <label class="text-sm my-2 block font-semibold">Link title</label>
      <b-input v-model="data.title" @input="handleInput" />
    </div>
    <div class="w-64 text-right ml-4">
      <div class="flex items-center">
        <span class="text-xs mr-2">Open in new tab</span>
        <radio-checkbox v-model="data.newTab" size="small" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['value'],
    data () {
      return {
        data: {
          url: '',
          title: '',
          newTab: false
        }
      }
    },
    mounted () {
      if (this.value) {
        this.data = this.value
      }
    },
    methods: {
      handleInput() {
        this.$emit('input', this.data)
      }
    }
  }
</script>
