<template>
  <div v-if="category">
    <b-tabs
      horizontal
      class="secondary-tabs"
    >
      <b-tab-item label="Channels">
        <channel-manager @change="handleChannelChange($event, category)" :channels="category.channels.data" />
      </b-tab-item>
      <b-tab-item label="Customer Groups">
        <customer-group-manager  @change="handleCustomerGroupsChange($event, category)" :groups="category.customer_groups.data" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
  const debounce = require('lodash/debounce')
  import { HubPage, NormalizesObjects, HasDrafts } from '@getcandy/hub-core/src/mixins/Index.js'

  export default {
    layout: 'category',
    mixins: [
      HubPage,
      NormalizesObjects,
      HasDrafts
    ],
    data () {
      return {
        category: null,
        storeHandle: 'categories'
      }
    },
    methods: {
      handleChannelChange: debounce(async function (channels, category) {
        await this.createDraft('categories', category.id, {
          afterRedirect: async (category) => {
            this.category.id = category.id
          }
        })
        await this.$gc.categories.updateChannels(category.id, {
          channels: channels
        })
        this.$notify.queue('success', this.$t('Channels updated'))
      }, 300),
      handleCustomerGroupsChange: debounce(async function (groups, category) {
        await this.createDraft('categories', this.category.id, {
          afterRedirect: async (category) => {
            this.category.id = category.id
          }
        })
        await this.$gc.categories.updateCustomerGroups(category.id, {
          groups: groups
        })
        this.$notify.queue('success', this.$t('Customer groups updated.'))
      }, 300)
    },
    mounted() {
      this.category = this.normalize(this.model)
    },
    computed : {
      model () {
        return this.$store.state.categories.model
      }
    }
  }
</script>
