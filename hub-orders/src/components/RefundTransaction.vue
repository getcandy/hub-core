<template>
  <div>
    <gc-button @click="showModal = true">{{ $t('Refund') }}</gc-button>
    <quick-view-panel :open="showModal" @close="reset" :heading="$t('Refund Transaction')">
      <form @submit.prevent="refund" class="p-4">
        <template v-if="max && amount > max">
          <div class="alert alert-danger">
            {{ $t('Amount cannot be more than {max}', {max: max}) }}
          </div>
        </template>
        <div class="p-4 mb-4 text-sm text-red-600 bg-red-100 border border-red-200 rounded" v-if="errors.error">
          {{ errors.error.message }}
        </div>
        <div class="flex">
          <div class="mr-4">
            <form-field :label="$t('Amount')" :error="getFirstFormError('amount')" required>
              <gc-input v-model="amount" type="number" :max="max" step="any" />
            </form-field>
          </div>
          <div>
            <form-field :label="$t('Refund full amount?')">
              <gc-toggle @click="setFull" :value="amount === initial"></gc-toggle>
            </form-field>
          </div>
        </div>
        <form-field :label="$t('Notes')" :error="getFirstFormError('notes')">
          <gc-input v-model="notes" type="textarea" />
        </form-field>
        <form-field :label="$t('Enter {confirmText} below to confirm', {confirmText: 'REFUND'})" :error="getFirstFormError('notes')" required>
          <gc-input v-model="confirmation" />
        </form-field>
        <gc-button type="submit" :disabled="confirmation != 'REFUND' || amount > initial">
          <template v-if="!processing">
            {{ $t('Issue Refund') }}
          </template>
          <template v-else>
            <b-icon icon="loader-4-line" class="spin"  />
          </template>
        </gc-button>
      </form>
    </quick-view-panel>
  </div>
</template>

<script>
  import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'

  export default {
    mixins: [
      HandlesForms
    ],
    props: {
      initial: {
          type: Number,
          required: true,
      },
      max: {
          type: Number,
      },
      id: {
          type: String,
          required: true
      },
      reference: {
          type: String,
          required: true,
      }
    },
    data() {
      return {
        enabled: true,
        showModal: false,
        errors: {},
        processing: false,
        confirmation: null,
        amount: this.initial,
        notes: null,
      }
    },
    computed: {
      integer() {
        return Math.round(this.amount * 100);
      }
    },
    mounted() {
      if (this.max) {
        this.amount = this.max;
      }
    },
    methods: {
      setFull() {
        this.amount = this.initial;
      },
      reset() {
        this.amount = this.initial
        this.errors = {}
        this.confirmation = null
        this.notes = null
        this.showModal = false
      },
      async refund() {
        this.processing = true;
        try {
          const response = await this.$gc.payments.refund(this.id, this.integer, this.notes)
          this.showModal = false
          this.confirmation = null
          this.amount = this.value
          this.$notify.queue('success', this.$t('Refund processed'))
          this.$emit('success', response.data.data)
        } catch (error) {
          this.errors = error.response.data;
          this.$notify.queue('error', this.$t('Unable to process refund'))
        }

        this.processing = false
      }
    }
  }
</script>
