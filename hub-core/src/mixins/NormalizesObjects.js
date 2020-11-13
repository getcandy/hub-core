export default {
  methods: {
    normalize (obj) {
      return JSON.parse(
        JSON.stringify(obj)
      )
    }
  }
}
