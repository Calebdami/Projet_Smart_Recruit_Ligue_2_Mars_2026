<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// App.vue ne gère plus la navigation, DefaultLayout s'en charge
</script>

<style>
/* Global styles */
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
