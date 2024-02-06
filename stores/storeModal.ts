import { defineStore } from 'pinia';

export const addOrderModal = defineStore('addPient', () => {

  const addPatientState = ref(false)
  const reloadState = ref(1)
  return { addPatientState, reloadState }
})