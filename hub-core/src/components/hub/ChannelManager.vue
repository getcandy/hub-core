<template>
  <div>
    <gc-table
      :data="channels"
      :columns="[
        {label: $t('Channel'), 'field': 'channel'},
        {label: $t('Published'), 'field': 'published'},
        {label: null, 'field': 'actions'},
      ]"
    >
      <template v-slot:channel="{ row }">
        <div class="flex items-center">
          <figure class="block mr-2">
            <span v-if="status(row).level != 2" class="block w-2 h-2 border border-gray-600 rounded-full" :class="status(row).class" />
            <gc-icon v-else icon="clock" size="sm" class="text-gray-500" />
          </figure>
          <span>{{ row.name }}</span>
        </div>
      </template>
      <template v-slot:published="{ index }">
        <gc-date-picker v-model="channels[index].published_at" :options="{ mode: 'dateTime' }" @input="handleChanges" />
      </template>
      <template v-if="!useCheckboxes" v-slot:actions="{ row }">
        <gc-button v-if="row.published_at" theme="gray" @click="unpublish(row)">
          {{ $t('Disable') }}
        </gc-button>
      </template>
    </gc-table>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  model: {
    prop: 'channels',
    event: 'input'
  },
  props: {
    channels: {
      type: Array,
      default: () => []
    },
    useCheckboxes: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    checkedValue () {
      return moment().toISOString()
    }
  },
  methods: {
    handleChanges () {
      this.$emit('change', this.channels)
    },
    unpublish (channel) {
      channel.published_at = null
      this.handleChanges()
    },
    status (channel) {
      const status = {
        class: 'status-disabled',
        level: 0,
        text: 'Unpublished'
      }
      if (channel.published_at) {
        const now = moment()
        const publishDate = moment(channel.published_at)

        if (publishDate.isAfter(now)) {
          status.text = 'Publishes ' + publishDate.fromNow()
          status.level = 2
          status.class = 'bg-yellow-500 border-yellow-600'
        } else {
          status.text = 'Published ' + publishDate.fromNow()
          status.level = 1
          status.class = 'bg-green-500 border-green-600'
        }
      }
      return status
    }
  }
}
</script>
