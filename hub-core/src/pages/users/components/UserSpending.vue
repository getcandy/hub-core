<template>
  <div>
    <div class="p-6 bg-white rounded shadow">
      <canvas ref="graph" />
    </div>
  </div>
</template>

<script>
import { theme } from '~tailwind.config'
const map = require('lodash/map')
const get = require('lodash/get')
const Chart = require('chart.js')

export default {
  props: {
    period: {
      type: Array,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.drawChart()
    })
  },
  methods: {
    drawChart () {
      const ctx = this.$refs.graph.getContext('2d')
      if (this.chart) {
        this.chart.destroy()
      }

      const labels = map(this.period, (row) => {
        return row.label
      })

      const colours = theme.colors

      const datasets = [
        {
          label: 'Current period',
          backgroundColor: colours.red[400],
          borderColor: colours.red[500],
          fill: false,
          borderWidth: 1,
          data: map(get(this.data, 'current_period.data', []), row => row.sub_total)
        },
        {
          label: 'Previous period',
          backgroundColor: colours.blue[400],
          borderColor: colours.blue[500],
          fill: false,
          borderWidth: 1,
          data: map(get(this.data, 'previous_period.data', []), row => row.sub_total)
        }
      ]

      this.chart = new Chart(ctx, {
        type: 'bar',
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
                    precision: 0
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
    }
  }
}
</script>
