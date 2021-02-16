import moment from 'moment'

export default {
  methods: {
    visibility (collection, ref) {
      let groups
      const visible = []

      if (ref) {
        groups = collection[ref].data
      } else {
        groups = collection.data
      }

      groups.forEach((group) => {
        let label = group.name
        // If this is time based visibility, we need to account for it.
        if (group.published_at) {
          // Is it in the future or is it now.
          const date = moment(group.published_at)
          const now = moment()
          if (date.isAfter(now)) {
            label += ' ' + date.fromNow()
          }
          visible.push(label)
        } else if (group.visible) {
          visible.push(group.name)
        } else if (group.visible === undefined && group.published_at === undefined) {
          visible.push(group.name)
        }
      })

      if (visible.length === groups.length) {
        return 'All'
      }
      if (!visible.length) {
        return 'None'
      }
      return visible.join(', ')
    },
    purchasable (collection, ref) {
      let groups
      const purchasable = []

      if (ref) {
        groups = collection[ref].data
      } else {
        groups = collection.data
      }

      groups.forEach((group) => {
        let label = group.name
        // If this is time based visibility, we need to account for it.
        if (group.published_at) {
          // Is this visible?
          // Is it in the future or is it now.
          const date = moment(group.published_at)
          const now = moment()
          if (date.isAfter(now)) {
            label += ' ' + date.fromNow()
          }
          purchasable.push(label)
        } else if (group.purchasable) {
          purchasable.push(group.name)
        } else if (group.purchasable === undefined && group.published_at === undefined) {
          purchasable.push(group.name)
        }
      })

      if (purchasable.length === groups.length) {
        return 'Yes'
      }
      if (!purchasable.length) {
        return 'No'
      }
      return purchasable.join(', ')
    }
  }
}
