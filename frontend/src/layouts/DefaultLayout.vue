<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold text-gray-900">
                SmartRecruitooooo
              </router-link>
            </div>

            <!-- Navigation Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-indigo-500 text-gray-900"
              >
                Dashboard
              </router-link>

              <router-link
                v-if="$can('view_users')"
                to="/users"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-indigo-500 text-gray-900"
              >
                Users
              </router-link>

              <router-link
                v-if="$can('view_audit_logs')"
                to="/audit"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-indigo-500 text-gray-900"
              >
                Audit Trail
              </router-link>
            </div>
          </div>

          <!-- Profile dropdown -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <div class="ml-3 relative">
              <div>
                <button
                  @click="toggleProfileMenu"
                  class="bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-50 transition-colors p-1"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span class="sr-only">Open user menu</span>
                  <img
                    v-if="user?.avatar"
                    :src="user.avatar"
                    :alt="user.firstName"
                    class="h-8 w-8 rounded-full object-cover"
                  >
                  <div v-else class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span class="text-white font-medium text-sm">
                      {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
                    </span>
                  </div>
                  <svg class="svg-icon-sm text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>

              <!-- Profile dropdown menu -->
              <div
                v-show="showProfileMenu"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                <div class="px-4 py-2 text-sm text-gray-700 border-b">
                  <div class="font-medium">{{ user?.firstName }} {{ user?.lastName }}</div>
                  <div class="text-gray-500">{{ user?.email }}</div>
                </div>

                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabindex="-1"
                >
                  Your Profile
                </router-link>

                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabindex="-1"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="sm:hidden">
            <button
              @click="toggleMobileMenu"
              class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                :class="{ 'hidden': showMobileMenu, 'block': !showMobileMenu }"
                class="svg-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                :class="{ 'hidden': !showMobileMenu, 'block': showMobileMenu }"
                class="svg-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="showMobileMenu" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link
            to="/"
            class="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
          >
            Dashboard
          </router-link>

          <router-link
            v-if="$can('view_users')"
            to="/users"
            class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
          >
            Users
          </router-link>

          <router-link
            v-if="$can('view_audit_logs')"
            to="/audit"
            class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-indigo-50 border-indigo-500 text-indigo-700"
          >
            Audit Trail
          </router-link>
        </div>

        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <img
                v-if="user?.avatar"
                :src="user.avatar"
                :alt="user.firstName"
                class="h-10 w-10 rounded-full"
              >
              <div v-else class="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                <span class="text-white font-medium">
                  {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">
                {{ user?.firstName }} {{ user?.lastName }}
              </div>
              <div class="text-sm font-medium text-gray-500">
                {{ user?.email }}
              </div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <router-link
              to="/profile"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Your Profile
            </router-link>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div class="text-center text-sm text-gray-500">
          © 2024 SmartRecruit. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const { logout } = useAuth()
const router = useRouter()

const user = computed(() => authStore.user)
const showProfileMenu = ref(false)
const showMobileMenu = ref(false)

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Close menus when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('#user-menu-button')) {
    showProfileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
