<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/" class="text-3xl font-bold text-gray-900">
          SmartRecruit
        </router-link>
      </div>

      <!-- Content -->
      <slot />
    </div>
  </div>
</template>

<script setup>
// Auth layout - minimal layout for authentication pages
</script>
