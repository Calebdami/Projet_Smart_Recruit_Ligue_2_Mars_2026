<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">SmartRecruit</h1>
          </div>

          <div class="flex items-center space-x-4" v-if="isAuthenticated">
            <!-- Profile Dropdown -->
            <div class="relative" v-click-outside="closeProfileMenu">
              <button
                @click="toggleProfileMenu"
                class="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <img
                  :src="userAvatar"
                  :alt="user?.first_name"
                  class="w-8 h-8 rounded-full"
                />
                <span class="text-gray-700">{{ user?.first_name }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- Profile Menu -->
              <div
                v-show="showProfileMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeProfileMenu"
                >
                  Profile Settings
                </router-link>

                <router-link
                  v-if="isAdmin"
                  to="/audit-trail"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="closeProfileMenu"
                >
                  Audit Trail
                </router-link>

                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'

const authStore = useAuthStore()
const { logout } = useAuth()

const showProfileMenu = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const isAdmin = computed(() => user.value?.role === 'admin')

const userAvatar = computed(() => {
  return user.value?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(
    `${user.value?.first_name || ''} ${user.value?.last_name || ''}`
  )}&background=6366f1&color=fff&size=32`
})

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const closeProfileMenu = () => {
  showProfileMenu.value = false
}

const handleLogout = async () => {
  await logout()
  closeProfileMenu()
}
</script>

<style>
/* Global styles */
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
