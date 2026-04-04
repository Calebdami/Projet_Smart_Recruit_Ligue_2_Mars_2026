<template>
  <div class="mx-auto max-w-7xl animate-fade-in-up">
    <div class="table-shell mb-6">
      <div class="panel-header bg-gradient-to-r from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-900">
        <div class="flex items-start gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-brand-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Journal d’audit</h1>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Historique des actions sur la plateforme</p>
          </div>
        </div>
      </div>

      <div class="border-b border-slate-200/80 px-4 py-4 dark:border-slate-700 sm:px-6">
        <div class="flex flex-wrap gap-3">
          <input v-model="searchQuery" type="search" placeholder="Rechercher…" class="input-field min-w-[200px] flex-1 !py-2.5">
          <select v-model="actionFilter" class="input-field max-w-[180px] !py-2.5">
            <option value="">Toutes les actions</option>
            <option value="login">Connexion</option>
            <option value="logout">Déconnexion</option>
            <option value="create">Création</option>
            <option value="update">Mise à jour</option>
            <option value="delete">Suppression</option>
          </select>
          <input v-model="dateFilter" type="date" class="input-field max-w-[180px] !py-2.5">
        </div>
      </div>
    </div>

    <div class="table-shell overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead class="bg-slate-50/90 dark:bg-slate-800/50">
            <tr>
              <th class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Horodatage
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Utilisateur
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Action
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Ressource
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                IP
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Détails
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900/40">
            <tr
              v-for="log in filteredLogs"
              :key="log.id"
              class="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                {{ formatDateTime(log.created_at) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white"
                  >
                    {{ log.user?.first_name?.charAt(0) }}{{ log.user?.last_name?.charAt(0) }}
                  </div>
                  <div class="min-w-0">
                    <div class="truncate text-sm font-medium text-slate-900 dark:text-white">
                      {{ log.user?.first_name }} {{ log.user?.last_name }}
                    </div>
                    <div class="truncate text-sm text-slate-500 dark:text-slate-400">{{ log.user?.email }}</div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                  :class="getActionClass(log.action)"
                >
                  {{ log.action }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-900 dark:text-slate-200">
                {{ log.entity_type || '—' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 font-mono text-sm text-slate-500 dark:text-slate-400">
                {{ log.ip_address }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                <div class="max-w-xs truncate" :title="log.details">
                  {{ log.details || '—' }}
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
    login: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    logout: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    create: 'bg-brand-100 text-brand-800 dark:bg-brand-950/50 dark:text-brand-300',
    update: 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300',
    delete: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
  }
  return classes[action] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
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
