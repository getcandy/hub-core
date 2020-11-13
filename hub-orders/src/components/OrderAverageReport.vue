<template>
  <div>
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
      <div class="mx-4">
        <select-input v-model="viewMode" @input="refresh">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select-input>
      </div>
      <div>
        <select-input  v-model="style" @input="refresh">
          <option value="line">Line</option>
          <option value="bar">Bar</option>
        </select-input>
      </div>
    </div>
    <div v-show="loading">
      <span><i class="fa fa-sync fa-spin"></i></span> Loading Report
    </div>
    <canvas ref="graph" v-if="showGraph"></canvas>
    <table class="w-full text-sm" :class="{
      'mt-6' : showGraph
    }" v-if="showTable">
      <thead>
        <tr class="bg-gray-100 text-xs">
          <th class="font-medium px-2 py-1 text-gray-800">Month</th>
          <th class="font-medium px-2 py-1 text-gray-800">Subtotal (excl. tax)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="index" :class="{
          'bg-gray-100': index % 2
        }">
          <td class="p-2">{{ row.date }}</td>
          <td class="p-2">
            {{ $format.currency(row.sub_total) }}
          </td>
        </tr>
      </tbody>
    </table>
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
            mode: {
                type: String,
                default: 'monthly',
            },
            showControls: {
                type: Boolean,
                default: true,
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
                default: 'bar',
            }
        },
        data() {
            return {
                chart: null,
                loading: true,
                dates: [],
                data: null,
                fromDate: this.from,
                toDate: this.to,
                viewMode: this.mode,
                style: this.initialStyle,
            }
        },
        mounted() {
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
            update(event) {
                // this.fromDate = event.start;
                // this.toDate = event.end;
                this.refresh();
            },
            refresh() {
                this.loading = true;
                // Get the report we want.
                this.$gc.reports.get('orders/averages', {
                    from: moment(this.dates[0]).format('YYYY-MM-DD'),
                    to: moment(this.dates[1]).format('YYYY-MM-DD'),
                    mode: this.viewMode,
                }).then(response => {
                    this.loading = false;

                    this.data = response.data;

                    if (!this.$refs.graph) {
                      return;
                    }

                    const ctx = this.$refs.graph.getContext("2d");

                    if (this.chart) {
                        this.chart.destroy();
                    }
                    const labels = map(this.data, (row) => {
                      return row.date
                    })

                    const datasets = [{
                      'label': 'Order sub totals',
                      'backgroundColor': '#E7028C',
                      'borderColor': '#E7028C',
                      'fill': false,
                      'data': map(this.data, (row) => {
                        return row.sub_total
                      })
                    }]

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
                                        var label = tooltipItem.yLabel;
                                        if (tooltipItem.datasetIndex == 0) {
                                            label = this.$format.currency(tooltipItem.yLabel)
                                        }
                                        return data.datasets[tooltipItem.datasetIndex].label + ': ' + label;
                                    }
                                }
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        callback: (value, index, values) => {
                                          return this.$format.currency(value);
                                        }
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Total Value'
                                    }
                                }]
                            }
                        }

                    });
                }).catch(errors => {
                });
            }
        }
    }
</script>

<style scoped>

</style>
