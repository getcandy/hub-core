
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
        console.log('Hi')
        if (config.alreadyDrafted) {
          await config.alreadyDrafted()
        }
        return;
      }

      this.creatingDraft = true;

      const response = await this.$store.dispatch(`${type}/createDraft`, {
        context: context || this.$gc,
        $nuxt: this.$nuxt,
        id: id,
      })

      const draft = response.data.data;


      if (config.beforeRedirect) {
        await config.beforeRedirect(draft)
      }

      if (config.afterRedirect) {
        await config.afterRedirect(draft)
      }

      this.$store.commit(`${type}/setIsDraft`, true)
      this.$store.commit(`${type}/setModelId`, draft.id)
      // this.$store.commit(`${type}/setModel`, draft)
      this.$store.commit(`${type}/setLiveId`, id)

      this.creatingDraft = false

      return draft
    }
  }
}
