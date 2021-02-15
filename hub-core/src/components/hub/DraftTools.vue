<template>
  <div>
    <div v-if="creatingDraft" class="flex items-center">
      <gc-loading-spinner class="w-3 h-3 mr-3 -ml-1 text-gray-500" />
      <span class="text-xs font-medium text-gray-500 uppercase">{{ $t('Creating Draft') }}</span>
    </div>
    <div class="flex items-center" v-else>
      <div class="mr-2" v-if="previewUrl && isDraft">
        <a class="inline-flex items-center px-4 py-2 text-sm font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-transparent border-gray-300 rounded-md hover:text-gray-500 focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 disabled:cursor-not-allowed focus:outline-none" :href="previewUrl" target="_blank" rel="noopener noreferrer">
          {{ $t('Live preview') }}
        </a>
      </div>
      <template v-if="isDraft">
        <div class="mr-2">
          <gc-button @click="showDiscardConfirm = true" theme="danger">
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
        <div>
          <gc-button @click="showDeleteConfirm = true" size="x-small" theme="danger" >
            <gc-icon icon="trash" />
          </gc-button>
        </div>
      </template>
      <div class="pl-2 ml-2 border-l" v-if="!isDraft">
        <gc-button @click="showHistoryModal = true" theme="gray" size="small">
          <gc-icon icon="clock" />
        </gc-button>
      </div>
    </div>
    <simple-modal heading="Discard changes" :open="showDiscardConfirm" @confirmed="() => {
      showDiscardConfirm = false
      $emit('discard')
    }" @close="showDiscardConfirm = false">
      {{ $t('Are you sure you want to discard your changes?') }}
    </simple-modal>

    <simple-modal heading="Publish changes" :open="showPublishConfirm" @confirmed="() => {
      showPublishConfirm = false
      $emit('publish')
    }" @close="showPublishConfirm = false">
      {{ $t('Are you sure you want to publish your changes?') }}
    </simple-modal>

    <simple-modal heading="Permanent delete" :open="showDeleteConfirm" @confirmed="() => {
      showDeleteConfirm = false
      $emit('delete')
    }" @close="showDeleteConfirm = false">
      {{ $t('Are you sure you want to delete this record? This action cannot be undone.') }}
    </simple-modal>

    <quick-view-panel
      :open="showHistoryModal"
      @close="showHistoryModal = false"
      width="w-1/3"
      heading="Version History"
      bg="bg-gray-100"
    >
      <div class="flex py-4 bg-white">
          <div class="px-3" v-if="createdAt">
            <h6 class="text-xs font-bold">{{ $t('Created at') }}</h6>
            {{ $format.date(createdAt) }}
          </div>
          <div class="px-3" v-if="updatedAt">
            <h6 class="text-xs font-bold">{{ $t('Last updated') }}</h6>
            {{ $format.date(updatedAt) }}
          </div>
      </div>
      <div>
        <version-history :versions="versions" @restore="(versionId) => {
          $emit('restore', versionId)
        }" />
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
      createdAt: {
        type: String,
        default: null
      },
      updatedAt: {
        type: String,
        default: null,
      },
      versions: {
        type: Array|Object,
        default: () => []
      },
      previewUrl: {
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
    }
  }
</script>
