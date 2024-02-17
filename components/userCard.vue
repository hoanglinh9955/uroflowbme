<template>
  <div v-if="user" class="flex w-full p-3">
    <div class="bg-gray-50 flex justify-between px-4 py-2 space-x-3 items-center rounded-lg w-full">
    <UAvatar chip-position="top-right" size="lg" :src="profile" alt="Avatar" />
    <div class="text-right">
      <div class="font-medium">{{ name }}</div>
      <button class="text-sm underline text-slate-500" @click="logout">
        Log out
      </button>
    </div>
  </div>
</div>
</template>
  
<script setup lang="ts">
const user = useSupabaseUser();
console.log("🚀 ~ user:", user)
const supabase = useSupabaseClient();

const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return;
  }

  await navigateTo('/login');
};

const name = computed(
  () => user.value?.user_metadata.full_name
);
const profile = computed(
  () => user.value?.user_metadata.avatar_url
);
</script>