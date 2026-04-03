<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div class="px-4 py-8 sm:px-0">
        <!-- Welcome Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to SmartRecruit
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive recruitment management platform
          </p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-lg">
                <svg class="svg-icon text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Users</p>
                <p class="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-lg">
                <svg class="svg-icon text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Active Jobs</p>
                <p class="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-lg">
                <svg class="svg-icon text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Applications</p>
                <p class="text-2xl font-bold text-gray-900">456</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div class="flex items-center">
              <div class="p-3 bg-yellow-100 rounded-lg">
                <svg class="svg-icon text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Interviews</p>
                <p class="text-2xl font-bold text-gray-900">23</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div v-if="$can('view_users')" class="bg-gradient-to-br from-indigo-500 to-indigo-600 p-8 rounded-2xl shadow-xl text-white hover:shadow-2xl transition-all hover:scale-105">
            <div class="flex items-center mb-4">
              <svg class="svg-icon-lg mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 class="text-xl font-semibold">User Management</h3>
            </div>
            <p class="text-indigo-100 mb-6">Manage users, roles, and permissions</p>
            <router-link
              to="/users"
              class="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              Manage Users
              <svg class="svg-icon ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5-5m5 5H9" />
              </svg>
            </router-link>
          </div>

          <div v-if="$can('view_audit_logs')" class="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 rounded-2xl shadow-xl text-white hover:shadow-2xl transition-all hover:scale-105">
            <div class="flex items-center mb-4">
              <svg class="svg-icon-lg mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="text-xl font-semibold">Audit Trail</h3>
            </div>
            <p class="text-emerald-100 mb-6">View system activity and logs</p>
            <router-link
              to="/audit"
              class="inline-flex items-center px-6 py-3 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
            >
              View Audit Logs
              <svg class="svg-icon ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5-5m5 5H9" />
              </svg>
            </router-link>
          </div>

          <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-2xl shadow-xl text-white hover:shadow-2xl transition-all hover:scale-105">
            <div class="flex items-center mb-4">
              <svg class="svg-icon-lg mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 class="text-xl font-semibold">My Profile</h3>
            </div>
            <p class="text-purple-100 mb-6">Update your profile and settings</p>
            <router-link
              to="/profile"
              class="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Edit Profile
              <svg class="svg-icon ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5-5m5 5H9" />
              </svg>
            </router-link>
          </div>
        </div>

        <!-- User Info Card -->
        <div class="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto border border-gray-100">
          <div class="flex items-center space-x-6">
            <div class="relative">
              <img
                v-if="user?.avatar_url"
                :src="user.avatar_url"
                :alt="user.first_name"
                class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              >
              <div v-else class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span class="text-white text-2xl font-bold">
                  {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
                </span>
              </div>
              <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                {{ user?.first_name }} {{ user?.last_name }}
              </h3>
              <p class="text-gray-600 mb-1">{{ user?.email }}</p>
              <div class="flex items-center space-x-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {{ user?.role }}
                </span>
                <span class="text-sm text-gray-500">
                  Last login: {{ formatDate(user?.last_login_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>