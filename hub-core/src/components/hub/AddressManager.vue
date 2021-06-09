<template>
  <div>
    <div class="flex justify-between px-6 py-4">
      <div>
        <button
          v-for="addressType in addressTypes"
          :key="addressType.handle"
          class="px-3 py-2 mr-2 text-sm rounded outline-none focus:outline-none"
          :class="{
            'bg-indigo-500 text-white shadow': addressType.handle === type,
            'bg-gray-200 shadow-sm  hover:bg-gray-300' : addressType.handle != type
          }"
          @click="type = addressType.handle"
        >
          {{ $t(addressType.label) }} ({{ getAddresses(addressType.handle).length }})
        </button>
      </div>
      <gc-button @click="setUpNewAddress">
        {{ $t('Add new address') }}
      </gc-button>
    </div>
    <gc-table
      :data="filteredAddresses"
      :columns="tableColumns"
    >
      <template v-slot:actions="{ row }">
        <div class="flex">
          <gc-button size="custom" theme="danger" class="px-2 py-1 text-sm" @click="addressToRemove = row">
            <gc-icon icon="trash" size="sm" />
          </gc-button>
          <gc-button size="custom" class="px-2 py-1 ml-2 text-sm" @click="editAddress(row)">
            <gc-icon icon="pencil" size="sm" />
          </gc-button>
        </div>
      </template>
      <template v-slot:salutation="{ row }">
        {{ row.salutation }}
      </template>
      <template v-slot:firstname="{ row }">
        {{ row.firstname }}
      </template>
      <template v-slot:lastname="{ row }">
        {{ row.lastname }}
      </template>
      <template v-slot:email="{ row }">
        {{ row.email }}
      </template>
      <template v-slot:phone="{ row }">
        {{ row.phone }}
      </template>
      <template v-slot:company_name="{ row }">
        {{ row.company_name }}
      </template>
      <template v-slot:address="{ row }">
        {{ row.address }}
      </template>
      <template v-slot:address_two="{ row }">
        {{ row.address_two }}
      </template>
      <template v-slot:address_three="{ row }">
        {{ row.address_three }}
      </template>
      <template v-slot:city="{ row }">
        {{ row.city }}
      </template>
      <template v-slot:postal_code="{ row }">
        {{ row.postal_code }}
      </template>
      <template v-slot:country="{ row }">
        {{ getCountryName(row.country) }}
      </template>
    </gc-table>
    <simple-modal
      heading="Remove address"
      :open="!!addressToRemove"
      @confirmed="removeAddress"
      @close="addressToRemove = null"
    >
      {{ $t('Are you sure you? This is a permanent action and cannot be reversed.') }}
    </simple-modal>
    <quick-view-panel :open="!!address" heading="Edit address" width="w-1/3" @close="cancel">
      <form v-if="address" class="p-4" @submit.prevent="saveAddress">
        <gc-form-field label="Type">
          <label>
            <input v-model="address.type" type="radio" value="billing">
            <span>Billing</span>
          </label>
          <label>
            <input v-model="address.type" type="radio" value="shipping">
            <span>Shipping</span>
          </label>
        </gc-form-field>
        <div class="grid grid-cols-3 gap-4">
          <gc-form-field label="Salutation">
            <gc-select v-model="address.salutation">
              <option value="Mr">
                Mr
              </option>
              <option value="Mrs">
                Mrs
              </option>
              <option value="Miss">
                Miss
              </option>
              <option value="Dr">
                Dr
              </option>
              <option value="Ms">
                Ms
              </option>
              <option value="Prof">
                Prof
              </option>
            </gc-select>
          </gc-form-field>
          <gc-form-field label="Firstname" :error="getFirstFormError('firstname')" required>
            <gc-input v-model="address.firstname" />
          </gc-form-field>
          <gc-form-field label="Lastname" :error="getFirstFormError('lastname')" required>
            <gc-input v-model="address.lastname" />
          </gc-form-field>
        </div>
        <gc-form-field label="Company Name">
          <gc-input v-model="address.company_name" />
        </gc-form-field>
        <div class="grid grid-cols-2 gap-4">
          <gc-form-field label="Email">
            <gc-input v-model="address.email" type="email" />
          </gc-form-field>
          <gc-form-field label="Telephone">
            <gc-input v-model="address.phone" type="tel" />
          </gc-form-field>
        </div>
        <gc-form-field label="Address" :error="getFirstFormError('address')" required>
          <gc-input v-model="address.address" />
        </gc-form-field>
        <div class="grid grid-cols-2 gap-4">
          <gc-form-field label="Address line two">
            <gc-input v-model="address.address_two" />
          </gc-form-field>
          <gc-form-field label="Address line three">
            <gc-input v-model="address.address_three" />
          </gc-form-field>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <gc-form-field label="City" :error="getFirstFormError('city')" required>
            <gc-input v-model="address.city" />
          </gc-form-field>
          <gc-form-field label="Postal Code" :error="getFirstFormError('postal_code')" required>
            <gc-input v-model="address.postal_code" />
          </gc-form-field>
        </div>
        <gc-form-field label="Country" :error="getFirstFormError('country_id')" required>
          <gc-select v-model="address.country_id">
            <option v-for="country in countries" :key="country.id" :value="country.id">
              {{ country.name }}
            </option>
          </gc-select>
        </gc-form-field>
        <gc-button theme="gray" type="button" class="mr-4" @click="cancel">
          {{ $t('Cancel') }}
        </gc-button>
        <gc-button v-if="address.id" type="button" theme="green" class="mr-4" @click="duplicate">
          <template v-if="address.type == 'billing'">
            {{ $t('Duplicate to shipping') }}
          </template>
          <template v-else>
            {{ $t('Duplicate to billing') }}
          </template>
        </gc-button>
        <gc-button>
          {{ $t(address.id ? 'Save Address' : 'Create Address') }}
        </gc-button>
      </form>
    </quick-view-panel>
  </div>
</template>

<script>
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'
const filter = require('lodash/filter')
const findIndex = require('lodash/findIndex')
const get = require('lodash/get')

export default {
  mixins: [
    HandlesForms
  ],
  props: {
    addresses: {
      type: Array,
      default: () => []
    },
    userId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      type: 'billing',
      addressToRemove: null,
      address: null,
      countries: []
    }
  },
  computed: {
    filteredAddresses () {
      return this.getAddresses(this.type)
    },
    addressTypes () {
      return [
        {
          label: 'Billing',
          handle: 'billing'
        },
        {
          label: 'Shipping',
          handle: 'shipping'
        }
      ]
    },
    tableColumns () {
      return [
        {
          label: 'Actions',
          field: 'actions'
        },
        {
          label: 'Salutation',
          field: 'salutation'
        },
        {
          label: 'Firstname',
          field: 'firstname'
        },
        {
          label: 'Lastname',
          field: 'lastname'
        },
        {
          label: 'Email',
          field: 'email'
        },
        {
          label: 'Phone',
          field: 'phone'
        },
        {
          label: 'Company Name',
          field: 'company_name'
        },
        {
          label: 'Address',
          field: 'address'
        },
        {
          label: 'Address Line Two',
          field: 'address_two'
        },
        {
          label: 'Address Line Three',
          field: 'address_three'
        },
        {
          label: 'City',
          field: 'city'
        },
        {
          label: 'Postal Code',
          field: 'postal_code'
        },
        {
          label: 'Country',
          field: 'country'
        }
      ]
    }
  },
  async mounted () {
    const { data } = await this.$getcandy.on('countries', 'getCountries')

    this.countries = data.data
  },
  methods: {
    editAddress (address) {
      this.address = JSON.parse(
        JSON.stringify(address)
      )
      this.address.country_id = get(address, 'country.data.id', null)
      this.address.type = address.shipping ? 'shipping' : 'billing'
    },
    setUpNewAddress () {
      this.address = {
        type: 'billing',
        country_id: null
      }
    },
    async saveAddress (duplicate = false) {
      try {
        const address = this.address
        if (!duplicate) {
          address.shipping = address.type === 'shipping'
          address.billing = address.type === 'billing'
        }

        if (this.address.id) {
          await this.$gc.$http.put(`/addresses/${this.address.id}`, address)
        } else {
          address.user_id = this.userId
          address.state = address.city
          await this.$gc.$http.post('/addresses', address)
        }

        this.$notify.queue('success', this.$t(duplicate ? 'Address duplicated' : 'Address updated'))
        this.address = null
        this.$emit('updated')
      } catch (error) {
        this.setFormErrors(error.response.data.errors)
        this.$notify.queue(
          'error',
          this.$t(
            duplicate ? 'Unable to duplicate address' : (this.address.id ? 'Unable to update address' : 'Unable to create address')
          )
        )
      }
    },
    async duplicate () {
      this.address.billing = this.address.type === 'shipping'
      this.address.shipping = this.address.type === 'billing'
      delete this.address.id
      delete this.address.last_used_at
      delete this.address.meta
      delete this.address.delivery_instructions
      if (!this.address.email) {
        delete this.address.email
      }
      if (!this.address.salutation) {
        delete this.address.salutation
      }
      await this.saveAddress(true)
    },
    getCountryName (country) {
      return get(country, 'data.name', '-')
    },
    getAddresses (type) {
      return filter(this.addresses, address => !!address[type])
    },
    cancel () {
      this.address = null
      this.setFormErrors({})
    },
    async removeAddress () {
      try {
        await this.$getcandy.on('addresses', 'deleteAddressesAddressId', this.addressToRemove.id)
        // Find the index in the addresses this belongs to.
        const index = findIndex(this.addresses, address => address.id === this.addressToRemove.id)
        this.$emit('remove', index)
        this.addressToRemove = null
        this.$notify.queue('success', this.$t('Address removed'))
      } catch (e) {
        this.$notify.queue('error', this.$t('Unable to remove address'))
      }
    }
  }
}
</script>
