<template>
  <div class="animate-fade-in-up">
    <div class="table-shell mb-6 overflow-hidden">
      <div class="panel-header flex flex-col gap-4 bg-gradient-to-r from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Utilisateurs</h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Gestion des comptes et des rôles</p>
        </div>
        <!-- <button type="button" class="btn-primary shrink-0">
          <svg class="svg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter
        </button> -->
      </div>

      <div class="border-b border-slate-200/80 px-4 py-4 dark:border-slate-700 sm:px-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div class="relative w-full sm:flex-1">
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
          <div class="flex items-center gap-3">
            <select v-model="roleFilter" class="input-field flex-1 !py-2.5 sm:max-w-[160px]">
              <option value="">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="recruiter">Recruteur</option>
              <option value="candidate">Candidat</option>
            </select>
            <select v-model="statusFilter" class="input-field flex-1 !py-2.5 sm:max-w-[160px]">
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="table-shell overflow-hidden">
      <!-- Desktop/Tablet Table View -->
      <div class="hidden overflow-x-auto md:block">
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
              v-for="user in users"
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
                <select
                  :value="user.role"
                  @change="updateUserRole(user, $event.target.value)"
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border-0 bg-transparent cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  :class="getRoleClass(user.role)"
                  :disabled="updatingUser === user.id"
                >
                  <option value="admin" :class="getRoleClass('admin')">Admin</option>
                  <option value="recruiter" :class="getRoleClass('recruiter')">Recruteur</option>
                  <option value="candidate" :class="getRoleClass('candidate')">Candidat</option>
                </select>
                <div v-if="updatingUser === user.id" class="inline-flex items-center ml-2">
                  <svg class="animate-spin h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
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
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-brand-300"
                    @click="viewUserDetails(user)"
                    aria-label="Voir détails"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800 dark:border-slate-700 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950/50 dark:hover:text-rose-300"
                    @click="handleDeleteUser(user)"
                    aria-label="Supprimer utilisateur"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
        <div
          v-for="user in users"
          :key="user.id"
          class="p-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
        >
          <div class="flex items-center justify-between gap-4">
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
                <div class="truncate text-xs text-slate-500 dark:text-slate-400">{{ user.email }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                @click="viewUserDetails(user)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-rose-600 dark:border-slate-700 dark:bg-slate-900 dark:text-rose-400"
                @click="handleDeleteUser(user)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                :class="getRoleClass(user.role)"
              >
                {{ user.role }}
              </span>
              <span
                class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                :class="
                  user.is_active
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                "
              >
                {{ user.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </div>
            <div class="text-[10px] text-slate-500 dark:text-slate-400">
              Vu: {{ formatDate(user.last_login_at) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="border-t border-slate-200/80 px-4 py-4 dark:border-slate-700 sm:px-6">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div class="text-sm text-slate-500 dark:text-slate-400">
            Affichage de <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span> à 
            <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> sur 
            <span class="font-medium">{{ pagination.total }}</span> utilisateurs
          </div>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <button
              :disabled="pagination.page === 1 || loading"
              class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              @click="goToPage(pagination.page - 1)"
            >
              Précédent
            </button>
            <div class="hidden items-center gap-1 sm:flex">
              <button
                v-for="page in pagination.pages"
                :key="page"
                :class="[
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  page === pagination.page
                    ? 'bg-brand-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                ]"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </div>
            <!-- Mobile current page indicator -->
            <div class="flex items-center px-2 text-sm font-medium text-slate-700 dark:text-slate-300 sm:hidden">
              Page {{ pagination.page }} sur {{ pagination.pages }}
            </div>
            <button
              :disabled="pagination.page === pagination.pages || loading"
              class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              @click="goToPage(pagination.page + 1)"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <div
      v-if="showDetailsModal && selectedUser"
      class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 p-2 backdrop-blur-sm transition-all duration-300 sm:p-4"
      @click.self="closeDetailsModal"
    >
      <div class="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
        <!-- Simple Header -->
        <div class="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">Détails de l'utilisateur</h2>
          <button
            type="button"
            class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
            @click="closeDetailsModal"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <!-- Basic Info -->
          <div class="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div class="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-bold text-white shadow-lg sm:h-20 sm:w-20">
              {{ selectedUser.first_name?.[0] }}{{ selectedUser.last_name?.[0] }}
              <div v-if="selectedUser.is_active" class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900"></div>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white truncate">
                {{ selectedUser.first_name }} {{ selectedUser.last_name }}
              </h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 truncate">{{ selectedUser.email }}</p>
              <div class="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize" :class="getRoleClass(selectedUser.role)">
                  {{ selectedUser.role }}
                </span>
                <span 
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="selectedUser.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'"
                >
                  {{ selectedUser.is_active ? 'Actif' : 'Inactif' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">ID Unique</label>
              <p class="mt-1 text-xs text-slate-900 dark:text-white font-mono break-all">{{ selectedUser.id }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Téléphone</label>
              <p class="mt-1 text-sm text-slate-900 dark:text-white">{{ selectedUser.phone || 'Non renseigné' }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email vérifié</label>
              <p class="mt-1 text-sm text-slate-900 dark:text-white">{{ selectedUser.email_verified ? 'Oui' : 'Non' }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">2FA Activé</label>
              <p class="mt-1 text-sm text-slate-900 dark:text-white">{{ selectedUser.two_factor_enabled ? 'Oui' : 'Non' }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Création</label>
              <p class="mt-1 text-sm text-slate-900 dark:text-white">{{ formatDate(selectedUser.created_at) }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dernière MAJ</label>
              <p class="mt-1 text-sm text-slate-900 dark:text-white">{{ formatDate(selectedUser.updated_at) }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dernière connexion</label>
              <p class="mt-1 text-sm text-slate-900 dark:text-white">{{ formatDate(selectedUser.last_login_at) }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">IP de connexion</label>
              <p class="mt-1 text-sm text-slate-900 dark:text-white font-mono">{{ selectedUser.last_login_ip || 'N/A' }}</p>
            </div>
          </div>

          <!-- Preferences -->
          <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Préférences</label>
            <div class="mt-3 flex flex-wrap gap-2">
              <template v-if="selectedUser.preferences && Object.keys(selectedUser.preferences).length > 0">
                <div 
                  v-for="(value, key) in selectedUser.preferences" 
                  :key="key"
                  class="flex items-center gap-2 rounded-lg bg-white dark:bg-slate-800 px-3 py-1.5 text-xs border border-slate-100 dark:border-slate-700 shadow-sm"
                >
                  <span class="font-semibold text-slate-500">{{ key }}:</span>
                  <span class="ml-1 text-slate-900 dark:text-white">{{ value }}</span>
                </div>
              </template>
              <p v-else class="text-sm text-slate-400 italic">Aucune préférence définie</p>
            </div>
          </div>

          <!-- Avatar URL if exists -->
          <div v-if="selectedUser.avatar_url" class="rounded-xl border border-slate-200 p-4 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">URL Avatar</label>
            <p class="mt-1 text-xs text-slate-900 dark:text-white break-all">{{ selectedUser.avatar_url }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900 flex justify-end">
          <button
            type="button"
            class="w-full sm:w-auto rounded-xl bg-slate-100 px-6 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            @click="closeDetailsModal"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useUI } from '@/composables/useUI'
import { formatDate } from '@/utils'

const userStore = useUserStore()
const { loading } = storeToRefs(userStore)
const ui = useUI()

const users = ref([])
const pagination = ref({ page: 1, limit: 10, total: 0, pages: 1 })
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

const selectedUser = ref(null)
const showDetailsModal = ref(false)
const userDetailsLoading = ref(false)
const updatingUser = ref(null)

const getRoleClass = (role) => {
  const classes = {
    admin: 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300',
    recruiter: 'bg-brand-100 text-brand-800 dark:bg-brand-950/50 dark:text-brand-300',
    candidate: 'bg-accent-100 text-accent-800 dark:bg-accent-950/50 dark:text-accent-300',
  }
  return classes[role] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
}

const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.pages) {
    pagination.value.page = page
    loadUsers()
  }
}

const viewUserDetails = async (user) => {
  selectedUser.value = user
  showDetailsModal.value = true
  userDetailsLoading.value = true
  
  // Fetch full user details including preferences
  const result = await userStore.fetchUserById(user.id)
  if (result.success) {
    selectedUser.value = result.user
  }
  userDetailsLoading.value = false
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedUser.value = null
}

const updateUserRole = async (user, newRole) => {
  if (user.role === newRole) return

  updatingUser.value = user.id
  try {
    const result = await userStore.updateUser(user.id, { role: newRole })
    if (result.success) {
      // Update the user in the local array
      const userIndex = users.value.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        users.value[userIndex] = { ...users.value[userIndex], role: newRole }
      }
      ui.showSuccess('Rôle mis à jour', `Le rôle de ${user.first_name} ${user.last_name} a été changé en ${newRole}.`)
    } else {
      ui.showError('Erreur', result.error || 'Impossible de mettre à jour le rôle.')
    }
  } catch (error) {
    console.error('Update role error:', error)
    ui.showError('Erreur', 'Une erreur est survenue lors de la mise à jour du rôle.')
  } finally {
    updatingUser.value = null
  }
}

const handleDeleteUser = async (user) => {
  try {
    const confirmed = await ui.confirmDelete(`user ${user.first_name} ${user.last_name}`)
    if (confirmed) {
      ui.setConfirmLoading(true)
      const result = await userStore.deactivateUser(user.id)
      if (result.success) {
        ui.showSuccess('User Deleted', `${user.first_name} ${user.last_name} has been successfully deleted.`)
        await loadUsers()
      } else {
        ui.showError('Delete Failed', result.error)
      }
    }
  } catch (error) {
    console.error('Delete user error:', error)
    ui.showError('Delete Failed', 'An error occurred while deleting the user.')
  } finally {
    ui.setConfirmLoading(false)
  }
}

const loadUsers = async () => {
  const params = {
    page: pagination.value.page,
    limit: pagination.value.limit,
    search: searchQuery.value,
    role: roleFilter.value
  }
  // Only send is_active filter if a value is selected
  if (statusFilter.value) {
    params.is_active = statusFilter.value === 'active'
  }
  const result = await userStore.fetchUsers(params)
  if (result.success) {
    users.value = result.users || result.data?.users || []
    const paginationData = result.pagination || result.data?.pagination
    if (paginationData) {
      pagination.value = {
        page: paginationData.page,
        limit: paginationData.limit,
        total: paginationData.total,
        pages: paginationData.pages
      }
    }
  }
}

// Watch for filter changes to reload data
let debounceTimer
watch([searchQuery, roleFilter, statusFilter], () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    pagination.value.page = 1
    loadUsers()
  }, 300)
})

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.spec-card {
  @apply rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40 shadow-sm;
}

.spec-label {
  @apply text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1;
}

.spec-value {
  @apply text-sm font-bold text-slate-900 dark:text-white;
}

.timestamp-box {
  @apply p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800;
}

.timestamp-label {
  @apply text-[10px] font-bold text-slate-400 uppercase tracking-tight block mb-1;
}

.timestamp-value {
  @apply text-xs font-black text-slate-700 dark:text-slate-300;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 rounded-full dark:bg-slate-800;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-300 dark:bg-slate-700;
}
</style>
