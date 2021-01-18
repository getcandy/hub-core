<template>
  <div>
    <b-icon icon="refresh-line" class="spin" v-if="loading" />
    <div class="timeline" v-else>
      <div class="timeline-item" v-for="item in sortedItems" :key="item.id"
          :class="{
            'is-info': item.type == 'system',
            'is-primary': item.type == 'default'
          }"
      >
        <div class="timeline-marker is-icon"
          :class="{
            'is-info': item.type == 'system',
            'is-primary': item.type == 'default'
          }">
          <b-icon :icon="getIcon(item.description)" />
          <i class="fa fa-flag"></i>
        </div>
        <div class="timeline-content">
          <p class="heading">{{ $format.date(item.created_at) }} by
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
                      <th width="30%">{{ $t('Field') }}</th>
                      <th width="30%">{{ $t('Old Value') }}</th>
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

    <!-- <table class="table">
      <thead>
        <tr>
            <th>{{ $t('Public') }}</th>
            <th>{{ $t('System Generated') }}</th>
            <th>{{ $t('Performed by') }}</th>
            <th>{{ $t('Description') }}</th>
            <th>{{ $t('Details') }}</th>
            <th>{{ $t('Date') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td  width="5%">
            <b-icon :icon="item.type == 'public' ? 'check' : 'close'" />
          </td>
          <td width="10%">
            <b-icon :icon="item.type == 'system' ? 'check' : 'close'" />
          </td>
          <td>
            <template v-if="item.user.data">
              <template v-if="item.user.data.details.data">
                {{ item.user.data.details.data.firstname }} {{ item.user.data.details.data.lastname }}
              </template>
              <template v-else>
                {{ item.user.data.email }}
              </template>
            </template>
            <template v-else>
              N/A
            </template>
          </td>
          <td>{{ item.description }}</td>
          <td>
            <div v-for="(detail, handle) in item.properties" :key="handle">
              <template v-if="handle == 'attributes'">
                <template v-if="getChanges(item).length">
                  <table class="table">
                    <thead>
                      <tr>
                        <th width="30%">{{ $t('Field') }}</th>
                        <th width="30%">{{ $t('Old Value') }}</th>
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
              <template v-else-if="handle !== 'old'">
                <strong>{{ handle }}:</strong> {{ detail }}
              </template>
            </div>
          </td>
          <td>
            {{ item.created_at }}
          </td>
        </tr>
      </tbody>
    </table> -->
</template>

<script>
import { sortBy } from 'lodash'

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    sortedItems () {
      return sortBy(this.items, item => item.created_at)
    }
  },
  data () {
    return {
      items: [],
      loading: true
    };
  },
  methods: {
    getIcon (val) {
      if (val == 'created') {
        return 'check-double-line'
      }

      if (val == 'status-update') {
        return 'settings-line'
      }
    },
    getChanges(item) {
      let changes = [];

      let newFields = item.properties.attributes;

      _.each(item.properties.old, (oValue, field) => {
        if (newFields[field] != oValue && field != 'updated_at') {
          changes.push({
            'field' : field,
            'new': newFields[field],
            'old': oValue,
          });
        }
      });
      return changes;
    },
    load() {
      this.$gc.activityLog.get({
        type: this.type,
        id: this.id,
      }).then(response => {
        this.items = response.data.data
      }).catch(error => {
        this.items = []
      }).finally(() => {
        this.loading = false
      })
    },

  },
  mounted() {
    this.load();
  }
}
</script>

<style scoped>

</style>
