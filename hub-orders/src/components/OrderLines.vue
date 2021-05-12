<template>
  <div class="search-table">
    <div class="b-table">
      <table class="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>{{ $t('SKU') }}</th>
            <th>{{ $t('Product') }}</th>
            <th>{{ $t('Option') }}</th>
            <th>{{ $t('QTY') }}</th>
            <th>{{ $t('Unit Price') }}</th>
            <th>{{ $t('Shipping') }}</th>
            <th>{{ $t('Discount') }}</th>
            <th>{{ $t('Tax Rate') }}</th>
            <th>{{ $t('Tax Amount') }}</th>
            <th>{{ $t('Total') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="line in basketLines" :key="line.id">
            <td>
              <nuxt-link :to="{
                name: 'products',
                query: {
                  keywords: line.sku
                }
              }">{{ line.sku }}</nuxt-link>
            </td>
            <td>{{ line.description }}</td>
            <td>{{ line.option }}</td>
            <td>{{ line.quantity }}</td>
            <td v-html="$format.currency(line.unit_price, currency)" />
            <td v-html="$format.currency(line.delivery_total, currency)" />
            <td v-html="$format.currency(line.discount_total, currency)" />
            <td>{{ line.tax_rate }}</td>
            <td v-html="$format.currency(line.tax_total, currency)" />
            <td v-html="$format.currency(line.line_total - line.discount_total, currency)" />
          </tr>
          <tr>
            <td colspan="9" align="right">
              {{ $t('Sub Total') }}
            </td>
            <td colspan="9" v-html="$format.currency(order.sub_total, currency)" />
          </tr>
          <tr v-for="line in shippingLines" :key="line.id">
            <td>-</td>
            <td v-html="line.description"/>
            <td>{{ line.option }}</td>
            <td>{{ line.quantity }}</td>
            <td v-html="$format.currency(line.unit_price, currency)" />
            <td v-html="$format.currency(line.delivery_total, currency)" />
            <td v-html="$format.currency(line.discount_total, currency)" />
            <td>{{ line.tax_rate }}</td>
            <td v-html="$format.currency(line.tax_total, currency)" />
            <td v-html="$format.currency(line.line_total - line.discount_total, currency)" />
          </tr>
          <tr>
            <td colspan="9" align="right">
              {{ $t('Tax') }}
            </td>
            <td colspan="9" v-html="$format.currency(order.tax_total, currency)" />
          </tr>
          <tr>
            <td colspan="9" align="right" >
              {{ $t('Total') }}
            </td>
            <td colspan="9" v-html="$format.currency(order.order_total, currency)" />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  const filter = require('lodash/filter')
  export default {
    props: {
      currency: {
        type: Object,
        default: null
      },
      order: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      basketLines() {
        return filter(this.order.lines.data, line => !line.is_shipping)
      },
      shippingLines() {
        return filter(this.order.lines.data, line => line.is_shipping)
      },
    }
  }
</script>
