
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
        label: 'Flow Rate',
        data: this.value_data,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
        pointBorderWidth: 0,
        pointStyle: false
      },
    ]
  },
  chartOptions: {
    responsive: true,
   scales: {
      x: {
        title: {
          display: true,
          text: 'Time(s)'
        },
        ticks: {
            maxTicksLimit: 20
        },
      },
      y: {
        title: {
          display: true,
          text: 'Flow rate'
        },
        

      }
    }
  }
};
}
};
</script>