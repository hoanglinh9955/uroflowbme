<script setup>
import { ref } from 'vue';
import Chart from './chart.vue';

const { data: person, pending: personPending, error, refresh } = await useFetch('https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/patient/get')
// console.log("🚀 ~ file: index.vue:6 ~ person:", person.value)
const { data: chart, pending: chartPending, error: chartError } = await useFetch('https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/signal_info/1498255288')
console.log("🚀 ~ file: index.vue:8 ~ chart:", chart.value.flow_rate.fr_time)

const isOpen = ref(true);
const sidebarWidth = ref("w-1/5");
const contentWidth = ref("w-4/5");
const icon = ref("ep:back");

function toggleSidebar() {
    if (isOpen.value) {
        sidebarWidth.value = "w-1/12";
        contentWidth.value = "w-11/12";
        icon.value = "material-symbols:arrow-forward";
    } else {
        sidebarWidth.value = "w-1/5";
        contentWidth.value = "w-4/5";
        icon.value = "ep:back";
    }
    isOpen.value = !isOpen.value;
}

const columns = [{
    key: 'patient_id',
    label: 'ID'
}, {
    key: 'name',
    label: 'Name'
}, {
    key: 'dob',
    label: 'Date of birth'
}, {
    key: 'gender',
    label: 'Gender'
}]


const q = ref('')

const filteredRows = computed(() => {
    if (!q.value) {
        return person.value
    }

    return person.value.filter((person) => {
        return Object.values(person).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase())
        })
    })
})
</script>

<template>
    <div class="flex">
        <!-- sidebar -->
        <div :class="`flex flex-col bg-blue-400 ${sidebarWidth} transition-width duration-500 shadow`">
            <!-- sidebar header -->
            <div>
                <div class="flex justify-between w-full p-2">
                    <div></div>
                    <h1>Patient</h1>

                    <button class="pl-10 ml-2 text-xl transition-all hover:bg-blue-400 hover:rounded"
                        @click="toggleSidebar">
                        <Icon :name="icon" color="black" />
                    </button>
                </div>

            </div>
            <UContainer class="h-screen">
                this is information
                <h1>name: this is name</h1>
                <h1>dob: this is name</h1>
            </UContainer>
        </div>

        <!-- content -->
        <div :class="`${contentWidth} h-screen transition-width transition-all duration-500 shadow`">
            <UContainer>
                <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                    <UInput v-model="q" placeholder="Filter people..." />
                    <UButton>button</UButton>
                </div>

                <UTable :rows="filteredRows" :columns="columns" />
                <UContainer>
                <Chart :value_data="chart.volume.vol_value" :time_data="chart.volume.vol_time" />
                <Chart :value_data="chart.flow_rate.fr_value" :time_data="chart.flow_rate.fr_time" />
            </UContainer>
            </UContainer>
        </div>
    </div>
</template>