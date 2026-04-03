<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">Audit Logs</h1>
      </div>
      
      <!-- Filters -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex flex-wrap gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search logs..."
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
          <select
            v-model="actionFilter"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
          <input
            v-model="dateFilter"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
        </div>
      </div>
    </div>

    <!-- Audit Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resource
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(log.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span class="text-white text-xs font-medium">
                      {{ log.user?.first_name?.charAt(0) }}{{ log.user?.last_name?.charAt(0) }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">
                      {{ log.user?.first_name }} {{ log.user?.last_name }}
                    </div>
                    <div class="text-sm text-gray-500">{{ log.user?.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize"
                  :class="getActionClass(log.action)">
                  {{ log.action }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ log.entity_type || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ log.ip_address }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <div class="max-w-xs truncate" :title="log.details">
                  {{ log.details || '-' }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const actionFilter = ref('')
const dateFilter = ref('')
const logs = ref([])

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchesSearch = !searchQuery.value || 
      `${log.user?.first_name} ${log.user?.last_name} ${log.user?.email} ${log.action}`.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesAction = !actionFilter.value || log.action === actionFilter.value
    const matchesDate = !dateFilter.value || 
      new Date(log.created_at).toDateString() === new Date(dateFilter.value).toDateString()
    
    return matchesSearch && matchesAction && matchesDate
  })
})

const getActionClass = (action) => {
  const classes = {
    login: 'bg-green-100 text-green-800',
    logout: 'bg-gray-100 text-gray-800',
    create: 'bg-blue-100 text-blue-800',
    update: 'bg-yellow-100 text-yellow-800',
    delete: 'bg-red-100 text-red-800'
  }
  return classes[action] || 'bg-gray-100 text-gray-800'
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString()
}

const loadAuditLogs = async () => {
  // TODO: Implement API call
  logs.value = [
    {
      id: 1,
      action: 'login',
      entity_type: 'user',
      entity_id: 1,
      user: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com'
      },
      ip_address: '192.168.1.100',
      details: 'User logged in successfully',
      created_at: '2024-03-15T10:30:00Z'
    },
    {
      id: 2,
      action: 'update',
      entity_type: 'user',
      entity_id: 2,
      user: {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com'
      },
      ip_address: '192.168.1.101',
      details: 'Updated user profile information',
      created_at: '2024-03-15T11:45:00Z'
    }
  ]
}

onMounted(() => {
  loadAuditLogs()
})
</script>
