<template>
    <UContainer class="h-screen w-screen flex justify-center items-center">
      <UButton>Login</UButton>
    </UContainer>
</template>
  
  <script setup lang="ts">
  const { query } = useRoute();
  
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const login = async () => {
    let redirectTo = `${window.location.origin}${query.redirectTo}`;
  
    //   const redirectTo = `${window.location.origin}` + "/";
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
  