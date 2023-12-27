<script setup lang="ts">
const user = useSupabaseUser();
console.log(user);
watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/");
    }
  },
  { immediate: true }
);
</script>
<template>
  <div>Waiting for login...</div>
</template>
