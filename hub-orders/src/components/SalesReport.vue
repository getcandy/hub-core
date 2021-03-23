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
        <gc-select-input v-model="viewMode" @input="refresh">
          <option value="daily">
            Daily
          </option>
          <option value="weekly">
            Weekly
          </option>
          <option value="monthly">
            Monthly
          </option>
        </gc-select-input>
      </div>
      <div>
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
    <canvas v-show="!loading" ref="graph" />
  </div>
</template>

<script>
import moment from 'moment'
import { theme } from '~tailwind.config'
const each = require('lodash/each')
const Chart = require('chart.js')

export default {
  props: {
    to: {
      type: Object
    },
    from: {
      type: Object
    },
    mode: {
      type: String,
      default: 'monthly'
    },
    showControls: {
      type: Boolean,
      default: true
    },
    initialStyle: {
      default: 'bar'
    }
  },
  data () {
    return {
      chart: null,
      loading: true,
      fromDate: this.from,
      toDate: this.to,
      dates: [],
      viewMode: this.mode,
      style: this.initialStyle,
      exporting: false,
      data: null
    }
  },
  created () {
    if (!this.fromDate || !this.toDate) {
      const date = new Date()
      this.fromDate = new Date(date.setMonth(date.getMonth() - 12))
      this.toDate = new Date()
    } else {
      this.fromDate = this.from.subtract(1, 'months')
      this.toDate = this.to
    }

    this.dates = [
      this.fromDate,
      this.toDate
    ]
    this.refresh()
  },
  methods: {
    update (event) {
      this.fromDate = event.start
      this.toDate = event.end

      this.refresh()
    },
    async exportReport () {
      this.exporting = true
      await this.$gc.reports.get('sales', {
        from: moment(this.dates[0]).format('YYYY-MM-DD'),
        to: moment(this.dates[1]).format('YYYY-MM-DD'),
        mode: this.viewMode,
        export: 1
      })
      this.$notify.queue('success', 'Report export started. Check your emails')
      this.exporting = false
    },
    refresh () {
      this.loading = true
      // Get the report we want.
      this.$gc.reports.get('sales', {
        from: moment(this.dates[0]).format('YYYY-MM-DD'),
        to: moment(this.dates[1]).format('YYYY-MM-DD'),
        mode: this.viewMode
      }).then((response) => {
        const ctx = this.$refs.graph.getContext('2d')
        this.loading = false

        if (this.chart) {
          this.chart.destroy()
        }

        this.data = response.data

        const { datasets, labels } = this.data

        each(datasets, (set, index) => {
          set.borderWidth = 1
          if (index === 0) {
            set.backgroundColor = theme.colors.pink[400]
            set.borderColor = theme.colors.pink[500]
          } else {
            set.backgroundColor = theme.colors.blue[400]
            set.borderColor = theme.colors.blue[500]
          }
        })

        this.chart = new Chart(ctx, {
          type: this.style,
          data: {
            datasets,
            labels
          },
          options: {
            responsive: true,
            tooltips: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: (tooltipItem, data) => {
                  let label = tooltipItem.yLabel
                  if (tooltipItem.datasetIndex == 1) {
                    label = this.$format.currency({
                      amount: tooltipItem.yLabel,
                      precision: 0
                    })
                  }
                  return data.datasets[tooltipItem.datasetIndex].label + ': ' + label
                }
              }
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            scales: {
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Week'
                }
              }],
              yAxes: [
                {
                  id: 'A',
                  position: 'left',
                  ticks: {
                    beginAtZero: true
                  },
                  scaleLabel: {
                    display: true,
                    labelString: '# Orders'
                  }
                },
                {
                  id: 'B',
                  position: 'right',
                  ticks: {
                    beginAtZero: true,
                    callback: (value, index, values) => {
                      return this.$format.currency({
                        amount: value,
                        precision: 0
                      })
                    }
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Total Value'
                  }
                }
              ]
            }
          }
        })
      }).catch((errors) => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .report-controls {
    background-color: #fff;
    padding-left: 30px;
    padding-right: 30px;
  }
</style>
