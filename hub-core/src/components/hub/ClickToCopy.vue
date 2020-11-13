<template>
  <button class="text-sm bg-gray-200 px-1 py-1 focus:outline-none leading-none rounded" ref="btn" @click.stop.prevent="copy" @hover="copied = false" :class="{
    'bg-green-500 text-white': copied
  }">
    <span v-if="copied">copied</span><span v-else><i class="ri-clipboard-line text-gray-600" /></span>
  </button>
</template>

<script>
  export default {
    props: ['text'],
    data() {
      return {
        copied: false
      }
    },
    watch: {
      copied(val) {
        if (val) {
          setTimeout(() => {
            this.copied = false
          }, 500)
        }
      }
    },
    methods: {
      copy() {
        if (!navigator.clipboard) {
          this.fallbackCopyTextToClipboard(this.text)
          return
        }
        navigator.clipboard.writeText(this.text).then(() => {
          this.copied = true
        }, function(err) {
          this.copied = false
        });
      },
      fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea")
        textArea.value = text
        this.$refs['btn'].appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
          var successful = document.execCommand('copy')
          var msg = successful ? 'successful' : 'unsuccessful'
          this.copied = true
        } catch (err) {
          this.copied = false
        }
        this.$refs['btn'].removeChild(textArea)
      }
    }
  }
</script>
