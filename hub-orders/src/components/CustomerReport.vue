<template>
  <div>
    <div v-if="showControls" class="flex items-center px-6 py-3 border-b">
      <div>
        <b-datepicker
          v-model="dates"
          placeholder="Click to select..."
          range
          @input="refresh"
        />
      </div>
      <div class="mx-4">
        <gc-select-input v-model="style" @input="refresh">
          <option value="line">
            Line
          </option>
          <option value="bar">
            Bar
          </option>
        </gc-select-input>
      </div>
      <div>
        <gc-button :loading="exporting" @click="exportReport">
          Export Report
        </gc-button>
      </div>
    </div>
    <div v-show="loading" class="flex h-full p-12">
      <div class="flex items-center text-gray-400">
        <loading-spinner /><span class="ml-2 text-sm font-medium uppercase"> Loading Report</span>
      </div>
    </div>
    <div v-show="!loading">
      <div>
        <div class="p-6">
          <canvas v-if="showGraph" ref="graph" />
        </div>
        <gc-table
          v-if="showTable && !loading"
          :data="data"
          :columns="[
            {label: 'Month', field: 'month'},
            {label: 'New Customers', field: 'new'},
            {label: 'Returning Customers', field: 'returning'},
            {label: 'Returning %', field: 'returning_percent'},
          ]"
        >
          <template v-slot:month="{ row }">
            {{ row.label }}
          </template>
          <template v-slot:new="{ row }">
            {{ $format.number(row.new) }}
          </template>
          <template v-slot:returning="{ row }">
            {{ $format.number(row.returning) }}
          </template>
          <template v-slot:returning_percent="{ row }">
            {{ $format.number(row.returning / row.total * 100) }}%
          </template>
        </gc-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { theme } from '~tailwind.config'
const map = require('lodash/map')
const Chart = require('chart.js')

export default {
  props: {
    to: {
      type: Object,
      default: null
    },
    from: {
      type: Object,
      default: null
    },
    showGraph: {
      type: Boolean,
      default: true
    },
    showTable: {
      type: Boolean,
      default: true
    },
    showControls: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dates: [],
      data: null,
      fromDate: this.from,
      toDate: this.to,
      style: 'bar',
      loading: true,
      chart: null,
      exporting: false
    }
  },
  mounted () {
    if (!this.fromDate || !this.toDate) {
      const date = new Date()
      this.fromDate = new Date(date.setMonth(date.getMonth() - 12))
      this.toDate = new Date()
    } else {
      this.fromDate = this.from
      this.toDate = this.to
    }
    this.dates = [
      this.fromDate,
      this.toDate
    ]
    this.refresh()
  },
  methods: {
    async exportReport () {
      this.exporting = true
      try {
        await this.$gc.reports.get('orders/customers', {
          from: moment(this.dates[0]).format('YYYY-MM-DD'),
          to: moment(this.dates[1]).format('YYYY-MM-DD'),
          export: 1
        })
        this.$notify.queue('success', 'Report export started. Check your emails')
      } catch (e) {
        this.$notify.queue('error', 'Unable to generate report')
      }
      this.exporting = false
    },
    refresh () {
      this.loading = true
      // Get the report we want.
      this.$gc.reports.get('orders/customers', {
        from: moment(this.dates[0]).format('YYYY-MM-DD'),
        to: moment(this.dates[1]).format('YYYY-MM-DD')
      }).then((response) => {
        this.loading = false
        this.data = response.data

        if (!this.$refs.graph) {
          return
        }

        const ctx = this.$refs.graph.getContext('2d')
        const labels = map(this.data, row => row.label)

        const newCustomers = {
          label: 'New customers',
          backgroundColor: theme.colors.blue[400],
          borderColor: theme.colors.blue[500],
          borderWidth: 1,
          data: map(this.data, row => row.new)
        }

        const retCustomers = {
          label: 'Returning customers',
          backgroundColor: theme.colors.green[400],
          borderColor: theme.colors.green[500],
          borderWidth: 1,
          data: map(this.data, row => row.returning)
        }

        if (this.chart) {
          this.chart.destroy()
        }

        this.chart = new Chart(ctx, {
          type: this.style,
          data: {
            labels,
            datasets: [newCustomers, retCustomers]
          },
          options: {
            responsive: true,
            tooltips: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: (tooltipItem, data) => {
                  const label = this.$format.number(tooltipItem.yLabel)
                  return data.datasets[tooltipItem.datasetIndex].label + ': ' + label
                }
              }
            },
            scales: {
              xAxes: [{
                display: true,
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Month'
                }
              }],
              yAxes: [{
                display: true,
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Total orders'
                }
              }]
            }
          }
        })
      }).catch((errors) => {
        (errors)
      })
    }
  }
}
</script>
