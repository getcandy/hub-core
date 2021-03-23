<template>
  <div>
      <gc-button @click="showModal = true" theme="gray">Add Note</gc-button>
      <quick-view-panel :heading="$t('Add Note')" :open="showModal" @close="showModal = false">
        <form class="px-3" @submit="save" ref="form">
            <div class="mb-4">
              <header class="mb-1 text-sm font-bold text-gray-700">
                <label>{{ $t('Visibility') }}</label>
              </header>
              <div>
                <select-input v-model="isPublic">
                  <option :value="true">{{ $t('Public') }}</option>
                  <option :value="false">{{ $t('Private') }}</option>
                </select-input>
              </div>
            </div>
            <div>
              <header class="mb-1 text-sm font-bold text-gray-700">
                <label>{{ $t('Message') }}</label>
              </header>
              <div>
                <gc-input v-model="message" type="textarea" />
              </div>
            </div>

        </form>
        <div slot="footer">
          <div class="flex justify-end">
          <gc-button theme="gray" @click="reset()" class="mr-4">
            {{ $t('Close') }}
          </gc-button>
          <gc-button @click="save">
            {{ $t('Publish changes') }}
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
      save: function (e) {
        this.$gc.activityLog.post({
          properties: {
            message: this.message,
          },
          action: 'note',
          type: 'order',
          log: this.isPublic ? 'public' : 'private',
          id: this.orderId,
        }).then(response => {
          this.showModal = false
          this.$buefy.toast.open({
            message: 'Note successfully saved',
            type: 'is-success'
          })
        })
      }
    },
  }
</script>
