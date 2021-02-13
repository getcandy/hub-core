<template>
  <div>
    <gc-table
      :data="shippingZones"
      :columns="[
        {label: 'Zone', field: 'zone'},
        {label: 'Enabled', field: 'enabled'}
      ]"
    >
      <template v-slot:zone="{ row }">
        {{ row.name }}
      </template>
      <template v-slot:enabled="{ row }">
        <gc-toggle :value="zoneIsActive(row)" @input="input($event, row)" />
      </template>
    </gc-table>
  </div>
</template>

<script>
  const find = require('lodash/find')

  export default {
    props: ['value'],
    data () {
      return {
        zones: null,
      }
    },
    mounted () {
      if (!this.shippingZones.length) {
        this.$store.dispatch('shippingZones/fetch', {
          context: this.$getcandy
        })
      }
    },
    computed: {
      shippingZones () {
        return this.$store.state.shippingZones.items
      }
    },
    methods: {
      zoneIsActive (row) {
        return find(this.value, zone => zone.id === row.id)
      },
      input (enabled, id) {
        let values = this.value;

        if (enabled && !values.includes(id)) {
          values.push(id)
        } else if (!enabled) {
          values.splice(values.indexOf(id), 1)
        }
        this.$emit('input', values)
      }
    }
  }
</script>
