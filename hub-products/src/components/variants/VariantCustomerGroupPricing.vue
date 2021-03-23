<template>
  <div>
    <div v-for="price in pricing" :key="price.customer_group_id" class="md:grid md:grid-cols-2 md:gap-6">
      <form-field :label="$t('{group_name} Price', { group_name: price.group_name })">
        <gc-price-input v-model="price.price" :is-cents="false" @input="handleChange" />
      </form-field>
      <form-field :label="$t('Tax')">
        <select-input v-model="price.tax_id" @input="handleChange">
          <option v-for="tax in taxes" :key="tax.id" :value="tax.id">
            {{ tax.name }} ({{ tax.percentage }}%)
          </option>
        </select-input>
      </form-field>
    </div>
  </div>
</template>

<script>
const filter = require('lodash/filter')
const first = require('lodash/first')
const each = require('lodash/each')
const map = require('lodash/map')
export default {
  props: {
    initialPricing: {
      type: Array,
      default: () => []
    },
    variantId: {
      type: String,
      required: true
    },
    newPrice: {
      type: Number,
      required: true
    },
    newTaxId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      current: this.variant,
      pricing: []
    }
  },
  computed: {
    groups () {
      return this.$store.state.core.customerGroups
    },
    taxes () {
      return this.$store.state.core.taxes
    }
  },
  watch: {
    variantId () {
      this.setUpGroupPrices()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setUpGroupPrices()
    })
  },
  methods: {
    handleChange () {
      this.$emit('input', this.pricing)
    },
    setUpGroupPrices () {
      this.pricing = this.initialPricing

      const pricingGroups = map(this.pricing, (price) => {
        return price.customer_group_id
      })

      const remaining = filter(this.groups, (g) => {
        return !pricingGroups.includes(g.id)
      })

      each(remaining, (group) => {
        this.pricing.push({
          customer_group_id: group.id,
          group_name: group.name,
          price: this.newPrice,
          tax_id: this.newTaxId || first(this.taxes).id
        })
      })

      if (remaining.length) {
        this.$emit('input', this.pricing)
      }
    }
  }
}
</script>
