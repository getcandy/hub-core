
export default {
  computed: {
    isDraft () {
      return this.$store.state[this.storeHandle].isDraft
    }
  },
  data () {
    return {
      creatingDraft: false,
      storeHandle: 'product'
    }
  },
  methods: {
    async createDraft (type, id, config = {}, context) {
      // If we're already a draft, then don't worry.
      if (this.isDraft || this.creatingDraft) {
        if (config.alreadyDrafted) {
          await config.alreadyDrafted()
        }
        return;
      }

      this.creatingDraft = true;

      const response = await this.$store.dispatch(`${type}/createDraft`, {
        context: context || this.$gc,
        id: id,
      })

      const draft = response.data.data;

      // const result = await this.$store.dispatch(`${type}/fetch`, {
      //   context: this.$gc,
      //   id: draft.id
      // })

      if (config.beforeRedirect) {
        await config.beforeRedirect(draft)
      }

      // const url = this.$route.path.replace(id, draft.id)

      // history.pushState({}, null, url)

      // await this.$router.replace({
      //   name: this.$route.name,
      //   params: {
      //     id: draft.id
      //   }
      // })

      if (config.afterRedirect) {
        await config.afterRedirect(draft)
      }

      this.$store.commit(`${type}/setIsDraft`, true)
      this.$store.commit(`${type}/setModelId`, draft.id)
      // this.$store.commit(`${type}/setModel`, draft)
      this.$store.commit(`${type}/setLiveId`, id)

      return draft
    }
  }
}
