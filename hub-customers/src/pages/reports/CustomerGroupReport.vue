<template>
  <div>
    <toolbar heading="Customer Group Report" />
    <div v-if="!loading" class="flex items-center px-6 py-3 border-b">
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
        <gc-button @click="exportReport" :loading="exporting">Export Report</gc-button>
      </div>
    </div>
    <div class="bg-white">
      <div v-show="loading" class="flex h-full p-12">
        <div class="flex items-center text-gray-400">
          <loading-spinner /><span class="ml-2 text-sm font-medium uppercase"> Loading Report</span>
        </div>
      </div>
      <div class="p-6" v-show="!loading">
        <canvas ref="graph" />
      </div>
      <div>
        <gc-table
          :columns="columns"
          :data="tableRows"
        >
          <template v-slot:month="{ row }">
            {{ row.label }}
          </template>
          <template v-for="group in groups" v-slot:[group.field]="{ row }">
            {{ $format.currency(row[group.field].order_total) }}
          </template>
        </gc-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

const map = require('lodash/map')
const find = require('lodash/find')
const Chart = require('chart.js')
const reverse = require('lodash/reverse')
const each = require('lodash/each')

import { theme } from '~tailwind.config'

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
    mode: {
      type: String,
      default: 'monthly'
    },
    showControls: {
      type: Boolean,
      default: true
    },
    showGraph: {
      type: Boolean,
      default: true
    },
    showTable: {
      type: Boolean,
      default: true
    },
    initialStyle: {
      type: String,
      default: 'line'
    }
  },
  data () {
    return {
      chart: null,
      loading: true,
      customerGroup: null,
      dates: [],
      data: null,
      fromDate: this.from,
      toDate: this.to,
      viewMode: this.mode,
      style: this.initialStyle,
      exporting: false,
    }
  },
  head () {
    return {
      title: 'Customer Group Report'
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
  computed: {
    groups () {
      if (!this.data) {
        return []
      }
      return map(this.data.data, (group) => {
        return {
          label: group.label,
          field: group.handle
        }
      })
    },
    columns () {
      if (!this.data) {
        return []
      }
      const cols = [
        ...[{ label: 'Month', field: 'month' }],
        ...this.groups
      ]
      return cols
    },
    tableRows () {
      if (!this.data) {
        return []
      }

      const groups = this.data.data
      return reverse(map(this.data.period, (period) => {
        const data = {
          label: period.label
        }

        each(groups, (group) => {
          // Find the data the corresponds to the month
          const groupData = find(group.data, (record) => {
            const periodDate = moment(period.date).format('YYYYMMMM')
            return periodDate === `${record.year}${record.month}`
          })
          data[group.handle] = groupData
        })

        return data
      }))
    }
  },
  methods: {
    async exportReport () {
      this.exporting = true
      await this.$getcandy.on(
        'reports',
        'customerGroupReport',
        moment(this.dates[0]).format('YYYY-MM-DD'),
        moment(this.dates[1]).format('YYYY-MM-DD'),
        {
          query: {
            export: true
          }
        })
      this.exporting = false
      this.$notify.queue('success', 'Report export started. Check your emails')
    },
    update (event) {
      // this.fromDate = event.start;
      // this.toDate = event.end;
      this.refresh()
    },
    async refresh () {
      this.loading = true
      // Get the report we want.
      const { data } = await this.$getcandy.on('reports', 'customerGroupReport', moment(this.dates[0]).format('YYYY-MM-DD'), moment(this.dates[1]).format('YYYY-MM-DD'))

      this.data = data

      const ctx = this.$refs.graph.getContext('2d')

      if (this.chart) {
        this.chart.destroy()
      }

      const labels = map(data.period, (row) => {
        return row.label
      })

      const colours = theme.colors
      const colourKeys = Object.keys(colours)

      let i = 4;

      const datasets = map(data.data, (group, index) => {
        i++
        const colour = colours[colourKeys[i % colourKeys.length]]
        return {
          label: group.label,
          backgroundColor: colour[400],
          borderColor: colour[500],
          fill: false,
          borderWidth: 1,
          data: map(group.data, row => row.order_total)
        }
      })

      this.chart = new Chart(ctx, {
        type: this.style,
        data: {
          labels,
          datasets
        },
        options: {
          responsive: true,
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (tooltipItem, data) => {
                const label = this.$format.currency({
                  amount: tooltipItem.yLabel,
                  precision: 0
                })
                return data.datasets[tooltipItem.datasetIndex].label + ': ' + label
              }
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                callback: (value) => {
                  return this.$format.currency({
                    amount: value,
                    precision: 0,
                  })
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Order Subtotal'
              }
            }]
          }
        }
      })

      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
