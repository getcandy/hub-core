<template>
  <prism :language="lang"><slot /></prism>
</template>

<script>
import 'prismjs'
import 'prismjs/themes/prism.css'
import Prism from 'vue-prism-component'

export default {
  components: {
    Prism
  },
  props: {
    lang: {
      type: String,
      default: 'javascript'
    }
  }
}
</script>
