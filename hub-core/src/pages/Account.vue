<template>
  <div>
    <form @submit.prevent="save">
      <toolbar heading="Account Settings" sub-heading="Manage your personal account settings">
        <div class="flex">
          <div class="mr-4">
            <gc-button type="submit">
              <gc-icon v-if="processing" icon="rotate-clockwise" class="animate-spin" />
              <span v-else>{{ $t('Save account details') }}</span>
            </gc-button>
          </div>
          <div>
            <gc-button type="button" theme="danger" @click="$auth.logout()">
              {{ $t('Logout') }}
            </gc-button>
          </div>
        </div>
      </toolbar>
      <div class="px-6 py-8 bg-white shadow">
        <div class="flex">
          <div class="w-1/5">
            <h3>Personal Details</h3>
          </div>
          <div class="w-full">
            <div>
              <gc-form-field :label="$t('Name')">
                <gc-input v-model="user.name" />
              </gc-form-field>
              <div class="mt-4">
                <gc-form-field :label="$t('Email address')" :error="getFirstFormError('email')" required>
                  <gc-input v-model="user.email" />
                </gc-form-field>
              </div>
            </div>
          </div>
        </div>
        <div class="flex mt-6">
          <div class="w-1/5">
            <h3>Security Details</h3>
          </div>
          <div class="w-full">
            <div>
              <div class="flex w-full">
                <div class="w-1/3 mr-2">
                  <gc-form-field :label="$t('Current password')">
                    <gc-input v-model="currentPassword" type="password" />
                  </gc-form-field>
                </div>
                <div class="w-1/3 ml-2">
                  <gc-form-field :label="$t('New password')" :error="getFirstFormError('password')">
                    <gc-input v-model="newPassword" type="password" />
                  </gc-form-field>
                </div>
                <div class="w-1/3 ml-2">
                  <gc-form-field :label="$t('New password confirmation')">
                    <gc-input v-model="newPasswordConfirm" type="password" />
                  </gc-form-field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>

  </div>
</template>

<script>
import HandlesForms from '@getcandy/hub-core/src/mixins/HandlesForms.js'

export default {
  mixins: [
    HandlesForms
  ],
  async asyncData ({ app }) {
    const response = await app.$getcandy.on('users', 'getUsersCurrent', {
      query: {
        include: 'customer'
      }
    })

    const user = response.data.data

    return {
      user,
      details: {}
    }
  },
  data () {
    return {
      currentPassword: null,
      newPassword: null,
      newPasswordConfirm: null,
      defaultPage: 'Default page',
      processing: false
    }
  },
  methods: {
    async save () {
      this.processing = true
      const data = this.details
      data.email = this.user.email
      if (this.newPassword) {
        data.password = this.newPassword
        data.password_confirmation = this.newPasswordConfirm
      }
      this.clearFormErrors()
      try {
        await this.$getcandy.on('users', 'putUsersUserId', this.user.id, data)
        this.$notify.queue('success', this.$t('Details saved'))
      } catch (error) {
        this.setFormErrors(error.response.data.errors)
        this.$notify.queue('error', this.$t('Unable to save details'))
      }

      this.processing = false
    }
  },
  head () {
    return {
      title: this.$t('Account settings')
    }
  }
}
</script>
