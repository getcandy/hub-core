import LocalScheme from '@nuxtjs/auth/lib/schemes/local'
import HubUser from '@getcandy/hub-core/src/modules/HubUser.js'

export default class SanctumScheme extends LocalScheme {
  // Override `fetchUser` method of `local` scheme
  async fetchUser (endpoint) {
    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
      return
    }

    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user
    const user = await this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    )

    const hubUser = new HubUser(user)

    if (!hubUser.hasRole('admin') && !hubUser.can('access-hub')) {
      await this.logout()
      return
    }

    this.$auth.setUser(hubUser)
  }
}
