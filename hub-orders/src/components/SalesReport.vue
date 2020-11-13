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
    <canvas ref="graph" v-show="!loading"/>
  </div>
</template>

<script>
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
    initialStyle: {
      default: 'bar'
    }
  },
  data() {
    return {
      chart: null,
      loading: true,
      fromDate: this.from,
      toDate: this.to,
      dates: [],
      viewMode: this.mode,
      style: this.initialStyle,
      data: null
    }
  },
  created() {
    if (!this.fromDate || !this.toDate) {
      const date = new Date;
      this.fromDate = new Date(date.setMonth(date.getMonth()-12))
      this.toDate = new Date();
    } else {
      this.fromDate = this.from.subtract(1, 'months');
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
      this.fromDate = event.start;
      this.toDate = event.end;

      this.refresh();
    },
    refresh() {
      this.loading = true;
      // Get the report we want.
      this.$gc.reports.get('sales', {
        from: moment(this.dates[0]).format('YYYY-MM-DD'),
        to: moment(this.dates[1]).format('YYYY-MM-DD'),
        mode: this.viewMode,
      }).then(response => {
        const ctx = this.$refs.graph.getContext("2d");
        this.loading = false;

        if (this.chart) {
          this.chart.destroy();
        }

        this.data = response.data


        this.chart = new Chart(ctx, {
          type: this.style,
          data: this.data,
          options: {
            responsive: true,
            tooltips: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: (tooltipItem, data) => {
                  var label = tooltipItem.yLabel;
                  if (tooltipItem.datasetIndex == 1) {
                      label = this.$format.currency(tooltipItem.yLabel)
                  }
                  return data.datasets[tooltipItem.datasetIndex].label + ': ' + label;
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
                  position:'left',
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
                  position:'right',
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
                }
              ]
            }
          }
        });
      }).catch(errors => {
      });
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
