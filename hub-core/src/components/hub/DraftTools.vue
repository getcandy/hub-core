<template>
  <div>
    <div class="flex items-center">
      <div class="mr-2" v-if="previewUrl && isDraft">
        <a class="border border-gray-300 text-gray-700 bg-white hover:text-gray-500 focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 px-4 py-2 text-sm leading-6 border border-gray-300 text-gray-700 bg-white hover:text-gray-500 focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 disabled:cursor-not-allowed inline-flex items-center border border-transparent font-medium rounded-md  focus:outline-none transition ease-in-out duration-150" :href="previewUrl" target="_blank" rel="noopener noreferrer">
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
      <div class="border-l ml-2 pl-2" v-if="!isDraft">
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
      <div class="bg-white flex py-4">
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
