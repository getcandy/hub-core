<template>
    <div v-if="discount">
      <form @submit.prevent="save">
        <form-field :label="$t('Name')" required>
          <gc-input v-model="discount.name[locale]" required />
        </form-field>
        <form-field :label="$t('Start')" required>
          <gc-date-picker v-model="discount.start_at" :options="{ mode: 'dateTime' }" required />
        </form-field>
        <form-field :label="$t('End')">
          <gc-date-picker v-model="discount.end_at" :options="{ mode: 'dateTime' }" />
        </form-field>

        <gc-button>{{ $t('Create Discount') }}</gc-button>
      </form>
    </div>
</template>

<script>
export default {
  data () {
    return {
      discount: null
    }
  },
  mounted () {
    this.discount = this.getBaseDiscount()
  },
  methods: {
    async save () {
      const response = await this.$getcandy.on('discounts', 'postDiscounts', this.discount)
      this.$router.push({
        name: 'discounts.edit.details',
        params: {
          id: response.data.data.id,
        }
      })
    },
    getBaseDiscount () {
      return {
        name: {
          [this.locale]: ''
        },
        start_at: new Date,
        end_at: new Date
      }
    }
  },
  computed: {
    locale () {
      return this.$store.state.core.locale
    }
  }
}
</script>