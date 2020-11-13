<template>
  <div>
    <template v-if="!publishable">
      This version is up to date
    </template>
    <div class="box">
      <a :href="previewUrl" v-if="previewUrl && publishable" target="_blank" rel="noopener noreferrer">
        {{ $t('Live preview') }}
      </a>
      <b-button @click="triggerDiscard" v-if="publishable">
        {{ $t('Discard draft') }}
      </b-button>
      <b-button @click="triggerPublish" v-if="publishable" type="is-primary">
        {{ $t('Publish changes') }}
      </b-button>
      <div class="media-content">
        <b-field :label="$t('Created on')">
          <b>{{ $format.date(createdAt) }}</b>
        </b-field>
        <b-field :label="$t('Updated on')">
          <span>
            <b>{{ $format.date(updatedAt) }}</b>
            <small v-if="versions.length"><a @click.prevent="showHistoryModal = true" class="is-pulled-right">View history</a></small>
            <b-modal
              :active.sync="showHistoryModal"
              trap-focus
              aria-role="dialog"
              aria-modal
            >
              <div class="box">
                <ul>
                  <li v-for="version in versions" :key="version.id">
                    <div class="columns">
                      <div class="column">
                        <strong>Date Created:</strong> <br>
                        {{ $format.date(version.created_at) }}
                      </div>
                      <div class="column">
                        <strong>Author:</strong> <br>
                        <template v-if="version.user.data">
                          <div class="columns">
                            <div class="column is-2">
                              <figure class="image is-32x32">
                                <gravatar class="is-rounded" :email="version.user.data.email"/>
                              </figure>
                            </div>
                            <div class="column">
                              {{ version.user.data.email }}
                            </div>
                          </div>

                        </template>
                        <template v-else>
                          Unknown
                        </template>
                        <!-- -->
                      </div>
                      <div class="column">
                        <b-dropdown aria-role="list">
                          <b-button slot="trigger">
                            <b-icon icon="more-line"></b-icon>
                          </b-button>

                          <b-dropdown-item @click="triggerRestore(version.id)" aria-role="listitem">Restore</b-dropdown-item>
                          <b-dropdown-item @click="$emit('delete', version.id)" aria-role="listitem">Delete</b-dropdown-item>
                        </b-dropdown>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </b-modal>
          </span>
        </b-field>
        <b-field :label="$t('Tags')" v-if="taggable">
          <b-taginput
            :value="tags"
            ellipsis
            icon="label"
            type="is-info"
            placeholder="Add a tag"
          />
        </b-field>
      </div>
    </div>
    <div
      v-show="state == 'saving'"
      :class="{
        'bounceInUp': state == 'saving',
        'bounceOutDown': state != 'saving',
      }"
      class="animate"
    >
      <b-icon
        icon="refresh-line"
        custom-class="spin"
      /> Saving changes
    </div>
  </div>
</template>

<script>
import Gravatar from 'vue-gravatar'
const states = [
  'idle', 'saving', 'saved', 'error',
]

export default {
  components: {
    Gravatar
  },
  props: {
    versions: {
      type: Array,
      default: () => []
    },
    previewUrl: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: null,
    },
    publishable: {
      type: Boolean,
      default: false
    },
    saveable: {
      type: Boolean,
      default: false
    },
    taggable: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: String,
      default: null,
    },
    updatedAt: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: 'idle',
      validate: (val) => {
        return states.includes(val)
      }
    },
    status: {
      type: Object,
      default () {
        return {
          label: 'Published',
          type: 'is-success'
        }
      }
    },
    tags: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showHistoryModal: false
    }
  },
  methods: {
    triggerPublish () {
      this.$buefy.dialog.confirm({
        title: this.$t('Publish Draft'),
        message: this.$t('Are you sure you want to publish this draft?'),
        confirmText: 'Publish Draft',
        type: 'is-info',
        hasIcon: true,
        onConfirm: () => this.$emit('publish')
      })
    },
    triggerDiscard () {
      this.$buefy.dialog.confirm({
        title: this.$t('Discard Draft'),
        message: this.$t('Are you sure you want to discard this draft? This action cannot be undone.'),
        confirmText: 'Discard Draft',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.$emit('discard')
      })
    },
    triggerRestore (versionId) {
      this.$buefy.dialog.confirm({
        title: this.$t('Restore Version'),
        message: this.$t('Are you sure you want to create a draft based on this version?'),
        confirmText: 'Restore Version',
        type: 'is-info',
        hasIcon: true,
        onConfirm: () => {
          this.showHistoryModal = false
          this.$emit('restore', versionId)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
