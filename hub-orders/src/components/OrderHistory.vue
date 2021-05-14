<template>
  <div>
    <gc-loading-spinner v-if="$fetchState.pending" />
    <div v-else class="timeline">
      <div
        v-for="item in sortedItems"
        :key="item.id"
        class="timeline-item"
        :class="{
          'is-info': item.type == 'system',
          'is-primary': item.type == 'default'
        }"
      >
        <div
          class="timeline-marker is-icon"
          :class="{
            'is-info': item.type == 'system',
            'is-primary': item.type == 'default'
          }"
        >
          <gc-icon :icon="getIcon(item.description)" />
        </div>
        <div class="timeline-content">
          <p class="heading">
            {{ $format.date(item.created_at) }} by
            <template v-if="item.user.data">
              {{ item.user.data.name }} ({{ item.user.data.email }})
            </template>
          </p>
          <hr>
          {{ item.description }}
          <div v-for="(detail, handle) in item.properties" :key="handle">
            <template v-if="handle == 'attributes'">
              <template v-if="getChanges(item).length">
                <table class="table">
                  <thead>
                    <tr>
                      <th width="30%">
                        {{ $t('Field') }}
                      </th>
                      <th width="30%">
                        {{ $t('Old Value') }}
                      </th>
                      <th>{{ $t('New Value') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="change in getChanges(item)" :key="change.field">
                      <td>{{ change.field }}</td>
                      <td>{{ change.old ? change.old : '-' }}</td>
                      <td>{{ change.new }}</td>
                    </tr>
                  </tbody>
                </table>
              </template>
              <template v-else>
                {{ $t('No changes detected') }}
              </template>
            </template>
            <template v-else-if="detail.message">
              {{ detail.message }}
            </template>
            <template v-else-if="detail.description">
              {{ detail.description }}
            </template>
            <template v-else-if="handle !== 'old'">
              <strong>{{ handle }}:</strong> {{ detail }}
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const sortBy = require('lodash/sortBy')
const each = require('lodash/each')

export default {
  props: {
    orderId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      items: [],
      loading: true
    }
  },
  computed: {
    sortedItems () {
      return sortBy(this.$store.state.order.history, item => item.created_at)
    }
  },
  async fetch () {
    const { data } = await this.$gc.activityLog.get({
      type: 'order',
      id: this.orderId
    })

    this.$store.commit('order/setOrderHistory', data.data)
  },
  methods: {
    getIcon (val) {
      if (val == 'created') {
        return 'checks'
      }

      if (val == 'status-update') {
        return 'settings'
      }

      return 'flag'
    },
    getChanges (item) {
      const changes = []

      const newFields = item.properties.attributes

      each(item.properties.old, (oValue, field) => {
        if (newFields[field] != oValue && field != 'updated_at') {
          changes.push({
            field,
            new: newFields[field],
            old: oValue
          })
        }
      })
      return changes
    },
  }
}
</script>
