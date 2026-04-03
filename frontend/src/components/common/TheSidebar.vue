<template>
  <aside class="w-64 bg-white shadow-lg h-full">
    <div class="p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Menu</h2>
      
      <nav class="space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="isActive(item.path) 
            ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <span class="svg-icon mr-3" :class="isActive(item.path) ? 'text-indigo-700' : 'text-gray-400'">
            <component :is="item.icon" />
          </span>
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <!-- User section -->
    <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
      <div class="flex items-center">
        <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
          <span class="text-white text-sm font-medium">
            {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
          </span>
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium text-gray-900">
            {{ user?.first_name }} {{ user?.last_name }}
          </p>
          <p class="text-xs text-gray-500 capitalize">{{ user?.role }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Simple SVG Icons
const HomeIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1 1v4a1 1 0 001 1h3m-6 0h6" />
    </svg>
  `
}

const UserGroupIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  `
}

const DocumentTextIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `
}

const CogIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    </svg>
  `
}

const ChartBarIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  `
}

const route = useRoute()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const menuItems = computed(() => {
  const items = [
    {
      name: 'Dashboard',
      path: '/',
      icon: HomeIcon
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: CogIcon
    }
  ]

  // Add admin-only items
  if (user.value?.role === 'admin') {
    items.push(
      {
        name: 'Users',
        path: '/users',
        icon: UserGroupIcon
      },
      {
        name: 'Audit Logs',
        path: '/audit',
        icon: DocumentTextIcon
      },
      {
        name: 'Analytics',
        path: '/analytics',
        icon: ChartBarIcon
      }
    )
  }

  return items
})

const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
aside {
  position: relative;
}
</style>