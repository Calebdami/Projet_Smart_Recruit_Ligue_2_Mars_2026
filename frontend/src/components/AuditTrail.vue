<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Audit Trail</h2>
        <p class="mt-1 text-sm text-gray-600">View system activity and user actions</p>
      </div>

      <!-- Filters -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="action_filter" class="block text-sm font-medium text-gray-700">
              Action
            </label>
            <select
              id="action_filter"
              v-model="filters.action"
              @change="fetchLogs"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="view">View</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="export">Export</option>
            </select>
          </div>

          <div>
            <label for="entity_filter" class="block text-sm font-medium text-gray-700">
              Entity Type
            </label>
            <select
              id="entity_filter"
              v-model="filters.entity_type"
              @change="fetchLogs"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Entities</option>
              <option value="user">User</option>
              <option value="candidate">Candidate</option>
              <option value="job">Job</option>
              <option value="application">Application</option>
              <option value="webinar">Webinar</option>
            </select>
          </div>

          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              id="search"
              v-model="filters.search"
              @input="debouncedSearch"
              type="text"
              placeholder="Search logs..."
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div class="flex items-end">
            <button
              @click="clearFilters"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Audit Logs Table -->
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
                Entity
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
            <tr v-if="loading" class="text-center">
              <td colspan="6" class="px-6 py-4">
                <div class="flex justify-center">
                  <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </td>
            </tr>
            <tr v-else-if="!hasLogs" class="text-center">
              <td colspan="6" class="px-6 py-4 text-sm text-gray-500">
                No audit logs found
              </td>
            </tr>
            <tr v-else v-for="log in auditLogs" :key="log.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatAuditLog(log).formattedDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div v-if="log.user_id">
                  {{ getUserDisplayName(log.user_id) }}
                </div>
                <div v-else class="text-gray-500">System</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getActionBadgeClass(log.action)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ formatAuditLog(log).actionLabel }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatAuditLog(log).entityLabel }}
                <span v-if="log.entity_id" class="text-gray-500">({{ log.entity_id }})</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ log.ip_address || 'N/A' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                <button
                  @click="showLogDetails(log)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.pages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of
          {{ pagination.total }} results
        </div>
        <div class="flex space-x-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page <= 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.pages"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Log Details Modal -->
    <div v-if="selectedLog" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Audit Log Details</h3>
            <button
              @click="closeLogDetails"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Timestamp</label>
                <p class="text-sm text-gray-900">{{ formatAuditLog(selectedLog).formattedDate }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">User</label>
                <p class="text-sm text-gray-900">{{ getUserDisplayName(selectedLog.user_id) || 'System' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Action</label>
                <p class="text-sm text-gray-900">{{ formatAuditLog(selectedLog).actionLabel }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Entity</label>
                <p class="text-sm text-gray-900">
                  {{ formatAuditLog(selectedLog).entityLabel }}
                  <span v-if="selectedLog.entity_id" class="text-gray-500">({{ selectedLog.entity_id }})</span>
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">IP Address</label>
                <p class="text-sm text-gray-900">{{ selectedLog.ip_address || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">User Agent</label>
                <p class="text-sm text-gray-900 truncate" :title="selectedLog.user_agent">
                  {{ selectedLog.user_agent || 'N/A' }}
                </p>
              </div>
            </div>

            <div v-if="selectedLog.old_values">
              <label class="block text-sm font-medium text-gray-700 mb-2">Old Values</label>
              <pre class="bg-gray-50 p-3 rounded text-xs overflow-x-auto">{{ JSON.stringify(selectedLog.old_values, null, 2) }}</pre>
            </div>

            <div v-if="selectedLog.new_values">
              <label class="block text-sm font-medium text-gray-700 mb-2">New Values</label>
              <pre class="bg-gray-50 p-3 rounded text-xs overflow-x-auto">{{ JSON.stringify(selectedLog.new_values, null, 2) }}</pre>
            </div>

            <div v-if="selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">Metadata</label>
              <pre class="bg-gray-50 p-3 rounded text-xs overflow-x-auto">{{ JSON.stringify(selectedLog.metadata, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAudit } from '@/composables/useAudit'
import { useAuthStore } from '@/stores/auth'

const { fetchAuditLogs, formatAuditLog, hasLogs, loading, error, pagination } = useAudit()
const authStore = useAuthStore()

const auditLogs = ref([])
const selectedLog = ref(null)
const filters = reactive({
  action: '',
  entity_type: '',
  search: '',
  page: 1,
  limit: 25,
})

let searchTimeout = null

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.page = 1
    fetchLogs()
  }, 500)
}

const fetchLogs = async () => {
  const params = { ...filters }
  // Remove empty filters
  Object.keys(params).forEach(key => {
    if (!params[key]) delete params[key]
  })

  const result = await fetchAuditLogs(params)
  if (result.success) {
    auditLogs.value = result.logs
  }
}

const clearFilters = () => {
  filters.action = ''
  filters.entity_type = ''
  filters.search = ''
  filters.page = 1
  fetchLogs()
}

const changePage = (page) => {
  filters.page = page
  fetchLogs()
}

const getActionBadgeClass = (action) => {
  const classes = {
    create: 'bg-green-100 text-green-800',
    update: 'bg-blue-100 text-blue-800',
    delete: 'bg-red-100 text-red-800',
    view: 'bg-gray-100 text-gray-800',
    login: 'bg-indigo-100 text-indigo-800',
    logout: 'bg-indigo-100 text-indigo-800',
    export: 'bg-purple-100 text-purple-800',
  }
  return classes[action] || 'bg-gray-100 text-gray-800'
}

const getUserDisplayName = (userId) => {
  // In a real app, you might want to cache user names or fetch them
  // For now, just return the ID
  return userId
}

const showLogDetails = (log) => {
  selectedLog.value = log
}

const closeLogDetails = () => {
  selectedLog.value = null
}

onMounted(() => {
  fetchLogs()
})
</script>