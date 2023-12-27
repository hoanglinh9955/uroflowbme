
<template>
      <Line :data="chartData" :options="chartOptions" />
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
    Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'LineChart',
  components: { Line },
  props:{
    time_data: {
      type: Array,
      required: true
    },
    value_data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chartData: {
        labels: this.time_data,
        datasets: [
          {
            label: 'data 1',
            data: this.value_data,
            backgroundColor: 'rgba(255, 0, 0, 1)', // Red fill color (with transparency)
            // borderWidth:0.5,

          }
        ]
      },
      chartOptions: {
        responsive: true,
    
        // maintainAspectRatio: false,
       scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            },
            min: 0,
            max: 2500, // Set the maximum value of x-axis to 25
          },
          y: {
            title: {
              display: true,
              text: 'Value'
            },
          }
        }
      }
    };
  }
};
</script>