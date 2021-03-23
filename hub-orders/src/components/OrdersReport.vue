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
      <div v-if="showGraph" class="p-4">
        <canvas ref="graph" />
      </div>
      <gc-table
        v-if="showTable"
        :data="currentPeriodTableRows"
        :class="{
          'mt-6' : showGraph
        }"
        :columns="[
          {label: $t('Month'), field: 'month'},
          {label: $t('Subtotal (excl. tax)'), field: 'sub_total'},
          {label: $t('Previous period (excl. tax)'), field: 'previous_period'},
          {label: $t('Difference'), field: 'change'},
        ]"
      >
        <template v-slot:month="{ row }">
          {{ row.month }} {{ row.year }}
        </template>
        <template v-slot:sub_total="{ row }">
          {{ $format.currency({
            amount: row.sub_total,
            precision: 0
          }) }}
        </template>
        <template v-slot:previous_period="{ row }">
          <template v-if="getPreviousPeriod(row)">
            {{ $format.currency({
              amount: getPreviousPeriod(row).sub_total,
              precision: 0
            }) }}
          </template>
          <span v-else>
            {{ $t('No Data') }}
          </span>
        </template>
        <template v-slot:change="{ row }">
          <span
            class="p-1 text-sm font-bold text-center rounded"
            :class="{
              'text-green-500 bg-green-100' : getPercentageDiff(row) > 0,
              'text-gray-600 bg-gray-100': getPercentageDiff(row) == 0,
              'text-red-500 bg-red-100' : getPercentageDiff(row) < 0
            }"
          >
            {{ getPercentageDiff(row) }}%
          </span>
        </template>
      </gc-table>
      <!--
      <table
        v-if="showTable"
        class="w-full text-sm"
        :class="{
          'mt-6' : showGraph
        }"
      >
        <thead>
          <tr class="text-xs bg-gray-100">
            <th class="px-2 py-1 font-medium text-gray-800">
              Month
            </th>
            <th class="px-2 py-1 font-medium text-gray-800">
              Subtotal (excl. tax)
            </th>
            <th class="px-2 py-1 font-medium text-gray-800">
              Discounts
            </th>
            <th class="px-2 py-1 font-medium text-gray-800">
              Delivery
            </th>
            <th class="px-2 py-1 font-medium text-gray-800">
              Change
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in data"
            :key="index"
            :class="{
              'bg-gray-100': index % 2
            }"
          >
            <td class="p-2">
              {{ row.month }}
            </td>
            <td class="p-2">
              {{ $format.currency(row.sub_total) }}
            </td>
            <td class="p-2 text-red-500">
              -{{ $format.currency(row.discount_total) }}
            </td>
            <td class="p-2">
              {{ $format.currency(row.delivery_total) }}
            </td>
            <td class="p-2 align-right">
              <span
                v-if="data[index + 1]"
                class="block p-1 text-sm font-bold text-center rounded"
                :class="{
                  'text-green-500 bg-green-100' : $format.percent(data[index + 1].sub_total, row.sub_total) > 0,
                  'text-gray-600 bg-gray-100': $format.percent(data[index + 1].sub_total, row.sub_total) == 0,
                  'text-red-500 bg-red-100' : $format.percent(data[index + 1].sub_total, row.sub_total) < 0
                }"
              >
                {{ $format.percent(data[index + 1].sub_total, row.sub_total) }}%
              </span>
            </td>
          </tr>
        </tbody>
      </table>
       -->
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { theme } from '~tailwind.config'

const map = require('lodash/map')
const find = require('lodash/find')
const reverse = require('lodash/reverse')

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
      default: 'weekly'
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
  data () {
    return {
      chart: null,
      loading: true,
      dates: [],
      data: {},
      fromDate: this.from,
      toDate: this.to,
      viewMode: this.mode,
      style: this.initialStyle,
      exporting: false
    }
  },
  computed: {
    currentPeriodTableRows () {
      return reverse(this.data.currentPeriod || [])
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
        await this.$gc.reports.get('orders', {
          from: moment(this.dates[0]).format('YYYY-MM-DD'),
          to: moment(this.dates[1]).format('YYYY-MM-DD'),
          mode: this.viewMode,
          export: 1
        })
        this.$notify.queue('success', 'Report export started. Check your emails')
      } catch (e) {
        this.$notify.queue('error', 'Unable to generate report')
      }
      this.exporting = false
    },
    getPreviousPeriod (row) {
      const { previousPeriod } = this.data
      const prev = find(previousPeriod, (period) => {
        return period.month === row.month && Number.parseInt(period.year) + 1 === Number.parseInt(row.year)
      })
      return prev
    },
    getPercentageDiff (row) {
      const previous = this.getPreviousPeriod(row)
      if (!previous) {
        return 0
      }
      return this.$format.percent(previous.sub_total, row.sub_total)
    },
    update (event) {
      // this.fromDate = event.start;
      // this.toDate = event.end;
      this.refresh()
    },
    refresh () {
      this.loading = true
      // Get the report we want.
      this.$gc.reports.get('orders', {
        from: moment(this.dates[0]).format('YYYY-MM-DD'),
        to: moment(this.dates[1]).format('YYYY-MM-DD'),
        mode: this.viewMode
      }).then((response) => {
        this.loading = false

        this.data = response.data

        const { currentPeriod, previousPeriod } = response.data

        if (!this.$refs.graph) {
          return
        }

        const ctx = this.$refs.graph.getContext('2d')

        if (this.chart) {
          this.chart.destroy()
        }

        const labels = map(currentPeriod, (row) => {
          return `${row.month} ${row.year}`
        })

        const datasets = [
          {
            label: 'Current Year',
            backgroundColor: theme.colors.pink[400],
            borderColor: theme.colors.pink[500],
            borderWidth: 1,
            fill: false,
            data: map(currentPeriod, (row) => {
              return row.sub_total
            })
          },
          {
            label: 'Previous Year',
            backgroundColor: theme.colors.blue[400],
            borderColor: theme.colors.blue[500],
            borderWidth: 1,
            fill: false,
            data: map(previousPeriod, (row) => {
              return row.sub_total
            })
          }
        ]

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
              yAxes: [
                {
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
                    labelString: 'Order Sub Total'
                  }
                }
              ]
            }
          }

        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>

</style>
