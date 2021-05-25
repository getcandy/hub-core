<template>
  <div>
    <div v-if="creatingDraft || publishingDraft" class="flex items-center">
      <gc-loading-spinner class="w-3 h-3 mr-3 -ml-1 text-gray-500" />
      <span class="text-xs font-medium text-gray-500 uppercase">{{ $t(publishingDraft ? 'Publishing Draft' : 'Creating Draft') }}</span>
    </div>
    <div v-else class="flex items-center">
      <div v-if="previewUrl && isDraft" class="mr-2">
        <a class="inline-flex items-center px-4 py-2 text-sm font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-transparent border-gray-300 rounded-md hover:text-gray-500 focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 disabled:cursor-not-allowed focus:outline-none" :href="previewUrl" target="_blank" rel="noopener noreferrer">
          {{ $t('Live preview') }}
        </a>
      </div>
      <template v-if="isDraft">
        <div class="mr-2">
          <gc-button theme="danger" @click="showDiscardConfirm = true">
            {{ $t('Discard draft') }}
          </gc-button>
        </div>
        <div>
          <gc-button @click="showPublishConfirm = true">
            {{ $t('Publish changes') }}
          </gc-button>
        </div>
      </template>
      <template v-else>
        <div v-if="liveUrl" class="mr-2">
          <a class="inline-flex items-center px-4 py-2 text-sm font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-transparent border-gray-300 rounded-md hover:text-gray-500 focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 disabled:cursor-not-allowed focus:outline-none" :href="liveUrl" target="_blank" rel="noopener noreferrer">
            {{ $t('View Product') }}
          </a>
        </div>
        <div>
          <gc-button size="x-small" theme="danger" @click="showDeleteConfirm = true">
            <gc-icon icon="trash" />
          </gc-button>
        </div>
      </template>
      <div v-if="!isDraft" class="pl-2 ml-2 border-l">
        <gc-button theme="gray" size="small" @click="showHistoryModal = true">
          <gc-icon icon="clock" />
        </gc-button>
      </div>
    </div>
    <simple-modal
      heading="Discard changes"
      :open="showDiscardConfirm"
      @confirmed="() => {
        showDiscardConfirm = false
        $emit('discard')
      }"
      @close="showDiscardConfirm = false"
    >
      {{ $t('Are you sure you want to discard your changes?') }}
    </simple-modal>

    <simple-modal
      heading="Publish changes"
      :open="showPublishConfirm"
      @confirmed="() => {
        showPublishConfirm = false
        $emit('publish')
      }"
      @close="showPublishConfirm = false"
    >
      {{ $t('Are you sure you want to publish your changes?') }}
    </simple-modal>

    <simple-modal
      heading="Delete record"
      :open="showDeleteConfirm"
      @confirmed="() => {
        showDeleteConfirm = false
        $emit('delete')
      }"
      @close="showDeleteConfirm = false"
    >
      {{ $t('This will send the record to the Recycle Bin.') }}
    </simple-modal>

    <quick-view-panel
      :open="showHistoryModal"
      width="w-1/3"
      heading="Version History"
      bg="bg-gray-100"
      @close="showHistoryModal = false"
    >
      <div class="flex py-4 bg-white">
        <div v-if="createdAt" class="px-3">
          <h6 class="text-xs font-bold">
            {{ $t('Created at') }}
          </h6>
          {{ $format.date(createdAt) }}
        </div>
        <div v-if="updatedAt" class="px-3">
          <h6 class="text-xs font-bold">
            {{ $t('Last updated') }}
          </h6>
          {{ $format.date(updatedAt) }}
        </div>
      </div>
      <div>
        <version-history
          :versions="versions"
          @restore="handleRestore"
        />
      </div>
    </quick-view-panel>
  </div>
</template>

<script>
export default {
  props: {
    creatingDraft: {
      type: Boolean,
      default: false
    },
    publishingDraft: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: String,
      default: null
    },
    updatedAt: {
      type: String,
      default: null
    },
    versions: {
      type: [Array, Object],
      default: () => []
    },
    previewUrl: {
      type: String,
      default: null
    },
    liveUrl: {
      type: String,
      default: null
    },
    isDraft: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showDiscardConfirm: false,
      showPublishConfirm: false,
      showDeleteConfirm: false,
      showHistoryModal: false
    }
  },
  methods: {
    handleRestore (versionId) {
      this.$emit('restore', versionId)
      this.showHistoryModal = false
    }
  }
}
</script>
