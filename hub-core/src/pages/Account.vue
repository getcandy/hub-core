<template>
  <div>
    <form @submit.prevent="save">
      <toolbar heading="Account Settings" sub-heading="Manage your personal account settings">
        <div class="flex">
          <div class="mr-4">
            <gc-button type="submit">
              <gc-icon icon="rotate-clockwise" class="animate-spin" v-if="processing" />
              <span v-else>{{ $t('Save account details') }}</span>
            </gc-button>
          </div>
          <div>
            <gc-button @click="$auth.logout()" type="button" theme="danger">
              {{ $t('Logout') }}
            </gc-button>
          </div>
        </div>
      </toolbar>
      <div  class="bg-white shadow  px-6 py-8">
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
              <gc-form-field :label="$t('Email address')" required>
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
              <div class="mr-2 w-1/3">
                <gc-form-field :label="$t('Current password')">
                  <gc-input v-model="currentPassword" type="password" />
                </gc-form-field>
              </div>
              <div class="ml-2 w-1/3">
                <gc-form-field :label="$t('New password')">
                  <gc-input v-model="newPassword" type="password" />
                </gc-form-field>
              </div>
              <div class="ml-2 w-1/3">
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
export default {
  head() {
    return {
      title: this.$t("Account settings")
    };
  },
  data() {
    return {
      currentPassword: null,
      newPassword: null,
      newPasswordConfirm: null,
      defaultPage: "Default page",
      processing: false
    };
  },
  async asyncData({ app }) {
    const response = await app.$gc.users.current();

    const user = response.data.data

    return {
      user,
      details: user.customer.data || {}
    };
  },
  methods: {
    save() {
      this.processing = true
      const data = this.details
      data.email = this.user.email
      if (this.newPassword) {
        data.password = this.newPassword
        data.password_confirm = this.newPasswordConfirm
      }
      this.$gc.users.update(this.user.id, data).then(result => {
        this.$notify.queue('success', this.$t('Details saved'))
      }).catch(error => {
        this.$notify.queue('error', this.$t('Unable to save details'))
      }).finally(res => {
        this.processing = false
      })
    }
  }
};
</script>
