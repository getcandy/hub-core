<template>
  <div>
    <gc-button @click="showModal = true" theme="gray">{{ $t('Update Status') }}</gc-button>
    <quick-view-panel width="w-4/5 xl:w-3/5" :heading="$t('Update Status')" :open="showModal" @close="showModal = false">
      <form class="relative h-full" action="" @submit.prevent="save">
        <div class="flex h-full">
          <div class="w-2/5 p-6">
            <div class="mb-4">
              <gc-form-field label="Status">
                <gc-select-input v-model="status" @input="updateTemplate">
                    <option v-for="(status, handle) in statuses" :key="handle" :value="handle">{{ status.label }}</option>
                </gc-select-input>
              </gc-form-field>
            </div>
            <div class="mb-4">
              <header class="mb-2 text-sm">
                <label class="block font-bold text-gray-700">{{ $t('Send Notfication') }}</label>
                <p class="text-xs font-normal leading-tight text-gray-600">{{ $t('This will send out an email to the customer based on the status, if available') }}</p>
              </header>
              <div>
                <gc-toggle v-model="sendEmails" />
              </div>
            </div>
            <div class="mb-4">
              <header class="mb-2 text-sm">
                <label class="block font-bold text-gray-700">{{ $t('Additional Content') }}</label>
                <p class="text-xs font-normal leading-tight text-gray-600">{{ $t('This content will be added to the email, if supported') }}</p>
              </header>
              <div>
                <gc-input type="textarea" v-model="notes" />
              </div>
            </div>
            <gc-button type="submit">
              {{ $t('Update status') }}
            </gc-button>
          </div>
          <div class="w-full h-full">
            <div class="mt-12 text-center" v-if="loadingEmail">
              <i class="block text-2xl ri-refresh-line spin" />
            </div>
            <iframe class="w-full h-screen" v-if="emailTemplate" :srcdoc="emailTemplate" ref="emailPreview">
            </iframe>
            <div class="flex p-4 m-12 text-red-600 bg-red-100 border-l-4 border-red-500 rounded" v-if="missingTemplate">
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
    watch: {
      notes: debounce(function (val) {
        this.updateTemplate()
      }, 300)
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
          send_emails: this.sendEmails,
          status: this.status,
        });
        this.showModal = false
      }
    }
  }
</script>
