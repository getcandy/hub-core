<template>
  <div class="bg-gray-100 border-t p-6">
    <div
      class="rounded-lg border border-gray-300 bg-white px-3 py-2 hover:border-gray-400 group-focus:border-blue-300 sm:flex sm:justify-between sm:space-x-4"
      v-for="version in versions"
      :key="version.id"
    >
        <div class="flex items-center space-x-0">
          <div class="flex-shrink-0 flex items-center hidden">
            <span aria-hidden="" class="form-radio text-indigo-600 group-focus:bg-red-500"></span>
          </div>
          <div class="text-sm leading-5">
            <p class="block font-medium text-gray-900">
              {{ $format.date(version.created_at) }}
            </p>
            <div class="text-gray-500">
              <span class="block sm:inline">
                <span v-if="version.user.data">
                  {{ version.user.data.email }}
                </span>
                <span v-else>
                  Unknown
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="flex text-sm leading-5 space-x-1 sm:mt-0 sm:block sm:space-x-0 sm:text-right">
          <gc-button @click="triggerRestore(version)">
            {{ $t('Restore') }}
          </gc-button>
        </div>
      </div>
      <simple-modal heading="Restore version" :open="showRestoreConfirm" @confirmed="() => {
        showRestoreConfirm = false
        $emit('restore', version.id)
      }" @close="showRestoreConfirm = false">
        {{ $t('Are you sure you want to create a draft based on this version?') }}
      </simple-modal>
  </div>
</template>

<script>
  export default {
    props: {
      versions: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        showRestoreConfirm: false,
        version: null
      }
    },
    methods: {
      triggerRestore (version) {
        this.version = version
        this.showRestoreConfirm = true
      }
    }
  }
</script>

<style scoped>

</style>
