<template>
  <div class="user-management space-y-6">
    <!-- Header & Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
        <p class="text-sm text-gray-500">Administrez les comptes, gérez les rôles et le statut des utilisateurs.</p>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          @click="refreshUsers" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="loading"
        >
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Rafraîchir
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Recherche</label>
        <input 
          v-model="filters.search" 
          type="text" 
          placeholder="Nom, Email..."
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          @input="debouncedSearch"
        />
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Rôle</label>
        <select 
          v-model="filters.role" 
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          @change="loadUsers"
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Administrateur</option>
          <option value="recruiter">Recruteur</option>
          <option value="candidate">Candidat</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Statut</label>
        <select 
          v-model="filters.is_active" 
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          @change="loadUsers"
        >
          <option value="">Tous les statuts</option>
          <option value="true">Actif</option>
          <option value="false">Inactif</option>
        </select>
      </div>
      <div class="flex items-end">
        <button 
          @click="resetFilters" 
          class="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière Connexion</th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-if="loading && users.length === 0">
              <tr v-for="i in 5" :key="i" class="animate-pulse">
                <td v-for="j in 5" :key="j" class="px-6 py-4 whitespace-nowrap">
                  <div class="h-4 bg-gray-200 rounded w-full"></div>
                </td>
              </tr>
            </template>
            <template v-else-if="users.length > 0">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img v-if="user.avatar_url" class="h-10 w-10 rounded-full" :src="user.avatar_url" alt="" />
                      <div v-else class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                        {{ user.first_name.charAt(0) }}{{ user.last_name.charAt(0) }}
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span :class="getRoleClass(user.role)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ user.is_active ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.last_login_at ? formatDate(user.last_login_at, 'long') : 'Jamais' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900">Modifier</button>
                    <button 
                      @click="toggleUserStatus(user)" 
                      :class="user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                    >
                      {{ user.is_active ? 'Désactiver' : 'Réactiver' }}
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="5" class="px-6 py-12 text-center text-gray-500 italic">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination (Simplifiée pour l'instant) -->
      <div v-if="users.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Précédent</button>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Suivant</button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Affichage de <span class="font-medium">1</span> à <span class="font-medium">{{ users.length }}</span> sur <span class="font-medium">{{ users.length }}</span> résultats
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <BaseModal v-if="selectedUser" :show="!!selectedUser" @close="selectedUser = null" title="Modifier l'utilisateur">
      <form @submit.prevent="handleUpdateUser" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nom complet</label>
          <div class="mt-1 text-sm text-gray-900 font-semibold">{{ selectedUser.first_name }} {{ selectedUser.last_name }}</div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <div class="mt-1 text-sm text-gray-900">{{ selectedUser.email }}</div>
        </div>

        <div>
          <label for="edit_role" class="block text-sm font-medium text-gray-700">Rôle</label>
          <select 
            id="edit_role" 
            v-model="editForm.role" 
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="admin">Administrateur</option>
            <option value="recruiter">Recruteur</option>
            <option value="candidate">Candidat</option>
          </select>
        </div>

        <div class="flex items-center">
          <input 
            id="edit_is_active" 
            v-model="editForm.is_active" 
            type="checkbox" 
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="edit_is_active" class="ml-2 block text-sm text-gray-900">Compte actif</label>
        </div>

        <div class="pt-4 flex justify-end space-x-3">
          <button 
            type="button" 
            @click="selectedUser = null" 
            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            :disabled="updating"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ updating ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNotifications } from '@/composables/useNotifications'
import { formatDate } from '@/utils'
import BaseModal from '@/components/common/BaseModal.vue'
import { debounce } from '@/utils'

const userStore = useUserStore()
const { showNotification } = useNotifications()

const users = ref([])
const loading = ref(false)
const updating = ref(false)
const selectedUser = ref(null)

const filters = reactive({
  search: '',
  role: '',
  is_active: ''
})

const editForm = reactive({
  role: '',
  is_active: false
})

const loadUsers = async () => {
  loading.value = true
  const result = await userStore.fetchUsers(filters)
  if (result.success) {
    users.value = result.users
  } else {
    showNotification(result.error, 'error')
  }
  loading.value = false
}

const debouncedSearch = debounce(() => {
  loadUsers()
}, 300)

const refreshUsers = () => {
  loadUsers()
}

const resetFilters = () => {
  filters.search = ''
  filters.role = ''
  filters.is_active = ''
  loadUsers()
}

const editUser = (user) => {
  selectedUser.value = { ...user }
  editForm.role = user.role
  editForm.is_active = user.is_active
}

const handleUpdateUser = async () => {
  if (!selectedUser.value) return
  
  updating.value = true
  const result = await userStore.updateUser(selectedUser.value.id, editForm)
  
  if (result.success) {
    showNotification('Utilisateur mis à jour avec succès', 'success')
    selectedUser.value = null
    loadUsers()
  } else {
    showNotification(result.error, 'error')
  }
  updating.value = false
}

const toggleUserStatus = async (user) => {
  const action = user.is_active ? 'deactivate' : 'reactivate'
  const confirmMessage = user.is_active 
    ? `Êtes-vous sûr de vouloir désactiver l'utilisateur ${user.first_name} ${user.last_name} ?`
    : `Êtes-vous sûr de vouloir réactiver l'utilisateur ${user.first_name} ${user.last_name} ?`
  
  if (!confirm(confirmMessage)) return

  loading.value = true
  const result = user.is_active 
    ? await userStore.deactivateUser(user.id)
    : await userStore.reactivateUser(user.id)
  
  if (result.success) {
    showNotification(result.message, 'success')
    loadUsers()
  } else {
    showNotification(result.error, 'error')
  }
  loading.value = false
}

const getRoleClass = (role) => {
  switch (role) {
    case 'admin': return 'bg-purple-100 text-purple-800'
    case 'recruiter': return 'bg-blue-100 text-blue-800'
    case 'candidate': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
