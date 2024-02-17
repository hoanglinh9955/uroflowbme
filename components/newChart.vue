<template>
  <div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend,
Filler
)
export default {
  name: 'NewChart',
  components: { Line },
  props: {
    listData: {
      type: Array,
      required: true
    },
    age: {
      type: Number,
      default: 60 // Set a default value for age
    }
  },
  data() {
    // Calculate Qmax and Qave for each x in the range
    const volumeRange = Array.from({ length: 601 }, (_, i) => i);
    const qMaxData = volumeRange.map(v => Math.pow(2.37 + 0.18 * Math.sqrt(v) - 0.014 * this.age, 2));
    const qAveData = volumeRange.map(v => Math.pow(1.8 + 0.14 * Math.sqrt(v) - 0.011 * this.age, 2));

    const chartData = {
      labels: volumeRange,
      datasets: [
        {
          label: 'Qmax',
          data: qMaxData,
          fill: false,
          borderColor: '#289DA9',
          pointRadius: 0 // Hide points
        },
        {
          label: 'Qave',
          data: qAveData,
          fill: false,
          borderColor: '#4339F2',
          pointRadius: 0 // Hide points
        },
        {
          label: 'Data Qmax',
          data: this.listData.map(data => ({ x: data.voidvolume, y: data.qmax })),
          fill: false,
          borderColor: '#289DA9',
          backgroundColor: '#289DA9',
          pointStyle: 'circle',
          pointRadius: 5,
          showLine: false // This will create a scatter plot
        },
        {
          label: 'Data Qave',
          data: this.listData.map(data => ({ x: data.voidvolume, y: data.qave })),
          fill: false,
          borderColor: '#4339F2',
          backgroundColor: '#4339F2',
          pointStyle: 'circle',
          pointRadius: 5,
          showLine: false // This will create a scatter plot
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Volume'
          },
          ticks: {
            maxTicksLimit: 20
          }
        },
        y: {
          title: {
            display: true,
            text: 'Flow-rate (ml/s)'
          }
        }
      }
    };

    return {
      chartData,
      chartOptions
    };
  },
  // mounted() {
  //   this.renderChart(this.chartData, this.chartOptions);
  // }
};
</script>