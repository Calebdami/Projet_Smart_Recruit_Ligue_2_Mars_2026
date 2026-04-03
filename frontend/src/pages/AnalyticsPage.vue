<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 bg-indigo-500 rounded-full">
            <svg class="svg-icon text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-500 rounded-full">
            <svg class="svg-icon text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Active Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.activeUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-500 rounded-full">
            <svg class="svg-icon text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Jobs</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalJobs }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 bg-purple-500 rounded-full">
            <svg class="svg-icon text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Applications</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalApplications }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- User Growth Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p class="text-gray-500">Chart placeholder - User growth over time</p>
        </div>
      </div>

      <!-- Application Status Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Application Status</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p class="text-gray-500">Chart placeholder - Application status distribution</p>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow mt-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
              <span class="text-white font-medium">
                {{ activity.user?.first_name?.charAt(0) }}{{ activity.user?.last_name?.charAt(0) }}
              </span>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm text-gray-900">
                <span class="font-medium">{{ activity.user?.first_name }} {{ activity.user?.last_name }}</span>
                {{ activity.description }}
              </p>
              <p class="text-xs text-gray-500">{{ formatDateTime(activity.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  totalJobs: 0,
  totalApplications: 0
})

const recentActivity = ref([])

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString()
}

const loadAnalytics = async () => {
  // TODO: Implement API calls
  stats.value = {
    totalUsers: 1234,
    activeUsers: 856,
    totalJobs: 45,
    totalApplications: 789
  }

  recentActivity.value = [
    {
      id: 1,
      user: {
        first_name: 'John',
        last_name: 'Doe'
      },
      description: 'created a new job posting',
      created_at: '2024-03-15T10:30:00Z'
    },
    {
      id: 2,
      user: {
        first_name: 'Jane',
        last_name: 'Smith'
      },
      description: 'applied for Senior Developer position',
      created_at: '2024-03-15T11:45:00Z'
    }
  ]
}

onMounted(() => {
  loadAnalytics()
})
</script>
