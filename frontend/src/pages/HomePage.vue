<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">
              Welcome to SmartRecruit
            </h1>
            <p class="text-lg text-gray-600 mb-8">
              Your comprehensive recruitment management platform
            </p>

            <!-- Quick Actions -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div v-if="$can('users.view')" class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-medium text-gray-900 mb-2">User Management</h3>
                <p class="text-gray-600 mb-4">Manage users, roles, and permissions</p>
                <router-link
                  to="/users"
                  class="btn-primary"
                >
                  Manage Users
                </router-link>
              </div>

              <div v-if="$can('audit.view')" class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Audit Trail</h3>
                <p class="text-gray-600 mb-4">View system activity and logs</p>
                <router-link
                  to="/audit"
                  class="btn-primary"
                >
                  View Audit Logs
                </router-link>
              </div>

              <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-medium text-gray-900 mb-2">My Profile</h3>
                <p class="text-gray-600 mb-4">Update your profile and settings</p>
                <router-link
                  to="/profile"
                  class="btn-secondary"
                >
                  Edit Profile
                </router-link>
              </div>
            </div>

            <!-- User Info -->
            <div class="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
              <div class="flex items-center space-x-4">
                <img
                  v-if="user?.avatar_url"
                  :src="user.avatar_url"
                  :alt="user.first_name"
                  class="w-12 h-12 rounded-full object-cover"
                >
                <div v-else class="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span class="text-white font-medium">
                    {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
                  </span>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ user?.first_name }} {{ user?.last_name }}
                  </h3>
                  <p class="text-gray-600">{{ user?.email }}</p>
                  <p class="text-sm text-gray-500 capitalize">{{ user?.role }}</p>
                </div>
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
</script>