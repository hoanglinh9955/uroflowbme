<script setup>
const isOpen = ref(false)
</script>

<template>
  <div class="bg-green-500 h-screen border-black flex justify-between">

    <UButton label="Open" @click="isOpen = true" />
    <div class="bg-red-700">this is div</div>
    <USlideover v-model="isOpen" :side="'right'" 
    :transition="true" :appear="true" 
    :overlay="false">
      <div class="p-4 flex-1">
        <Placeholder class="h-full" />
      </div>
    </USlideover>
  </div>
</template>

