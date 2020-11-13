const find = require('lodash/find')
const filter = require('lodash/filter')

export default class HubUser {
  constructor (user) {
    this.email = user.email
    this.id = user.id
    this.roles = user.roles.data

    const details = null // meh, that'll do

    if (!details) {
      // TODO: Don't hardcode this in, maybe go to null?
      this.area = 'order-processing.dashboard'
    } else {
      const fields = details.fields
      this.area = fields.hub_area || 'order-processing.dashboard'
    }

    this.permissions = []

    // user.roles.data.forEach((role) => {
    //     // const permissions = role.permissions.data
    //     this.permissions = []
    // })
  }

  getUser () {
    return this.user
  }

  can (check) {
    return this.performCheck('permissions', check)
  }

  hasRole (check) {
    return this.performCheck('roles', check)
  }

  performCheck (field, check) {
    let result = true
    if (Array.isArray(check)) {
      result = filter(this[field], (item) => {
        return check.includes(item.guard_name) || check.includes(item.name)
      }).length
    } else {
      result = find(this[field], (item) => {
        return item.name === check || item.guard_name === check
      })
    }
    return Boolean(result)
  }
}
