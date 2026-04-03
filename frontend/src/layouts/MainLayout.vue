<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <TheSidebar />
    
    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Top navigation -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Page title -->
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h1>
            </div>

            <!-- Right side actions -->
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button class="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md">
                <svg class="svg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <!-- Profile dropdown -->
              <div class="relative">
                <button
                  @click="toggleProfileMenu"
                  class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-1"
                >
                  <img
                    v-if="user?.avatar_url"
                    :src="user.avatar_url"
                    :alt="user.first_name"
                    class="h-8 w-8 rounded-full object-cover"
                  >
                  <div v-else class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span class="text-white font-medium text-sm">
                      {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
                    </span>
                  </div>
                  <svg class="svg-icon-sm text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- Profile dropdown menu -->
                <div
                  v-show="showProfileMenu"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
                  role="menu"
                >
                  <router-link
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </router-link>
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto">
        <div class="py-6">
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
import TheSidebar from '@/components/common/TheSidebar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { logout } = useAuth()

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
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
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
