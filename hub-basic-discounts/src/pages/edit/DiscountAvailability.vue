<template>
  <div v-if="discount">
    <div class="px-6 py-4 bg-white">
      <div class="grid grid-cols-3 gap-4">
        <gc-form-field :label="$t('Start Date')">
          <gc-date-picker v-model="discount.start_at" @input="syncModel" :options="{ mode: 'dateTime' }" />
        </gc-form-field>
        <gc-form-field :label="$t('End Date')">
          <gc-date-picker v-model="discount.end_at" @input="syncModel" :options="{ mode: 'dateTime' }" />
        </gc-form-field>
        <gc-form-field :label="$t('Enabled')">
          <gc-toggle v-model="discount.status" @input="syncModel" />
        </gc-form-field>
      </div>
    </div>
    <channel-manager :channels="discount.channels.data" @change="syncModel" />
  </div>
</template>

<script>
  import NormalizesObjects from '@getcandy/hub-core/src/mixins/NormalizesObjects.js'

  export default {
    layout: 'discount',
    mixins: [
      NormalizesObjects
    ],
    data () {
      return {
        discount: null,
      }
    },
    mounted () {
      this.discount = this.normalize(this.model)
    },
    methods: {
      syncModel () {
        this.$store.dispatch('discounts/setModel', this.normalize(this.discount))
      },
    },
    computed: {
      model () {
        return this.$store.state.discounts.model
      }
    }
  }
</script>
