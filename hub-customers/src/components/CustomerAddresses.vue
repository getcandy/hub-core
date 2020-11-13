<template>
  <div>
    <div class="tabs">
      <ul>
        <li :class="{
          'is-active' : activeTab == 'billing'
        }"><a @click.prevent="activeTab = 'billing'">{{ $t('Billing') }}</a></li>
        <li :class="{
          'is-active' : activeTab == 'shipping'
        }"><a @click.prevent="activeTab = 'shipping'">{{ $t('Shipping') }}</a></li>
      </ul>
    </div>
    <b-table
      :data="filteredAddresses"
    >
      <template slot-scope="props">
        <b-table-column :label="$t('First Name')">
          {{ props.row.firstname }}
        </b-table-column>
        <b-table-column :label="$t('Last Name')">
          {{ props.row.lastname }}
        </b-table-column>
        <b-table-column :label="$t('Address Line 1')">
          {{ props.row.address }}
        </b-table-column>
        <b-table-column :label="$t('Address Line 2')">
          {{ props.row.address_two }}
        </b-table-column>
        <b-table-column :label="$t('Address Line 3')">
          {{ props.row.address_three }}
        </b-table-column>
        <b-table-column :label="$t('City')">
          {{ props.row.city }}
        </b-table-column>
        <b-table-column :label="$t('County')">
          {{ props.row.county }}
        </b-table-column>
        <b-table-column :label="$t('State')">
          {{ props.row.state }}
        </b-table-column>
        <b-table-column :label="$t('Zip')">
          {{ props.row.zip }}
        </b-table-column>
        <b-table-column :label="$t('Country')">
          {{ props.row.country }}
        </b-table-column>
      </template>
      <template slot="empty">
          <section class="section">
              <div class="content has-text-grey has-text-centered">
                  <p>{{ $t('No Data') }}</p>
              </div>
          </section>
      </template>
    </b-table>
  </div>
</template>

<script>
  const filter = require('lodash/filter')
  export default {
    props: {
      addresses: {
        type: Array,
      }
    },
    data() {
      return {
        activeTab: 'billing',
      }
    },
    computed: {
      filteredAddresses() {
        return filter(this.addresses, address => {
          if (this.activeTab == 'billing') {
            return address.billing
          }
          return address.shipping
        })
      }
    }
  }
</script>

<style scoped>

</style>
