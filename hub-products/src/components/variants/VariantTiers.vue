<template>
  <div class="flex flex-col">
    <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div class="align-middle inline-block min-w-full overflow-hidden border-b border-gray-200">
        <table class="min-w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('Lower Limit') }}
              </th>
              <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('Price') }}
              </th>
              <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('Customer Group')}}
              </th>
              <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white" v-for="(tier, index) in tiers" :key="index">
              <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                <b-input v-model="tier.lower_limit" type="number" @input="handleChange(tier)" :expanded="true" />
              </td>
              <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                <price-input v-model="tier.price" @input="handleChange(tier)"  :expanded="true" />
              </td>
              <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                <select-input placeholder="Select customer group" :expanded="true" v-model="tier.group.id">
                  <option
                    v-for="group in customerGroups"
                    :value="group.id"
                    :key="group.id"
                  >
                    {{ group.name }}
                    </option>
                </select-input>
              </td>
              <td class="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                <gc-button @click="remove(index)" theme="danger" size="x-small"><i class="ri-close-line" /></gc-button>
              </td>

            </tr>
          </tbody>
        </table>
        <div class="p-4 text-center">
          <gc-button @click="add" size="x-small" theme="outline">{{ $t('Add Tier') }}</gc-button>
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
    data() {
      return {
        tiers: []
      }
    },
    props: {
      variant: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      add() {
        this.tiers.push({
          lower_limit : '',
          price : 0,
          group : {
            id: this.customerGroups[0].id
          }
        });
      },
      handleChange (tier) {
        if (tier.lower_limit && tier.price) {
          this.$emit('change', this.variant)
        }
      },
      remove(index) {
        this.tiers.splice(index, 1);
        this.$emit('change', this.variant)
      },
    },
    mounted() {
      this.tiers = this.variant.tiers.data
    },
    computed: {
      customerGroups() {
        return this.$store.state.core.customerGroups
      }
    }
  }
</script>
