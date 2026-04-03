<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <TheSidebar />
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <!-- Page Title -->
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
              <p class="text-sm text-gray-500 mt-1">{{ user?.role }} dashboard</p>
            </div>
            
            <!-- User Actions -->
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button class="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-xl transition-colors">
                <svg class="svg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <!-- Profile Dropdown -->
              <div class="relative">
                <button
                  @click="toggleProfileMenu"
                  class="flex items-center space-x-3 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  <div class="relative">
                    <img
                      v-if="user?.avatar_url"
                      :src="user.avatar_url"
                      :alt="user.first_name"
                      class="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                    >
                    <div v-else class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <span class="text-white font-medium text-sm">
                        {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
                      </span>
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-medium text-gray-900">{{ user?.first_name }} {{ user?.last_name }}</p>
                    <p class="text-xs text-gray-500">{{ user?.email }}</p>
                  </div>
                  <svg class="svg-icon text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7m14 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                
                <!-- Dropdown Menu -->
                <div
                  v-show="showProfileMenu"
                  class="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100"
                  role="menu"
                >
                  <div class="px-4 py-3 border-b border-gray-100">
                    <p class="text-sm font-medium text-gray-900">{{ user?.first_name }} {{ user?.last_name }}</p>
                    <p class="text-sm text-gray-500">{{ user?.email }}</p>
                  </div>
                  
                  <router-link
                    to="/profile"
                    class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    role="menuitem"
                  >
                    <svg class="svg-icon mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Your Profile
                  </router-link>
                  
                  <button
                    @click="handleLogout"
                    class="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    role="menuitem"
                  >
                    <svg class="svg-icon mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4 4m4-4H3m2 4h6m-6 4h6m-6-4v4m6-4v4" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50">
        <div class="p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import { useUI } from '@/composables/useUI'
import TheSidebar from '@/components/common/TheSidebar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { logout } = useAuth()
const ui = useUI()

const user = computed(() => authStore.user)
const showProfileMenu = ref(false)

const pageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard',
    '/users': 'User Management',
    '/audit': 'Audit Logs',
    '/analytics': 'Analytics',
    '/profile': 'Profile Settings'
  }
  return titles[route.path] || 'Dashboard'
})

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const handleLogout = async () => {
  try {
    const confirmed = await ui.confirmLogout()
    if (confirmed) {
      ui.setConfirmLoading(true)
      await logout()
      ui.showSuccess('Logged Out', 'You have been successfully logged out.')
      router.push('/login')
    }
  } catch (error) {
    console.error('Logout error:', error)
    ui.showError('Logout Failed', 'An error occurred during logout.')
  } finally {
    ui.setConfirmLoading(false)
  }
}

// Close menu when clicking outside
document.addEventListener('click', (event) => {
  if (!event.target.closest('.relative')) {
    showProfileMenu.value = false
  }
})
</script>

<style scoped>
main {
  background-color: #f9fafb;
}
</style>
