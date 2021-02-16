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
                <b-input v-model="tier.lower_limit" type="number" :expanded="true" @input="handleChange(tier)" />
              </td>
              <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                <gc-price-input v-model="tier.price" :expanded="true" :is-cents="false" @input="handleChange(tier)" />
              </td>
              <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                <select-input v-model="tier.group.id" placeholder="Select customer group" :expanded="true">
                  <option
                    v-for="group in customerGroups"
                    :key="group.id"
                    :value="group.id"
                  >
                    {{ group.name }}
                  </option>
                </select-input>
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
  <!-- <div class="search-table">
    <div class="b-table">
      <table class="table">
        <thead>
          <tr>
            <th>Lower Limit</th>
            <th>Price</th>
            <th>Customer group</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tier, index) in tiers" :key="index">
            <td>

            </td>
            <td>
              <b-input v-model="tier.price" type="number" @input="handleChange(tier)"  :expanded="true" />
            </td>
            <td>
                <b-select placeholder="Select customer group" :expanded="true" v-model="tier.group.id">
                  <option
                    v-for="group in customerGroups"
                    :value="group.id"
                    :key="group.id"
                  >
                    {{ group.name }}
                    </option>
                </b-select>
            </td>
            <td>
              <b-button @click="remove(index)"  type="is-danger" icon-right="close-line" />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5"><b-button @click="add">Add Tier</b-button></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div> -->
  <!-- <div class="card" v-for="(tier, index) in tiers" :key="index">
      <div class="card-content">
        <div class="columns">
          <div class="column">
            <b-field label="Lower Limit">

            </b-field>
          </div>
          <div class="column">
            <b-field label="Price">
              <b-input v-model="tier.price" type="number" @input="handleChange(tier)"  :expanded="true"></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="Customer Group">
              <b-select placeholder="Select customer group" :expanded="true" v-model="tier.group.id">
                <option
                  v-for="group in customerGroups"
                  :value="group.id"
                  :key="group.id"

                >
                  {{ group.name }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div class="column is-1">
            <b-button @click="remove(index)" type="is-danger">
              <b-icon icon="close-line" />
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <b-button @click="add">Add Tier</b-button>
  </div> -->
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
