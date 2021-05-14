<template>
  <div>
    <div v-if="showControls && !loading" class="flex items-center px-6 py-3 border-b">
      <div class="w-1/3">
        <b-datepicker
          v-model="dates"
          placeholder="Click to select..."
          range
          @input="refresh"
        />
      </div>
      <div class="ml-4">
        <gc-select-input v-model="style" @input="refresh">
          <option value="line">
            Line
          </option>
          <option value="bar">
            Bar
          </option>
        </gc-select-input>
      </div>
      <div class="ml-4">
        <gc-button @click="exportReport">
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
      <canvas v-if="showGraph" ref="graph" />
      <gc-table
        :columns="columns"
        :data="tableRows"
      >
        <template v-slot:month="{ row }">
          {{ row.label }}
        </template>
        <template v-for="group in groups" v-slot:[group.field]="{ row }">
          {{ $format.currency(row[group.field].sub_total) }}
        </template>
      </gc-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { theme } from '~tailwind.config'

const map = require('lodash/map')
const reverse = require('lodash/reverse')
const find = require('lodash/find')
const each = require('lodash/each')
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
      default: 'bar'
    }
  },

  async fetch () {
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
    await this.refresh()
  },
  data () {
    return {
      chart: null,
      loading: true,
      dates: [],
      data: null,
      fromDate: this.from,
      toDate: this.to,
      viewMode: this.mode,
      style: this.initialStyle
    }
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
            const periodDate = moment(period.date).format('YYYYMM')
            return periodDate === record.date
          })
          data[group.handle] = groupData
        })

        return data
      }))
    }
  },
  methods: {
    async exportReport () {
      await this.$gc.reports.get('orders/averages', {
        from: moment(this.dates[0]).format('YYYY-MM-DD'),
        to: moment(this.dates[1]).format('YYYY-MM-DD'),
        export: 1,
        mode: this.viewMode
      })
      this.$notify.queue('success', 'Report export started. Check your emails')
    },
    update (event) {
      // this.fromDate = event.start;
      // this.toDate = event.end;
      this.refresh()
    },
    build () {
      if (!this.$refs.graph) {
        return
      }

      const labels = map(this.data.period, period => period.label)

      const ctx = this.$refs.graph.getContext('2d')

      if (this.chart) {
        this.chart.destroy()
      }

      const colours = theme.colors
      const colourKeys = Object.keys(colours)

      let i = 4

      const datasets = map(this.data.data, (group) => {
        i++
        const colour = colours[colourKeys[i % colourKeys.length]]
        return {
          label: group.label,
          backgroundColor: colour[400],
          borderColor: colour[500],
          fill: false,
          borderWidth: 1,
          data: map(group.data, row => row.sub_total)
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
                let label = tooltipItem.yLabel
                label = this.$format.currency({
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
                  return this.$format.currency(value)
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Total Value'
              }
            }]
          }
        }
      })
    },
    async refresh () {
      this.loading = true
      // Get the report we want.
      const response = await this.$gc.reports.get('orders/averages', {
        from: moment(this.dates[0]).format('YYYY-MM-DD'),
        to: moment(this.dates[1]).format('YYYY-MM-DD'),
        mode: this.viewMode
      })
      this.loading = false

      const { data } = response
      this.data = data
      this.build()

      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
