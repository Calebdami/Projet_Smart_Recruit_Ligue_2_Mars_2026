<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-primary-600">SmartRecruit v2.0</router-link>
        </div>
        <div class="flex space-x-4">
          <router-link to="/jobs" class="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">Jobs</router-link>
          <router-link to="/candidates" class="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">Candidats</router-link>
        </div>
      </nav>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// No script needed for basic layout
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
