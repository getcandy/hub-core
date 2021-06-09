<template>
  <div v-if="user">
    <toolbar :heading="user && user.name ? user.name : user.email">
      <div>
        <gc-button theme="green" :loading="fetchingImpersonateToken" @click="handleImpersonate">
          {{ $t('Impersonate') }}
        </gc-button>
      </div>
      <div class="ml-2">
        <gc-button @click="save">
          {{ $t('Save User') }}
        </gc-button>
      </div>
    </toolbar>
    <quick-view-panel :open="showImpersonateChannelSelect" heading="Select channel">
      <div class="p-4">
        <gc-form-field label="Select a channel">
          <gc-select v-model="channelToImpersonate">
            <option readonly>
              Select channel
            </option>
            <option v-for="channel in channels" :key="channel.id" :value="channel.id">
              {{ channel.name }}
            </option>
          </gc-select>
        </gc-form-field>
        <gc-button theme="green" :loading="fetchingImpersonateToken" @click="impersonate">
          {{ $t('Impersonate') }}
        </gc-button>
      </div>
    </quick-view-panel>
    <div class="p-6 bg-white">
      <div class="flex">
        <div class="w-3/4">
          <div class="grid grid-cols-2 gap-4">
            <gc-form-field :label="$t('Name')" :error="getFirstFormError('name')">
              <gc-input v-model="user.name" />
            </gc-form-field>
            <gc-form-field :label="$t('Email')" :error="getFirstFormError('email')" required>
              <gc-input v-model="user.email" type="email" />
            </gc-form-field>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <gc-form-field :label="$t('New Password')" :error="getFirstFormError('password')">
              <gc-input v-model="newPassword" type="password" name="password" autocomplete="new-password" />
            </gc-form-field>
            <gc-form-field :label="$t('New Password Confirmation')" required>
              <gc-input v-model="newPasswordConfirmation" type="password" />
            </gc-form-field>
          </div>
        </div>
        <div class="w-1/4 ml-6">
          <div class="w-full border rounded shadow-sm">
            <header class="p-3 bg-gray-100 border-b">
              <h3 class="text-xs font-bold text-gray-600 uppercase">
                Customer Info
              </h3>
            </header>
            <template v-if="customer">
              <div class="p-3 mb-3 border-b">
                <nuxt-link
                  :to="{
                    name: 'customers.edit',
                    params: {
                      id: customer.id
                    }
                  }"
                >
                  <strong class="">
                    <span v-if="customer.company_name">
                      {{ customer.company_name }}
                    </span>
                    <span v-else>
                      {{ customer.firstname }} {{ customer.lastname }}
                    </span>
                  </strong>
                </nuxt-link>
              </div>
              <div class="px-3 pb-2">
                <span v-for="(group, index) in customerGroups" :key="group.id">{{ group.name }}<span v-if="index + 1 < customerGroups.length">, </span></span>
              </div>
            </template>
            <span v-else class="block p-4 text-sm">{{ $t('This user is not associated to a customer') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="px-6 border-b border-gray-200">
      <nav class="flex -mb-px">
        <button
          v-for="tab in tabs"
          :key="tab.handle"
          type="button"
          :class="{
            'border-indigo-500 text-indigo-600': currentTab == tab.handle,
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300': currentTab != tab.handle
          }"
          class="px-4 py-4 text-sm font-medium leading-5 whitespace-no-wrap border-b-2 focus:outline-none"
          @click="currentTab = tab.handle"
        >
          {{ $t(tab.label) }}
        </button>
      </nav>
    </div>
    <div>
      <address-manager v-if="currentTab == 'addresses'" :user-id="user.id" :addresses="user.addresses.data" @remove="removeAddress" @updated="$fetch" />
      <user-dashboard v-if="currentTab == 'dashboard'" :user-id="user.id" />
      <order-history v-if="currentTab == 'order-history'" :orders="orders" />
    </div>
  </div>
</template>

<script>
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'
import OrderHistory from './components/OrderHistory.vue'
import UserDashboard from './components/UserDashboard.vue'

const get = require('lodash/get')
const find = require('lodash/find')
const first = require('lodash/first')

export default {
  components: {
    OrderHistory,
    UserDashboard
  },
  mixins: [
    HandlesForms
  ],
  async fetch () {
    const { id } = this.$route.params
    const response = await this.$getcandy.on('users', 'getUsersUserId', id, {
      query: {
        include: 'orders,addresses.country,customer.customerGroups'
      }
    })
    this.user = get(response, 'data.data')
    this.orders = get(response, 'data.data.orders.data', [])
  },
  data () {
    return {
      user: null,
      orders: [],
      currentTab: 'dashboard',
      fetchingImpersonateToken: false,
      channelToImpersonate: null,
      showImpersonateChannelSelect: false,
      tabs: [
        { label: 'Dashboard', handle: 'dashboard' },
        { label: 'Order History', handle: 'order-history' },
        { label: 'Addresses', handle: 'addresses' }
      ],
      newPassword: null,
      newPasswordConfirmation: null
    }
  },
  computed: {
    customer () {
      return get(this.user, 'customer.data', {})
    },
    customerGroups () {
      return get(this.customer, 'customer_groups.data', [])
    },
    channels () {
      return this.$store.state.core.channels
    }
  },
  methods: {
    removeAddress (index) {
      this.user.addresses.data.splice(index, 1)
    },
    async handleImpersonate () {
      if (this.channels.length > 1) {
        this.showImpersonateChannelSelect = true
        return
      }
      this.channelToImpersonate = first(this.channels).id
      await this.impersonate()
    },
    async impersonate () {
      this.fetchingImpersonateToken = true

      try {
        const { data } = await this.$gc.$http.post('auth/impersonate', {
          encoded_id: this.user.id
        })
        const token = data.access_token

        const impersonatePath = (this.$config.impersonatePath || '/impersonate/:token').replace(':token', token.accessToken)

        const channel = find(this.channels, channel => channel.id === this.channelToImpersonate)

        window.open(`${channel.url}${impersonatePath}`, '_blank')
      } catch (error) {

      }

      this.fetchingImpersonateToken = false
    },
    save () {
      let data = this.user

      if (this.newPassword) {
        data = {
          ...data,
          password: this.newPassword,
          password_confirmation: this.newPasswordConfirmation
        }
      }
      this.$getcandy.on('users', 'putUsersUserId', this.user.id, data).then(() => {
        this.$notify.queue('success', this.$t('User updated'))
      }).catch((error) => {
        this.setFormErrors(error.response.data.errors)
      })
    }
  },
  head () {
    return {
      title: this.user ? this.user.email : null
    }
  }
}
</script>
