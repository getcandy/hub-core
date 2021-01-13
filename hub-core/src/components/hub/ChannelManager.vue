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
        <figure class="status-icon">
          <span class="status" :class="status(row).class" v-if="status(row).level != 2"></span>
          <b-icon icon="time-line" size="is-small" v-else />
        </figure>
        {{ row.name }}
      </template>
      <template v-slot:published="{ index }">
        <gc-date-picker v-model="channels[index].published_at" :options="{ mode: 'dateTime' }" @input="handleChanges" />
      </template>
      <template v-slot:actions="{ row }" v-if="!useCheckboxes">
        <gc-button @click="unpublish(row)" v-if="row.published_at" theme="gray">{{ $t('Unpublish') }}</gc-button>
      </template>
    </gc-table>
  </div>
</template>

<script>
  import moment from 'moment'
  import { each } from 'lodash'
  export default {
    model: {
      prop: 'channels',
      event: 'input',
    },
    props: {
      channels: {
        type: Array
      },
      useCheckboxes: {
        type: Boolean,
        default: false
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
        var status = {
            class: 'status-disabled',
            level: 0,
            text: 'Unpublished'
        }
        if (channel.published_at) {
          let now = moment();
          let publish_date = moment(channel.published_at);

          if (publish_date.isAfter(now)) {
            status.text = 'Publishes ' + publish_date.fromNow();
            status.level = 2;
            status.class = 'status-pending';
          } else {
            status.text = 'Published ' + publish_date.fromNow();
            status.level = 1;
            status.class = 'status-live';
          }
        }
        return status;
      },
    },
    computed: {
      checkedValue() {
        return moment().toISOString()
      }
    }
  }
</script>
