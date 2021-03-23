<template>
  <div v-if="collection">
    <gc-tabs>
      <gc-tab-item label="Channels">
        <channel-manager @change="handleChannelChange($event, collection)" :channels="collection.channels.data" />
      </gc-tab-item>
      <gc-tab-item label="Customer Groups">
        <customer-group-manager  @change="handleCustomerGroupsChange($event, collection)" :groups="collection.customer_groups.data" />
      </gc-tab-item>
    </gc-tabs>
  </div>
</template>

<script>
  const debounce = require('lodash/debounce')
  import { HubPage, NormalizesObjects, HasDrafts } from '@getcandy/hub-core/src/mixins/Index.js'

  export default {
    layout: 'collection',
    mixins: [
      HubPage,
      NormalizesObjects,
      HasDrafts
    ],
    data () {
      return {
        collection: null,
        storeHandle: 'collections'
      }
    },
    methods: {
      handleChannelChange: debounce(async function (channels, collection) {
        await this.createDraft('collections', collection.id, {
          afterRedirect: async (collection) => {
            this.collection.id = collection.id
          }
        })
        await this.$gc.categories.updateChannels(collection.id, {
          channels: channels
        })
        this.$notify.queue('success', this.$t('Channels updated'))
      }, 300),
      handleCustomerGroupsChange: debounce(async function (groups, collection) {
        await this.createDraft('collections', this.collection.id, {
          afterRedirect: async (collection) => {
            this.collection.id = collection.id
          }
        })
        await this.$gc.categories.updateCustomerGroups(collection.id, {
          groups: groups
        })
        this.$notify.queue('success', this.$t('Customer groups updated.'))
      }, 300)
    },
    mounted() {
      this.collection = this.normalize(this.model)
    },
    computed : {
      model () {
        return this.$store.state.collections.model
      }
    }
  }
</script>
