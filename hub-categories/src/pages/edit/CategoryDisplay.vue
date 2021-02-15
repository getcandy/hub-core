<template>
  <div class="p-8">
    <b-radio
      v-for="layout in layouts"
      :key="layout.id"
      v-model="current"
      name="layout"
      :native-value="layout.id"
      @input="updateLayout"
    >
      {{ layout.name }}
    </b-radio>
  </div>
</template>

<script>
export default {
  layout: 'category',
  data () {
    return {
      current: null,
      layouts: []
    }
  },
  computed: {
    category () {
      return this.$store.state.categories.model
    }
  },
  mounted () {
    this.$gc.layouts.get().then((response) => {
      this.layouts = response.data.data
    })
    if (this.category.layout.data) {
      this.current = this.category.layout.data.id
    }
  },
  methods: {
    updateLayout (value) {
      this.$store.commit('categories/setOnModel', {
        field: 'layout_id',
        value
      })
    }
  }
}
</script>
