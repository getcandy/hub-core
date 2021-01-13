<template>
  <div v-if="category">
    <gc-tabs>
      <gc-tab-item :label="$t('Channels')">
        <channel-manager @change="handleChannelChange($event, category)" v-model="category.channels.data" />
      </gc-tab-item>
      <gc-tab-item :label="$t('Customer Groups')">
        <customer-group-manager  @change="handleCustomerGroupsChange($event, category)" :groups="category.customer_groups.data" />
      </gc-tab-item>
    </gc-tabs>
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
        }, this.$getcandy)
        await this.$gc.categories.updateChannels(category.id, {
          channels: channels
        })
        this.$notify.queue('success', this.$t('Category updated'))
      }, 300),
      handleCustomerGroupsChange: debounce(async function (groups, category) {
        await this.createDraft('categories', this.category.id, {
          afterRedirect: async (category) => {
            this.category.id = category.id
          }
        }, this.$getcandy)
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
