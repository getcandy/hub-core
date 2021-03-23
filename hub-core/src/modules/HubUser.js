const find = require('lodash/find')
const each = require('lodash/each')
const filter = require('lodash/filter')

export default class HubUser {
  constructor (user) {
    this.email = user.email
    this.name = user.name
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

    each(user.roles.data, (role) => {
      this.permissions = [
        ...this.permissions,
        ...role.permissions.data
      ]
    })

    // user.roles.data.forEach((role) => {
    //     // const permissions = role.permissions.data
    //     this.permissions = []
    // })
  }

  getUser () {
    return this.user
  }

  can (check) {
    if (this.hasRole('admin')) {
      return true
    }
    return this.performCheck('permissions', check)
  }

  hasRole (check) {
    return this.performCheck('roles', check)
  }

  performCheck (field, check) {
    let result = true
    if (!check) {
      return true
    }
    if (Array.isArray(check)) {
      if (!check.length) {
        return true
      }
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
