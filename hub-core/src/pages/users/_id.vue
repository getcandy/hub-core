<template>
  <div>
    <toolbar :heading="user.name">

    </toolbar>
    <div class="bg-white p-6" >
      <div class="grid gap-4 grid-cols-2">
        <form-field :label="$t('Name')">
          <gc-input v-model="user.name" />
        </form-field>
        <form-field :label="$t('Email')"  required>
          <gc-input v-model="user.email" type="email" />
        </form-field>
      </div>
      <div class="grid gap-4 grid-cols-2">
        <form-field :label="$t('New Password')">
          <gc-input v-model="newPassword" type="password" />
        </form-field>
        <form-field :label="$t('New Password Confirmation')"  required>
          <gc-input v-model="newPasswordConfirmation" type="password" />
        </form-field>
      </div>
    </div>
    <div class="border-b border-gray-200 px-6">
      <nav class="-mb-px flex">
        <button
          type="button"
          v-for="tab in tabs"
          :key="tab.handle"
          @click="currentTab = tab.handle"
          :class="{
            'border-indigo-500 text-indigo-600': currentTab == tab.handle,
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300': currentTab != tab.handle
          }"
          class="whitespace-no-wrap py-4 px-4 border-b-2 font-medium text-sm leading-5  focus:outline-none"
        >
          {{ $t(tab.label) }}
        </button>
      </nav>
    </div>
    <div class="bg-white">
      <order-history :orders="orders" />
    </div>
  </div>
</template>

<script>
const get = require('lodash/get')

import OrderHistory from './components/OrderHistory.vue'

export default {
  components: {
    OrderHistory
  },
  data () {
    return {
      currentTab: 'order-history',
      tabs: [
        {label: 'Order History', handle: 'order-history'}
      ],
      newPassword: null,
      newPasswordConfirmation: null,
    }
  },
  async asyncData ({ app, params, query }) {

    const response = await app.$getcandy.on('Users').getUsersUserId(params.id, {
      query: {
        include: 'orders,addresses'
      }
    })

    return {
      user: get(response, 'data.data'),
      orders: get(response, 'data.data.orders.data', [])
    }

    // return {
    //   item: response.data.data,
    //   attributeGroups: attributeGroupResponse.data.data,
    //   type: query.type,
    //   recyclable: response.data.data.recyclable
    // }
  }
}
</script>
