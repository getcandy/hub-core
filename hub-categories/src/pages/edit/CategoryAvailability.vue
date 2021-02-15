<template>
  <div v-if="category">
    <gc-tabs>
      <gc-tab-item :label="$t('Channels')">
        <channel-manager v-model="category.channels.data" @change="handleChannelChange($event, category)" />
      </gc-tab-item>
      <gc-tab-item :label="$t('Customer Groups')">
        <customer-group-manager :groups="category.customer_groups.data" @change="handleCustomerGroupsChange($event, category)" />
      </gc-tab-item>
    </gc-tabs>
  </div>
</template>

<script>
import { HubPage, NormalizesObjects, HasDrafts } from '@getcandy/hub-core/src/mixins/Index.js'
const debounce = require('lodash/debounce')

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
  computed: {
    model () {
      return this.$store.state.categories.model
    }
  },
  mounted () {
    this.category = this.normalize(this.model)
  },
  methods: {
    handleChannelChange: debounce(async function (channels, category) {
      await this.createDraft('categories', category.id, {
        afterRedirect: (category) => {
          this.category.id = category.id
        }
      })
      await this.$gc.categories.updateChannels(category.id, {
        channels
      })
      this.$notify.queue('success', this.$t('Category updated'))
    }, 300),
    handleCustomerGroupsChange: debounce(async function (groups, category) {
      await this.createDraft('categories', this.category.id, {
        afterRedirect: (category) => {
          this.category.id = category.id
        }
      })
      await this.$gc.categories.updateCustomerGroups(category.id, {
        groups
      })
      this.$notify.queue('success', this.$t('Customer groups updated.'))
    }, 300)
  }
}
</script>
