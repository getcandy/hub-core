<template>
  <div v-if="versions.length" class="p-6 bg-gray-100 border-t">
    <gc-form-field label="Select a version">
      <gc-select-input v-model="versionId">
        <option :value="null">
          Select a version
        </option>

        <option v-for="record in versions" :key="record.id" :value="record.id">
          {{ $format.date(record.created_at) }} <span v-if="record.user.data">({{ record.user.data.email }})</span>
        </option>
      </gc-select-input>
    </gc-form-field>

    <gc-button :disabled="!version" @click="triggerRestore">
      Restore
    </gc-button>

    <!-- <template v-if="version">
      <version-record v-for="record in version.relations.data" :key="record.id" :record="record" />
    </template> -->

    <simple-modal
      heading="Restore version"
      :open="showRestoreConfirm"
      @confirmed="() => {
        showRestoreConfirm = false
        $emit('restore', versionId)
      }"
      @close="showRestoreConfirm = false"
    >
      {{ $t('Are you sure you want to create a draft based on this version?') }}
    </simple-modal>
  </div>
</template>

<script>
const find = require('lodash/find')

export default {
  props: {
    versions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      versionId: null,
      showRestoreConfirm: false
    }
  },
  computed: {
    version () {
      return find(this.versions, v => v.id === this.versionId)
    }
  },
  methods: {
    triggerRestore () {
      this.showRestoreConfirm = true
    }
  }
}
</script>

<style scoped>

</style>
