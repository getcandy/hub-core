<template>
  <div>
    <loading-spinner v-if="loading && showControls" />

      <div class="flex items-center border-b px-6 py-3" v-if="showControls">
        <div>
          <b-datepicker
            placeholder="Click to select..."
            v-model="dates"
            @input="refresh"
            range
          >
          </b-datepicker>
        </div>
        <div class="ml-4">
          <select-input  v-model="style" @input="refresh">
            <option value="line">Line</option>
            <option value="bar">Bar</option>
          </select-input>
        </div>
      </div>
    <div v-show="!loading">
      <div class="p-6">
        <canvas ref="graph" v-if="showGraph"></canvas>
        <table class="w-full text-sm" :class="{
          'mt-6' : showGraph
        }" v-if="showTable">
          <thead>
            <tr class="bg-gray-200 text-xs">
              <th class="font-medium px-2 py-1 text-gray-800">Month</th>
              <th class="font-medium px-2 py-1 text-gray-800">New Customers</th>
              <th class="font-medium px-2 py-1 text-gray-800">Returning Customers</th>
              <th class="font-medium px-2 py-1 text-gray-800">Returning %</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in data" :key="index" :class="{
              'bg-gray-100': index % 2
            }">
              <td class="p-2">{{ row.label }}</td>
              <td class="p-2">{{ $format.number(row.new) }}</td>
              <td class="p-2">{{ $format.number(row.returning) }}</td>
              <td class="p-2 align-right">
                  {{ $format.number(row.returning / row.total * 100) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  const map = require('lodash/map')
  import moment from 'moment'

  var Chart = require('chart.js');

  export default {
    props: {
      to: {
        type: Object
      },
      from: {
        type: Object,
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
        chart: null
      }
    },
    mounted () {
      if (!this.fromDate || !this.toDate) {
        const date = new Date()
        this.fromDate = new Date(date.setMonth(date.getMonth()-12))
        this.toDate = new Date()
      } else {
        this.fromDate = this.from;
        this.toDate = this.to;
      }
      this.dates = [
        this.fromDate,
        this.toDate
      ]
      this.refresh();
    },
    methods: {
      refresh() {
        this.loading = true;
        // Get the report we want.
        this.$gc.reports.get('orders/customers', {
          from: moment(this.dates[0]).format('YYYY-MM-DD'),
          to: moment(this.dates[1]).format('YYYY-MM-DD')
        }).then(response => {
          this.loading = false;
          this.data = response.data;

          if (!this.$refs.graph) {
            return;
          }

          const ctx = this.$refs.graph.getContext("2d");
          const labels = map(this.data, row => row.label)

          const newCustomers = {
            label: 'New customers',
            backgroundColor: '#0066DD',
            data: map(this.data, row => row.new)
          }

          const retCustomers = {
            label: 'Returning customers',
            backgroundColor: '#00DDB5',
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
                    var label = this.$format.number(tooltipItem.yLabel)
                    return data.datasets[tooltipItem.datasetIndex].label + ': ' + label;
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
        }).catch(errors => {
          (errors);
        });
      }
    }
  }
</script>
