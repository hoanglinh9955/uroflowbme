<template>
  <div>
    <!-- Pass an array of data to the listData prop -->
    <NewChart :listData="dataList" :age="30" />
  </div>
</template>

<script>
import { ref } from 'vue';
import NewChart from '@/components/newChart.vue';

export default {
  name: 'ParentComponent',
  components: {
    NewChart
  },
  setup() {
    const dataList = ref([
      { voidvolume: 197, qmax: 21.25, qave: 4.16 },
    ]);

    return {
      dataList
    };
  }
};
</script>