<template>
    <UButton color="black" variant="link" class="absolute top-0" @click="goToDashBoard"><Icon size="35x" name="i-heroicons-arrow-long-left" /></UButton>

    <div class="grid grid-cols-3 gap-1 h-screen" style="overflow-y: auto;">
    
        <div class="col-span-2 p-5">
            <Chart1 :value_data="chart.volume.vol_value" :time_data="chart.volume.vol_time" />
        </div>
        <div class="col-span-1 flex flex-col space-y-2 justify-center items-center p-2">
            <div class="flex justify-between w-full">
                <h3>Date time: </h3> <h3>{{ chart.date_time }}</h3>
            </div>
            <div class="flex justify-between w-full">
                <h3>Signal Id: </h3> <h3>{{ chart.signal_id }}</h3>
            </div>
            <div class="flex justify-between w-full">
                <h3>Median volume: </h3> <h3>{{ chart.median_volume.toFixed(2) }}</h3>
            </div>
            <div class="flex justify-between w-full">
                <h3>Voided mixed: </h3> <h3>{{ chart.voided_volume.toFixed(2) }}</h3>
            </div>
            <div class="flex justify-between w-full">
                <h3>Max flow rate: </h3><h3>{{ chart.max_flow_rate.toFixed(2) }}</h3>
            </div>

            
        </div>
        <div class="col-span-2 px-5">
            <Chart2 :value_data="chart.flow_rate.fr_value" :time_data="chart.flow_rate.fr_time" />
        </div>
        <div class="col-span-1 flex flex-col space-y-2 justify-center items-center p-2">
            <div class="flex justify-between w-full">
                <h3>Avg flow rate: </h3><h3>{{ chart.avg_flow_rate.toFixed(2) }}</h3>
            </div>
            <div class="flex justify-between w-full">
                <h3>Time to max flow rate: </h3><h3>{{ chart.time_to_max_flow_rate.toFixed(2) }}</h3>
            </div>
            <div class="flex justify-between w-full">
                
            <h3>Flow time: </h3><h3>{{ chart.flow_time.toFixed(2) }}</h3>
            </div>
        </div>

        <div class="col-span-3">
            <NewChart :listData="dataListNomo" :age="age" />
        </div>
     
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import Chart from '../chart.vue';
import type { FormError, FormSubmitEvent } from '#ui/types'
import { addOrderModal } from '~/stores/storeModal'
import { storeToRefs } from "pinia";
const reloadState = storeToRefs(addOrderModal()).reloadState;
const age = storeToRefs(addOrderModal()).age;
const route = useRoute()
const reduceArray = reactive([])

const { data: chart, pending: chartPending, error: chartError } = await useFetch(`https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/signal_info/${route.params.id}`)
// console.log("🚀 ~ file: index.vue:8 ~ chart:", chart.value.flow_rate.fr_time)
const goToDashBoard = async () => {
    reloadState.value++
    console.log(reloadState.value)
    await navigateTo('/dashboard')
}
const dataListNomo = ref([
      { voidvolume: Math.floor(chart.value.voided_volume) , qmax: chart.value.max_flow_rate, qave: chart.value.avg_flow_rate },
    ]);


</script>