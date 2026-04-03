<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">SmartRecruit</h1>
        <p class="text-gray-600">Your recruitment management platform</p>
      </div>
      
      <!-- Auth form -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <slot />
      </div>
      
      <!-- Footer -->
      <div class="text-center mt-8 text-sm text-gray-500">
        <p>&copy; 2024 SmartRecruit. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Layout pour les pages d'authentification (login, register, etc.)
</script>

<style scoped>
/* Styles spécifiques pour l'auth */
</style>
