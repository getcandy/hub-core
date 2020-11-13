<template>
  <div>
    <div class="md:flex">
      <div class="mx-8 lg:w-2/5 lg:ml-48 lg:mt-48 lg:mr-32">
        <div class="my-8 w-48">
          <get-candy-logo />
        </div>
        <div class="mb-4">
          <span class="text-purple-800 text-xl block">Welcome to</span>
          <strong class="text-purple-800 text-3xl uppercase">The Hub</strong>
        </div>
          <form @submit.prevent="process" action="" class="has-margin-top-20">
            <form-field :label="$t('Email')" :error="getError('email')" required>
              <gc-input v-model="email" type="email" required />
            </form-field>
            <form-field :label="$t('Password')" :error="getError('password')" required v-if="!forgotPassword">
              <gc-input v-model="password" type="password" required />
            </form-field>
            <div>
              <gc-button :disabled="processing" type="submit" :loading="processing" theme="green">
                <span>{{ $t(forgotPassword ? 'Send reset email' : 'Sign in') }}</span>
              </gc-button>
            </div>
            <div class="text-red-600 mt-4 text-sm" v-if="message">
              {{ message }}
            </div>
          </form>
      </div>
      <div class="login-image hidden lg:block w-full h-screen">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  data () {
    return {
      email: '',
      password: '',
      message: '',
      processing: false,
      forgotPassword: false,
      errors: {}
    }
  },
  head () {
    return {
      title: this.$t('Login')
    }
  },
  computed: {
    config () {
      return this.$config
    }
  },
  methods: {
    async forgot () {
      const response = await this.$gc.generic.post('password/reset/request', {
        email: this.email,
      })
    },
    async process () {
      if (this.forgotPassword) {
        this.forgot()
      } else {
        this.login()
      }
    },
    async login (event) {
      this.errors = {}
      this.message = null
      this.processing = true
      try {
        if (this.config.auth == 'sanctum') {
          await this.$axios.get('/sanctum/csrf-cookie')
        }
        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        })
        if (this.$auth.loggedIn) {
          if (this.$auth.user.area) {
            await this.$router.push({ name: this.$auth.user.area })
          } else {
            await this.$router.back()
          }
        } else {
          this.password = null
          this.processing = false
          this.message = 'You are not authorised to access the hub'
        }
      } catch (e) {
        if (e.response) {
          const response = e.response.data
          if (response.errors) {
            this.errors = response.errors
          }
          this.message = response.error || response.message
        } else {
          if (window.console) {
            console.error(e)
            this.message = 'Something went wrong, check the console for more info.'
          } else {
            this.message = 'Something went wrong'
          }

        }
      }
      this.processing = false
    },
    getType (field) {
      if (this.errors[field] && this.errors[field].length) {
        return 'is-danger'
      }
      return null
    },
    getError (field) {
      return this.errors[field] || null
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-image {
    background-image: url('~assets/images/sweet-jar.jpg');
    background-size:cover;
    background-repeat:no-repeat;
  }
</style>
