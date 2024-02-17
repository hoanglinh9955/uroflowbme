<template>
  <div class="flex flex-col justify-center items-center space-y-4 h-screen">
    <div class="flex items-center justify-center">
                    <img src='https://i.ibb.co/sQPkGfj/eabedf33a318f626fcc0f14b799ea73e.png' alt="Girl in a jacket"
                        width="120" height="120">
                    <img src='https://i.ibb.co/KVQjzHh/a4e0e78ae6864eff3f8a2b17e3596811.png' alt="Girl in a jacket"
                        width="120" height="120">

                </div>
    <h1 class="text-7xl">TeleUroflow</h1>
    <h1 class="text-2xl">A Capstone Project From BMEIU</h1>
    <UButton class="w-28 h-14 items-center justify-center text-xl" size="lg" @click="login">Login</UButton>
  </div>
</template>

<script setup lang="ts">
const { query } = useRoute();

const supabase = useSupabaseClient();
const user = useSupabaseUser();


const login = async () => {
  const redirectTo = `${window.location.origin}` + "/dashboard";
  console.log(redirectTo)


  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });



  if (error) {
    console.error(error);
  }
};
</script>
