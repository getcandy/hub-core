<template>
  <div>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>{{ $t('Zone') }}</th>
          <th>{{ $t('Enabled') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="zone in shippingZones" :key="zone.id">
          <td>
            {{ zone.name }}
          </td>
          <td>
            <b-switch :value="value.includes(zone.id)" @input="input($event, zone.id)">
            </b-switch>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- {{ shippingZones }}
    {{ value }} -->
  </div>
</template>

<script>
  export default {
    props: ['value'],
    data () {
      return {
        zones: null,
      }
    },
    mounted () {
      if (!this.shippingZones.length) {
        this.$store.dispatch('shippingZones/fetch', this)
      }
    },
    computed: {
      shippingZones () {
        return this.$store.state.shippingZones.items
      }
    },
    methods: {
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
