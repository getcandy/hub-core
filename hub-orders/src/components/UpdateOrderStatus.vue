<template>
  <div>
    <gc-button @click="showModal = true" theme="gray">{{ $t('Update Status') }}</gc-button>
    <quick-view-panel width="w-4/5 xl:w-3/5" :heading="$t('Update Status')" :open="showModal" @close="showModal = false">
      <form class="relative h-full" action="" @submit.prevent="save">
        <div class="flex h-full">
          <div class="w-2/5 p-6">
            <div class="mb-4">
              <header class="mb-1 font-bold text-gray-700 text-sm">
                <label>{{ $t('Status') }}</label>
              </header>
              <div>
                <select-input v-model="status" @input="updateTemplate">
                  <option v-for="(status, handle) in statuses" :key="handle" :value="handle">{{ status.label }}</option>
                </select-input>
              </div>
            </div>
            <div class="mb-4">
              <header class="mb-2 text-sm">
                <label class="font-bold text-gray-700 block">{{ $t('Send Notfication') }}</label>
                <p class="text-gray-600 leading-tight text-xs font-normal">{{ $t('This will send out an email to the customer based on the status, if available') }}</p>
              </header>
              <div>
                <b-switch v-model="sendEmails" :true-value="true" :false-value="false" />
              </div>
            </div>
            <div class="mb-4">
              <header class="mb-2 text-sm">
                <label class="font-bold text-gray-700 block">{{ $t('Additional Content') }}</label>
                <p class="text-gray-600 leading-tight text-xs font-normal">{{ $t('This content will be added to the email, if supported') }}</p>
              </header>
              <div>
                <b-input type="textarea" v-model="notes" />
              </div>
            </div>
            <gc-button type="submit">
              {{ $t('Update status') }}
            </gc-button>
          </div>
          <div class="w-full h-full">
            <div class="mt-12 text-center" v-if="loadingEmail">
              <i class="ri-refresh-line spin block text-2xl" />
            </div>
            <iframe style="width:100%;height:100%" v-if="emailTemplate" :srcdoc="emailTemplate" ref="emailPreview">
            </iframe>
            <div class="bg-gray-700 text-white rounded p-6 border-l-4 border-blue-500 m-12 flex" v-if="missingTemplate">
              {{ $t('There is no email template for this status') }}
            </div>
          </div>
        </div>
      </form>
    </quick-view-panel>
  </div>
</template>

<script>
  const debounce = require('lodash/debounce')

  export default {
    props: {
      orderId: {
        type: String,
        required: true,
      },
      currentStatus: {
        type: String,
        default: null
      },
      statuses: {
        type: Array|Object,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        showModal: false,
        status: this.currentStatus,
        notes: null,
        sendEmails: false,
        loadingEmail: false,
        emailTemplate: null,
        missingTemplate: false,
      }
    },
    methods: {
      updateTemplate() {
        this.loadEmailPreview()
      },
      loadEmailPreview: debounce(function (){
          this.loadingEmail = true;
          this.missingTemplate = false;
          this.$gc.orders.emailPreview(this.status, {
              id: this.orderId,
              data: {
                  content: this.notes,
              }
          }).then(response => {
              this.loadingEmail = false;
              this.emailTemplate = window.atob(response.data.content);
          }).catch(response => {
              this.loadingEmail = false;
              this.emailTemplate = null;
              this.missingTemplate = true;
          });
        }, 500
      ),
      save() {
        this.$emit('save', {
          text: this.additionalCopy,
          sendEmails: this.sendEmails,
          status: this.status,
        });
        this.showModal = false
      }
    }
  }
</script>
