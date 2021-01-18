<template>
    <div>
      <div class="flex items-center px-6 py-3 border-b" v-if="showControls">
        <div>
          <b-datepicker
            placeholder="Click to select..."
            v-model="dates"
            @input="refresh"
            range
          >
          </b-datepicker>
        </div>
      </div>
      <div v-if="loading">
          <span><i class="fa fa-sync fa-spin"></i></span> Loading Report
      </div>
      <div v-else>
        <div v-for="(products, month) in data" :key="month">
          <header v-if="showControls"  class="px-6 py-4 text-xs font-bold text-gray-600 uppercase bg-gray-200">
            {{ $format.date(month, 'MMMM YYYY') }}
          </header>
          <gc-table
            :data="products.products"
            :columns="[
              { label: 'SKU', field: 'sku'},
              { label: 'Product', field: 'product'},
              { label: 'Total Orders', field: 'orders_total'},
            ]"
          >
            <template v-slot:sku="{ row }">
              {{ row.sku }}
            </template>
            <template v-slot:product="{ row }">
              {{ row.description }}
            </template>
            <template v-slot:orders_total="{ row }">
              {{ $format.number(row.product_count) }}
            </template>
          </gc-table>
        </div>
        <!--<table class="w-full text-sm" :class="{
          'mt-6' : showGraph
        }">
          <thead>
            <tr class="text-xs bg-gray-100">
              <th class="px-2 py-1 font-medium text-gray-800">Month</th>
              <th class="px-2 py-1 font-medium text-gray-800">Subtotal (excl. tax)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in data" :key="index" :class="{
              'bg-gray-100': index % 2
            }">
              <td class="p-2">{{ row.month }}</td>
              <td class="p-2">
                {{ $format.currency(row.sub_total) }}
              </td>
            </tr>
          </tbody>
        </table>-->
      </div>
    </div>
</template>

<script>
  const map = require('lodash/map')
  const size = require('lodash/size')

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
                default: 'weekly',
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
                default: 'line',
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
              this.fromDate =  moment().startOf('month').toDate()
              this.toDate = moment().toDate()
              if (moment(this.fromDate).isSame(this.toDate, 'day')) {
                this.toDate = moment().add(1, 'day').toDate()
              }
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
            getMonthLabel (month) {
              return moment(month).format('MMMM YYYY')
            },
            update(event) {
                // this.fromDate = event.start;
                // this.toDate = event.end;
                this.refresh();
            },
            refresh() {
                this.loading = true;
                // Get the report we want.
                this.$gc.reports.get('products/best-sellers', {
                    from: moment(this.dates[0]).format('YYYY-MM-DD'),
                    to: moment(this.dates[1]).format('YYYY-MM-DD')
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
                      return row.month
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
