<template>
  <div class="search-table">
    <div class="b-table">
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>{{ $t('Channel') }}</th>
            <th>{{ $t('Published') }}</th>
            <th v-if="!useCheckboxes"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="channel in data" :key="channel.id">
            <td>
              <figure class="status-icon">
                <span class="status" :class="status(channel).class" v-if="status(channel).level != 2"></span>
                <b-icon icon="time-line" size="is-small" v-else />
              </figure>
              {{ channel.name }}
            </td>
            <td>
                <slot name="control" v-bind:channel="channel" >
                  <b-datetimepicker
                    rounded
                    :placeholder="$t('Click to select')"
                    v-model="channel.published_at"
                    @input="handleChanges"
                    icon="calendar-line">
                  </b-datetimepicker>
                </slot>
            </td>
            <td v-if="!useCheckboxes"><b-button @click="unpublish(channel)" v-if="channel.published_at">{{ $t('Unpublish') }}</b-button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import { each } from 'lodash'
  export default {
    props: {
      channels: {
        type: Array
      },
      useCheckboxes: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        data: this.channels
      }
    },
    created() {
      // We need to make sure that each channel's published date, if it exists is a valid Date object
      each(this.data, channel => {
        if (channel.published_at && !this.useCheckboxes) {
          channel.published_at = new Date(channel.published_at)
        }
      })
    },
    mounted () {

    },
    methods: {
      handleChanges () {
        this.$emit('change', this.data)
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
