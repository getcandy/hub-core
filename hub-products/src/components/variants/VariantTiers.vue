<template>
  <div class="flex flex-col">
    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200">
        <table class="min-w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                {{ $t('Lower Limit') }}
              </th>
              <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                {{ $t('Price') }}
              </th>
              <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                {{ $t('Customer Group') }}
              </th>
              <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tier, index) in tiers" :key="index" class="bg-white">
              <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                <gc-input v-model="tier.lower_limit" type="number" :expanded="true" :min="2" @input="handleChange(tier)" />
                <span v-if="tier.lower_limit <= 1" class="text-xs text-red-600">{{ $t('Lower limit must be at least 2') }}</span>
              </td>
              <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                <gc-price-input v-model="tier.price" :expanded="true" :is-cents="false" @input="handleChange(tier)" />
              </td>
              <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                <gc-select-input v-model="tier.group.id" placeholder="Select customer group" :expanded="true" @input="handleChange(tier)">
                  <option
                    v-for="group in customerGroups"
                    :key="group.id"
                    :value="group.id"
                  >
                    {{ group.name }}
                  </option>
                </gc-select-input>
              </td>
              <td class="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap">
                <gc-button theme="danger" size="x-small" @click="remove(index)">
                  <i class="ri-close-line" />
                </gc-button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="p-4 text-center">
          <gc-button size="x-small" theme="outline" @click="add">
            {{ $t('Add Tier') }}
          </gc-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      tiers: []
    }
  },
  computed: {
    customerGroups () {
      return this.$store.state.core.customerGroups
    }
  },
  mounted () {
    this.tiers = this.variant.tiers.data
  },
  methods: {
    add () {
      this.tiers.push({
        lower_limit: '',
        price: 0,
        group: {
          id: this.customerGroups[0].id
        }
      })
    },
    handleChange (tier) {
      if (tier.lower_limit && tier.price) {
        this.$emit('change', this.variant)
      }
    },
    remove (index) {
      this.tiers.splice(index, 1)
      this.$emit('change', this.variant)
    }
  }
}
</script>
