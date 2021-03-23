<template>
  <div>
    <div class="relative min-h-screen overflow-hidden bg-white">
      <div class="absolute right-0 hidden w-2/4 h-screen login-image lg:block" />
      <div class="flex items-center min-h-screen bg-no-repeat lg:min-w-3xl xl:min-w-4xl lg:justify-center lg:w-3/5 lg:py-20 lg:pl-8 lg:pr-8">
        <div class="mx-auto w-96">
          <div class="w-64 mb-12">
            <get-candy-logo />
          </div>
          <div class="mb-8">
            <span class="block text-2xl leading-tight text-purple-800">Welcome to</span>
            <strong class="text-4xl leading-tight text-purple-800 uppercase">The Hub</strong>
          </div>
          <form action="" @submit.prevent="process">
            <gc-form-field for="email" :label="$t('Email')" :error="getError('email')">
              <gc-input id="email" ref="emailInput" v-model="email" type="email" required />
            </gc-form-field>
            <gc-form-field v-if="!forgotPassword" for="password" :label="$t('Password')" :error="getError('password')">
              <gc-input id="password" v-model="password" type="password" required />
            </gc-form-field>
            <div class="mt-8">
              <button
                class="px-6 py-3 font-bold text-white uppercase rounded disabled:opacity-50"
                :class="btnStyleClass"
                :disabled="processing"
                type="submit"
                theme="green"
              >
                <span v-if="!processing">{{ $t(forgotPassword ? 'Send reset email' : 'Sign in') }}</span>
                <loading-spinner v-else />
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- This example requires Tailwind CSS v2.0+ -->
      <div v-if="message" class="fixed bottom-0 flex justify-center w-full">
        <div class="max-w-xl p-4 mb-12 rounded-md shadow bg-red-50">
          <div class="flex">
            <div class="flex-shrink-0">
              <!-- Heroicon name: solid/x-circle -->
              <svg class="w-5 h-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ $t('We are unable to log you in, please check your credentials and try again.') }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="bg-red-500">
        <div class="w-48 my-8">
          <get-candy-logo />
        </div>
        <div class="mb-4">
          <span class="block text-xl text-purple-800">Welcome to</span>
          <strong class="text-3xl text-purple-800 uppercase">The Hub</strong>
        </div>
        <form action="" @submit.prevent="process">
          <gc-form-field for="email" :label="$t('Email')" :error="getError('email')" required>
            <gc-input id="email" ref="emailInput" v-model="email" type="email" required />
          </gc-form-field>
          <gc-form-field v-if="!forgotPassword" for="password" :label="$t('Password')" :error="getError('password')">
            <gc-input id="password" v-model="password" type="password" required />
          </gc-form-field>
          <div>
            <gc-button :disabled="processing" type="submit" :loading="processing" theme="green">
              <span>{{ $t(forgotPassword ? 'Send reset email' : 'Sign in') }}</span>
            </gc-button>
          </div>
          <div v-if="message" class="mt-4 text-sm text-red-600">
            {{ message }}
          </div>
        </form>
      </div>
      <div class="hidden h-screen w-72 login-image lg:block" /> -->
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
      btnStyleClass: 'bg-green-400 hover:bg-green-500',
      errors: {}
    }
  },
  computed: {
    config () {
      return this.$config
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.emailInput.$el.querySelector('input').focus()
    })
  },
  methods: {
    async forgot () {
      await this.$gc.generic.post('password/reset/request', {
        email: this.email
      })
    },
    process () {
      if (this.forgotPassword) {
        this.forgot()
      } else {
        this.login()
      }
    },
    async login () {
      this.errors = {}
      this.message = null
      this.processing = true
      try {
        await this.$auth.loginWith('hub', {
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
        this.processing = false
        if (e.response) {
          this.btnStyleClass = 'shake bg-red-500 hover:bg-red-500'

          const response = e.response.data
          if (response.errors) {
            this.errors = response.errors
          }
          if (response.error && response.error.message) {
            this.message = response.error.message
          } else {
            this.message = response.error || response.message
          }
        } else {
          this.message = 'Something went wrong'
        }
      }

      setTimeout(() => {
        this.btnStyleClass = 'bg-green-400 hover:bg-green-500'
      }, 1300)

      setTimeout(() => {
        this.message = null
      }, 2000)
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
  },
  head () {
    return {
      title: this.$t('Login')
    }
  }
}
</script>

<style lang="scss" scoped>
.shake {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
  .login-image {
    background-image: url('~assets/images/sweet-jar.jpg');
    background-size:cover;
    background-repeat:no-repeat;
  }
</style>
