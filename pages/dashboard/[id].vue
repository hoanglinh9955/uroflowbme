<template>
    <UButton color="gray" class="absolute top-0" @click="goToDashBoard">
        <Icon size="35x" name="i-heroicons-arrow-long-left" />
    </UButton>
    <UButton color="gray" class="absolute top-10 right-12" @click="print">
        <Icon name="i-heroicons-printer" />
    </UButton>
    <div class="grid grid-cols-3 h-screen" style="overflow-y: auto;">
        <div class="mt-8 mb-4 col-span-3 w-full bg-gray-100 rounded-t-lg text-center">
            <h2>Volume over time</h2>
        </div>
        <div class="col-span-2 px-5 pb-̀̀5">
            <Chart1 :value_data="chart.volume.vol_value" :time_data="chart.volume.vol_time" />
        </div>
        <div class="col-span-1 flex flex-col space-y-2 justify-center items-center p-2">
            <div class="flex justify-between w-full">
                <h3>Date time: </h3>
                <h3>{{ chart.date_time }}</h3>
            </div>
            <UDivider></UDivider>
            <div class="flex justify-between w-full">
                <h3>Signal Id: </h3>
                <h3>{{ chart.signal_id }}</h3>
            </div>
            <UDivider></UDivider>
            <div class="flex justify-between w-full">
                <h3>Median volume: </h3>
                <h3>{{ chart.median_volume.toFixed(2) }}</h3>
            </div>
            <UDivider></UDivider>
            <div class="flex justify-between w-full">
                <h3>Voided volume: </h3>
                <h3>{{ chart.voided_volume.toFixed(2) }}</h3>
            </div>
            <UDivider></UDivider>
            <div class="flex justify-between w-full">
                <h3>Max flow rate: </h3>
                <h3>{{ chart.max_flow_rate.toFixed(2) }}</h3>
            </div>
            <UDivider></UDivider>


        </div>
        <div class="mt-8 mb-4 col-span-3 w-full bg-gray-100 rounded-t-lg text-center">
            <h2>Flowrate over time</h2>
        </div>
        
        <div class="col-span-2 px-5">
            <Chart2 :value_data="chart.flow_rate.fr_value" :time_data="chart.flow_rate.fr_time" />
        </div>
        <div class="col-span-1 flex flex-col space-y-2 justify-center items-center p-2">
            <div class="flex justify-between w-full">
                <h3>Avg flow rate: </h3>
                <h3>{{ chart.avg_flow_rate.toFixed(2) }}</h3>
            </div>
            <UDivider></UDivider>
            <div class="flex justify-between w-full">
                <h3>Time to max flow rate: </h3>
                <h3>{{ chart.time_to_max_flow_rate.toFixed(2) }}</h3>
            </div>
            <UDivider></UDivider>
            <div class="flex justify-between w-full">

                <h3>Flow time: </h3>
                <h3>{{ chart.flow_time.toFixed(2) }}</h3>
            </div>
            <UDivider></UDivider>
        </div>
        <div class="mt-8 mb-4 col-span-3 w-full bg-gray-100 rounded-t-lg text-center">
            <h2>Nomogram</h2>
        </div>
       
        <div class="col-span-2 px-5">
            <NewChart :listData="dataListNomo" :age="age" />
        </div>
        <div class="col-span-1 flex flex-col space-y-2">
            <h1>Comment: </h1>
            <h1></h1>
            <UTextarea placeholder="Comment..."
                v-model='comment' />
                <UButton @click="editCommentState">Edit Comment</UButton>
        </div>

    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
const toast = useToast()
import Chart from '../chart.vue';
import type { FormError, FormSubmitEvent } from '#ui/types'
import { addOrderModal } from '~/stores/storeModal'
import { storeToRefs } from "pinia";
const reloadState = storeToRefs(addOrderModal()).reloadState;
const age = storeToRefs(addOrderModal()).age;
const route = useRoute()
const reduceArray = reactive([])
const supabase = useSupabaseClient();
const print = () => {
    window.print();
}
const editCommentState = async () =>{
    const { data, pending, error, refresh } = await useFetch(`https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/signal/comment/${route.params.id}`, {
        method: 'put',
        
        body: {
            comment: comment.value
        
        }
    })
    if (data.value.message === 'Comment modified successfully') {

    toast.add({ title: 'Comment modified successfully !', timeout: 2500 , color: 'blue'})
  }
    
}
const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error(error);
        return;
    }

    await navigateTo('/login');
};
const comment = ref();
const { data: chart, pending: chartPending, error: chartError } = await useFetch(`https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/signal_info/${route.params.id}`)
// console.log("🚀 ~ file: index.vue:8 ~ chart:", chart.value.flow_rate.fr_time)
const goToDashBoard = async () => {
    reloadState.value++
    console.log(reloadState.value)
    await navigateTo('/dashboard')
}
const dataListNomo = ref([
    { voidvolume: Math.floor(chart.value.voided_volume), qmax: chart.value.max_flow_rate, qave: chart.value.avg_flow_rate },
]);
comment.value = chart.value.comment
const user = useSupabaseUser();
if (!user.value) {
    logout();
}

</script>