<template>
  <div>
      <gc-button @click="showModal = true" theme="gray">Add Note</gc-button>
      <quick-view-panel :heading="$t('Add Note')" :open="showModal" @close="showModal = false">
        <form class="p-4" @submit="save" ref="form">
            <div class="mb-4">
              <header class="mb-1 text-sm font-bold text-gray-700">
                <label>{{ $t('Visibility') }}</label>
              </header>
              <div>
                <gc-select-input v-model="isPublic">
                  <option :value="true">{{ $t('Public') }}</option>
                  <option :value="false">{{ $t('Private') }}</option>
                </gc-select-input>
              </div>
            </div>
            <div>
              <header class="mb-1 text-sm font-bold text-gray-700">
                <label>{{ $t('Note') }}</label>
              </header>
              <div>
                <gc-textarea v-model="message" type="textarea" required/>
              </div>
            </div>

        </form>
        <div slot="footer">
          <div class="flex justify-end">
          <gc-button theme="gray" @click="reset()" class="mr-4">
            {{ $t('Close') }}
          </gc-button>
          <gc-button @click="save">
            {{ $t('Add Note') }}
          </gc-button>
          </div>
        </div>
      </quick-view-panel>
  </div>

</template>

<script>
  export default {
    props: {
      orderId: {
        type: String,
        required: true,
      }
    },
    data() {
      return {
        isPublic: false,
        message: null,
        saving: false,
        showModal: false,
      }
    },
    methods: {
      reset() {
        this.message = null;
        this.saving = false;
        this.isPublic = false;
        this.showModal = false;
      },
      async save () {

        if (!this.message) {
          return;
        }

        const note = {
          properties: {
            message: this.message,
          },
          action: 'note',
          type: 'order',
          log: this.isPublic ? 'public' : 'private',
          id: this.orderId,
        }

        const { data } = await this.$gc.activityLog.post(note)
        this.showModal = false
        this.message = null
        this.$notify.queue('success', this.$t('Note added'))
        this.$emit('note-added', note)

        this.$store.dispatch('order/addOrderNote', data.data)
      }
    },
  }
</script>
