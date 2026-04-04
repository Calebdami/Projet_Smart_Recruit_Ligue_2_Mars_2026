<template>
  <div class="mx-auto max-w-7xl animate-fade-in-up">
    <div class="table-shell mb-6 overflow-hidden">
      <div class="panel-header flex flex-col gap-4 bg-gradient-to-r from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Utilisateurs</h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Gestion des comptes et des rôles</p>
        </div>
        <button type="button" class="btn-primary shrink-0">
          <svg class="svg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter
        </button>
      </div>

      <div class="border-b border-slate-200/80 px-4 py-4 dark:border-slate-700 sm:px-6">
        <div class="flex flex-wrap gap-3">
          <div class="relative min-w-[200px] flex-1">
            <svg
              class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input v-model="searchQuery" type="search" placeholder="Rechercher…" class="input-field !py-2.5 pl-10">
          </div>
          <select v-model="roleFilter" class="input-field max-w-[160px] !py-2.5">
            <option value="">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="recruiter">Recruteur</option>
            <option value="candidate">Candidat</option>
          </select>
          <select v-model="statusFilter" class="input-field max-w-[160px] !py-2.5">
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-shell overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead class="bg-slate-50/90 dark:bg-slate-800/50">
            <tr>
              <th class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Utilisateur
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Rôle
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Statut
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Dernière connexion
              </th>
              <th class="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900/40">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
            >
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white"
                  >
                    {{ user.first_name?.charAt(0) }}{{ user.last_name?.charAt(0) }}
                  </div>
                  <div class="min-w-0">
                    <div class="truncate font-medium text-slate-900 dark:text-white">
                      {{ user.first_name }} {{ user.last_name }}
                    </div>
                    <div class="truncate text-sm text-slate-500 dark:text-slate-400">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                  :class="getRoleClass(user.role)"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                  :class="
                    user.is_active
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                  "
                >
                  {{ user.is_active ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                {{ formatDate(user.last_login_at) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <button
                  type="button"
                  class="mr-3 text-brand-600 transition-colors hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
                  @click="handleEditUser(user)"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  class="text-rose-600 transition-colors hover:text-rose-800 dark:text-rose-400"
                  @click="handleDeleteUser(user)"
                >
                  Supprimer
                </button>
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
import { useUI } from '@/composables/useUI'

const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const users = ref([])

const ui = useUI()

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = !searchQuery.value || 
      `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    const matchesStatus = !statusFilter.value || 
      (statusFilter.value === 'active' && user.is_active) ||
      (statusFilter.value === 'inactive' && !user.is_active)
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

const getRoleClass = (role) => {
  const classes = {
    admin: 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300',
    recruiter: 'bg-brand-100 text-brand-800 dark:bg-brand-950/50 dark:text-brand-300',
    candidate: 'bg-accent-100 text-accent-800 dark:bg-accent-950/50 dark:text-accent-300',
  }
  return classes[role] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString()
}

const handleEditUser = (user) => {
  ui.showInfo('Edit User', `Editing ${user.first_name} ${user.last_name} - Feature coming soon!`)
}

const handleDeleteUser = async (user) => {
  try {
    const confirmed = await ui.confirmDelete(`user ${user.first_name} ${user.last_name}`)
    if (confirmed) {
      ui.setConfirmLoading(true)
      // TODO: Implement API call to delete user
      console.log('Deleting user:', user)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remove from local state
      const index = users.value.findIndex(u => u.id === user.id)
      if (index > -1) {
        users.value.splice(index, 1)
      }
      
      ui.showSuccess('User Deleted', `${user.first_name} ${user.last_name} has been successfully deleted.`)
    }
  } catch (error) {
    console.error('Delete user error:', error)
    ui.showError('Delete Failed', 'An error occurred while deleting the user.')
  } finally {
    ui.setConfirmLoading(false)
  }
}

const loadUsers = async () => {
  // TODO: Implement API call
  users.value = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      role: 'admin',
      is_active: true,
      last_login_at: '2024-03-15T10:30:00Z'
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      role: 'recruiter',
      is_active: true,
      last_login_at: '2024-03-14T15:45:00Z'
    }
  ]
}

onMounted(() => {
  loadUsers()
})
</script>
