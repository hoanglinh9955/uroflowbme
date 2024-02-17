<script setup lang="ts">
import { ref } from 'vue';
import Chart from './chart.vue';
import { addOrderModal } from '~/stores/storeModal'
import { storeToRefs } from "pinia";
import { createPinia } from 'pinia';
import { createApp } from 'vue'
import App from '../app.vue'
import type { FormError, FormSubmitEvent } from '#ui/types'

const state = reactive({
    patient_id: undefined,
    name: undefined,
    dob: undefined,
    gender: undefined
})
const isAdmin = ref(false)
const genderstatus = ref(0)
const genderList = ['Male', 'Female']
const isSubmit = ref(false)
const isEdit = ref(false)
const toast = useToast()
const peopleData = reactive([])
const selectedSignal = ref([])
const isAddSignal = ref(false)
const deleteId = ref(0)
const signalOption = ref()
const isDelete = ref(false)
const { data, pending, error, refresh } = await useFetch('https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/patient/get')


if (data.value.length > 0) {
    peopleData.splice(0, peopleData.length);
    peopleData.push(
        data.value.map(person => ({
            ...person,
            gender: person.gender === 1 ? 'Male' : 'Female'
        }))
    );
}


const { data: chart, pending: chartPending, error: chartError } = await useFetch('https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/signal_info/1498255288')
// console.log("🚀 ~ file: index.vue:8 ~ chart:", chart.value.flow_rate.fr_time)
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
const selected = ref(peopleData[0][0])
const { data: signalData } = await useFetch(`https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/signal_meta/${selected.value.patient_id}`)
signalOption.value = signalData.value

const isOpenChart = ref(false);
const isOpenAddPatient = storeToRefs(addOrderModal()).addPatientState;

const isDisableButton = computed(() => {
    if (selectedSignal.value.length > 0) {
        return true;
    } else {
        return false;
    }
})


const reloadState = storeToRefs(addOrderModal()).reloadState;

const currentDate = new Date();
const birthDate = ref()
birthDate.value = new Date(selected.value.dob);
const age = storeToRefs(addOrderModal()).age;
const ageInMilliseconds = currentDate - birthDate.value;
const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25; // Account for leap years
const ageInYears = ageInMilliseconds / millisecondsPerYear;
const roundedAge = Math.ceil(ageInYears);

age.value = roundedAge
console.log("🚀 ~ age:", age)


const supabase = useSupabaseClient();
const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error(error);
        return;
    }

    await navigateTo('/login');
};

const isSignalSelected = computed(() => {
    if (selectedSignal.value.length > 0) {
        return true
    } else {
        return false
    }
})

watch(selectedSignal, async () => {
    await navigateTo(`/dashboard/${selectedSignal.value}`)
});

const onSubmit = async () => {
    console.log(state)
    isSubmit.value = true;

    if (state.gender === 'Male') {
        genderstatus.value = 1
    } else {
        genderstatus.value = 0
    }

    const { data, pending, error, refresh } = await useFetch('https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/patient/add', {
        method: 'post',
        body: {
            name: state.name,
            dob: state.dob,
            gender: genderstatus.value
        }
    })

    if (data.value.message === 'Patient added successfully') {
        isSubmit.value = false;
        isOpenAddPatient.value = false
        reloadState.value++
        toast.add({ title: 'Add Patient Success !', timeout: 2500, color: 'blue' })
    }
}


const onSubmitDelete = async () => {

    
    console.log(selectedSignal.value)
const { data, pending, error, refresh } = await useFetch(`https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/signal/delete/${selectedSignal.value}`, {
    method: 'delete'
})
selectedSignal.value = []

if (data.value.message === 'Signal and related data deleted successfully') {
    reloadState.value++
    toast.add({ title: 'Delete signal success !', timeout: 2500, color: 'blue' })
}
}
const onSubmitEdit = async () => {

    isEdit.value = true;

    if (state.gender === 'Male') {
        genderstatus.value = 1
    } else {
        genderstatus.value = 0
    }


    const { data, pending, error, refresh } = await useFetch(`https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/patient/modify/${selected.value.patient_id}`, {
        method: 'put',
        body: {
            name: state.name,
            dob: state.dob,
            gender: genderstatus.value
        }
    })

    if (data.value.message === 'Patient information updated successfully') {
        isEdit.value = false;
        isOpenAddPatient.value = false
        reloadState.value++
        toast.add({ title: 'Update Patient Success !', timeout: 2500, color: 'blue' })
    }
}

const validate = (state: any): FormError[] => {
    const errors = [];
    if (state.name == undefined || null) {
        errors.push({ path: 'name', message: 'Name cannot be blank !!!' });
    }

    const dobPattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobPattern.test(state.dob)) {
        errors.push({ path: 'dob', message: 'Date of Birth must be in the format yyyy-MM-dd' });
    }

    if (state.gender == undefined || null) {
        errors.push({ path: 'gender', message: 'Gender cannot be blank !!!' });
    }

    return errors;
};

watch(reloadState, async () => {
    const { data, pending, error, refresh } = await useFetch(`https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/patient/get`);

    if (data.value.length > 0) {
        peopleData.splice(0, peopleData.length);
        peopleData.push(
            data.value.map(person => ({
                ...person,
                gender: person.gender === 1 ? 'Male' : 'Female'
            }))
        );
    }
    selectedSignal.value = []
    const { data: newData} = await useFetch(`https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/signal_meta/${selected.value.patient_id}`)
        signalOption.value = newData.value
});

watch(selected,
    async () => {
        selectedSignal.value = [];
        isAddSignal.value = false
        const { data, pending, error, refresh } = await useFetch(`https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/signal_meta/${selected.value.patient_id}`)
        signalOption.value = data.value
        birthDate.value = new Date(selected.value.dob);
        const currentDate = new Date();

        const ageInMilliseconds = currentDate - birthDate.value;
        const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25; // Account for leap years
        const ageInYears = ageInMilliseconds / millisecondsPerYear;
        const roundedAge = Math.ceil(ageInYears);

        age.value = roundedAge
        console.log("🚀 ~ age:", age)
    }
)

watch(isAddSignal,
    async () => {
        const { data, pending, error, refresh } = await useFetch(`https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/signal/activate/${selected.value.patient_id}`, {
            method: 'put'
        })
        console.log(data.value)
        console.log("🚀 ~ error:", error)

    }
)


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
},
{
    key: 'actions'
}]

const items = (row: any) => [
    [{
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => {
            isEdit.value = true
        }
    }], [{
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        click: () => {
            isDelete.value = true
            deleteId.value = row.patient_id
        }
    }]
]


const deletePatient = async () => {
    const { data, pending, error, refresh } = await useFetch(`https://27h447fm75fpicw4wbt2x6powe0wraio.lambda-url.ap-southeast-1.on.aws/patient/delete/${deleteId.value}`, {
        method: 'delete',
    })

    if (data.value.message === 'Patient and related data deleted successfully') {
        reloadState.value++;
        toast.add({ title: 'Delete Patient Successfully !', timeout: 2500, color: 'blue' })
        isDelete.value = false;
        selected.value = undefined

    }
}

function select(row: any) {
    selected.value = row;
    state.patient_id = row.patient_id;
    state.name = row.name;
    state.dob = row.dob;
    state.gender = row.gender;
}

const q = ref('')

const selectModal = computed(() =>{
    if(selectedSignal.value.length != 0){
        return true
    }else{
        return false
    }
})

const filteredRows = computed(() => {
    if (!q.value) {
        return peopleData[0]
    }

    return peopleData[0].filter((person) => {
        return Object.values(person).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase())
        })
    })
})

const page = ref(1)
const pageCount = 9

const paginatedRows = computed(() => {
    const startIndex = (page.value - 1) * pageCount;
    const endIndex = startIndex + pageCount;
    return filteredRows.value.slice(startIndex, endIndex);
});
const user = useSupabaseUser();
if (!user.value) {
    logout();
} else {
    isAdmin.value = true
}

const links = [
    {
        label: 'Installation',
        icon: 'i-heroicons-home',
        to: '/getting-started/installation'
    }, {
        label: 'Vertical Navigation',
        icon: 'i-heroicons-chart-bar',
        to: '/navigation/vertical-navigation'
    }, {
        label: 'Command Palette',
        icon: 'i-heroicons-command-line',
        to: '/navigation/command-palette'
    }]




</script>

<template>
    <div v-if="isAdmin" class="flex ">
        <!-- sidebar -->
        <div class="flex flex-col items-center w-1/5 pt-4 font-sans justify-between">

            <div class="w-full p-3 flex flex-col space-y-3" v-if="selected">
                <!-- add patient container     -->
                <div class="flex justify-between">
                    <h1 class="text-xl font-medium">Patient Information</h1>
                    <UButton variant="ghost" color="gray" :disabled="isDisableButton" class="rounded-lg"
                        @click="isEdit = true">
                        <Icon size="15px" name="i-heroicons-pencil-square" />
                    </UButton>
                </div>
                <!-- patient infor -->
                <div class="pt-4 flex flex-col space-y-4 w-full bg-gray-50 p-2 rounded-lg">

                    <div class="flex justify-between items-center ">
                        <h2>Name: </h2>
                        <h2>{{ selected.name }}</h2>
                    </div>
                    <div class="flex justify-between">
                        <h2>Birth Date: </h2>
                        <h2>{{ selected.dob }}</h2>
                    </div>
                    <div class="flex justify-between">
                        <h2>Gender: </h2>
                        <h2> {{ selected.gender }} </h2>
                    </div>
                </div>

                <div class="flex justify-between items-baseline">
                    <h1 class="pt-2 pb-4 text-xl font-medium">Signal</h1>
                    <UToggle v-model="isAddSignal" />
                </div>

                <USelect color="gray" v-model="selectedSignal" :options="signalOption" option-attribute="signal_id"
                    placeholder="Select Signal" />
                <UButton v-show="selectModal" color="gray" class="rounded-lg" @click="onSubmitDelete" trailingIcon="i-heroicons-trash">
                    Delete Signal
                    
                </UButton>
                


                <div class="flex justify-end items-center py-2">
                    <div> </div>
                    <!-- <UButton v-show="isAddSignal" class="rounded-lg h-auto"
                        @click="isAddSignal = false">
                        <Icon size="15px" name="i-heroicons-check" />Done
                    </UButton> -->

                </div>

            </div>

            <div v-else class="text-white">
                choose patient
            </div>
            <div class="pt-4 justify-center flex flex-col space-y-2 w-full bg-gray-50 p-5 rounded-lg">

                <h2 class="text-lg font-medium">By Group 3: </h2>
                <h2>Huỳnh Nguyên Minh Trí</h2>
                <h2>Châu Thành Huy</h2>
                <h2>Phạm Hoài Bảo</h2>


                <h1 class="text-xl font-medium text-center pt-4">BME Capstone Project <span
                        class="font-bold text-primary">TeleUroflow</span> </h1>
                <div class="flex items-center justify-center">
                    <img src='https://i.ibb.co/sQPkGfj/eabedf33a318f626fcc0f14b799ea73e.png' alt="Girl in a jacket"
                        width="39" height="39">
                    <img src='https://i.ibb.co/KVQjzHh/a4e0e78ae6864eff3f8a2b17e3596811.png' alt="Girl in a jacket"
                        width="39" height="39">

                </div>
            </div>
            <UserCard />

        </div>

        <!-- content -->
        <div class="w-4/5 h-screen bg-gray-50">
            <UContainer v-if="!isSignalSelected">
                <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                    <UInput v-model="q" placeholder="Search..." trailing icon="i-heroicons-magnifying-glass-20-solid" />
                    <UButton class="rounded-lg ml-4" @click="isOpenAddPatient = true">
                        <Icon size="20px" name="i-heroicons-plus" />
                    </UButton>
                </div>
                <NuxtErrorBoundary>
                    <UTable :rows="paginatedRows" :columns="columns" @select="select">
                        <template #actions-data="{ row }">
                            <UDropdown :items="items(row)">
                                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                            </UDropdown>
                        </template>
                        <template v-if="selected" #patient_id-data="{ row }">
                            <span :class="{ 'text-blue-400 dark:text-blue-300': selected.patient_id == row.patient_id }">{{
                                row.patient_id }}</span>
                        </template>


                    </UTable>
                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
                <div class="flex justify-end">
                    <UPagination class="p-2" :active-button="{ color: 'blue' }" :inactive-button="{ color: 'gray' }"
                        show-last show-first v-model="page" :page-count="pageCount" :total="filteredRows.length" />

                </div>

                <AddPatient />
                <UModal v-model="isDelete">
                    <div class="py-2 h-38">
                        <h1 class="text-center py-4">Do You Want To Delete This Transaction ?</h1>
                        <UContainer class="flex justify-around p-3 pt-1">
                            <UButton color="red" class="w-24 text-center justify-center" @click="deletePatient">Yes
                            </UButton>
                            <UButton class="w-24 text-center justify-center" @click="isDelete = false">No
                            </UButton>
                        </UContainer>
                    </div>
                </UModal>
                <UModal v-model="isEdit">
                    <div class="p-10">

                        <div class="pb-2" v-if="isSubmit">
                            <UProgress animation="swing" />
                        </div>
                        <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmitEdit">

                            <UFormGroup label="Patient Name" name="name">
                                <UInput v-model="state.name" />
                            </UFormGroup>

                            <UFormGroup label="Date Of Birth" name="dob">
                                <UInput v-model="state.dob" :placeholder="'yyyy-MM-dd'" />
                            </UFormGroup>


                            <UFormGroup label="Gender" name="gender">
                                <USelect v-model="state.gender" :options="genderList" placeholder="Choose Gender" />
                            </UFormGroup>


                            <UButton type="submit" :disabled="isSubmit">
                                Edit Patient
                            </UButton>
                        </UForm>
                    </div>
                </UModal>
            </UContainer>
            <UContainer v-if="isSignalSelected">
                <NuxtPage />
            </UContainer>
        </div>
    </div>
    <UContainer v-if="!isAdmin">
        <UProgress animation="swing" />
    </UContainer>
</template>