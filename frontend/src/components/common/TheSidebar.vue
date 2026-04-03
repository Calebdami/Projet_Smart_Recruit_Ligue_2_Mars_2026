<template>
  <aside class="w-64 bg-gradient-to-b from-gray-900 to-gray-800 h-full shadow-2xl border-r border-gray-700">
    <!-- Logo Section -->
    <div class="p-6 border-b border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <span class="text-white font-bold text-lg">SR</span>
        </div>
        <div>
          <h2 class="text-lg font-bold text-white">Menu</h2>
          <p class="text-xs text-gray-400">Navigation</p>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <div class="p-6 flex-1 overflow-y-auto">
      <nav class="space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
          :class="isActive(item.path) 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border-l-4 border-indigo-400' 
            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'"
        >
          <span class="svg-icon mr-3 transition-colors duration-200" :class="isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-white'">
            <component :is="item.icon" />
          </span>
          <span class="flex-1">{{ item.name }}</span>
          <!-- Active indicator -->
          <div v-if="isActive(item.path)" class="w-2 h-2 bg-white rounded-full"></div>
        </router-link>
      </nav>
    </div>

    <!-- User Section -->
    <div class="p-6 border-t border-gray-700 bg-gray-800/50">
      <div class="flex items-center space-x-3 p-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer">
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-sm">
              {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
            </span>
          </div>
          <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">
            {{ user?.first_name }} {{ user?.last_name }}
          </p>
          <p class="text-xs text-gray-400 capitalize truncate">{{ user?.role }}</p>
        </div>
        <svg class="svg-icon text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7m14 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
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