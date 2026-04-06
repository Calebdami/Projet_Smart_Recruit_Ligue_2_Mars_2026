<template>
  <div class="audit-trail space-y-6">
    <!-- Header & Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Journal d'audit</h2>
        <p class="text-sm text-gray-500">Historique complet des actions effectuées sur la plateforme.</p>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          @click="handleExport('csv')" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="loading"
        >
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exporter (CSV)
        </button>
        <button 
          @click="refreshLogs" 
          class="p-2 border border-gray-300 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-colors"
          :class="{ 'animate-spin': loading }"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Utilisateur</label>
        <input 
          v-model="filters.user_id" 
          type="text" 
          placeholder="ID ou Email..."
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Action</label>
        <select 
          v-model="filters.action" 
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Toutes les actions</option>
          <option value="create">Création</option>
          <option value="update">Mise à jour</option>
          <option value="delete">Suppression</option>
          <option value="login">Connexion</option>
          <option value="logout">Déconnexion</option>
          <option value="export">Exportation</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Entité</label>
        <select 
          v-model="filters.entity_type" 
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Toutes les ressources</option>
          <option value="user">Utilisateurs</option>
          <option value="candidate">Candidats</option>
          <option value="job">Offres d'emploi</option>
          <option value="application">Candidatures</option>
          <option value="webinar">Webinaires</option>
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
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Heure</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ressource</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-if="loading && logs.length === 0">
              <tr v-for="i in 5" :key="i" class="animate-pulse">
                <td v-for="j in 6" :key="j" class="px-6 py-4 whitespace-nowrap">
                  <div class="h-4 bg-gray-200 rounded w-full"></div>
                </td>
              </tr>
            </template>
            <template v-else-if="logs.length > 0">
              <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(log.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium text-xs">
                      {{ log.user_name ? log.user_name.charAt(0) : 'U' }}
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ log.user_name || 'Inconnu' }}</div>
                      <div class="text-xs text-gray-500">{{ log.user_email || 'Pas d\'email' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getActionClass(log.action)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize">
                    {{ translateAction(log.action) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex flex-col">
                    <span class="font-medium text-gray-700">{{ translateEntity(log.entity_type) }}</span>
                    <span class="text-xs font-mono text-gray-400">{{ log.entity_id }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {{ log.ip_address || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="viewDetails(log)" class="text-indigo-600 hover:text-indigo-900">Voir</button>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="6" class="px-6 py-12 text-center text-gray-500 italic">
                Aucun log d'audit trouvé pour les filtres sélectionnés.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="logs.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Précédent</button>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Suivant</button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Affichage de <span class="font-medium">{{ startIndex + 1 }}</span> à <span class="font-medium">{{ endIndex }}</span> sur <span class="font-medium">{{ totalLogs }}</span> résultats
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                <span class="sr-only">Précédent</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button 
                v-for="page in displayedPages" 
                :key="page" 
                @click="goToPage(page)"
                :class="[currentPage === page ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50', 'relative inline-flex items-center px-4 py-2 border text-sm font-medium']"
              >
                {{ page }}
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                <span class="sr-only">Suivant</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <BaseModal v-if="selectedLog" :show="!!selectedLog" @close="selectedLog = null" title="Détails de l'action">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="text-gray-500 font-medium uppercase tracking-wider text-xs">ID de l'action</div>
          <div class="text-gray-900 font-mono">{{ selectedLog.id }}</div>
          
          <div class="text-gray-500 font-medium uppercase tracking-wider text-xs">Agent Utilisateur</div>
          <div class="text-gray-900 break-words">{{ selectedLog.user_agent || '-' }}</div>
          
          <div class="text-gray-500 font-medium uppercase tracking-wider text-xs">Métadonnées</div>
          <div class="text-gray-900 bg-gray-50 p-2 rounded border font-mono text-xs overflow-auto max-h-48">
            <pre>{{ JSON.stringify(selectedLog.metadata, null, 2) }}</pre>
          </div>

          <div v-if="selectedLog.old_values" class="text-gray-500 font-medium uppercase tracking-wider text-xs col-span-2 mt-2">Anciennes Valeurs</div>
          <div v-if="selectedLog.old_values" class="text-gray-900 bg-red-50 p-2 rounded border border-red-100 font-mono text-xs overflow-auto max-h-48 col-span-2">
            <pre>{{ selectedLog.old_values }}</pre>
          </div>

          <div v-if="selectedLog.new_values" class="text-gray-500 font-medium uppercase tracking-wider text-xs col-span-2 mt-2">Nouvelles Valeurs</div>
          <div v-if="selectedLog.new_values" class="text-gray-900 bg-green-50 p-2 rounded border border-green-100 font-mono text-xs overflow-auto max-h-48 col-span-2">
            <pre>{{ selectedLog.new_values }}</pre>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuditStore } from '@/stores/audit'
import { useNotifications } from '@/composables/useNotifications'
import { formatDate } from '@/utils'
import BaseModal from '@/components/common/BaseModal.vue'

const auditStore = useAuditStore()
const { showNotification } = useNotifications()

const filters = reactive({
  user_id: '',
  action: '',
  entity_type: ''
})

const selectedLog = ref(null)

// Computed properties from store
const logs = computed(() => auditStore.logs)
const loading = computed(() => auditStore.loading)
const totalLogs = computed(() => auditStore.totalLogs)
const currentPage = computed(() => auditStore.pagination.page)
const totalPages = computed(() => auditStore.pagination.totalPages)
const startIndex = computed(() => (currentPage.value - 1) * auditStore.pagination.limit)
const endIndex = computed(() => Math.min(startIndex.value + logs.value.length, totalLogs.value))

// Load data
const loadLogs = async () => {
  const result = await auditStore.fetchLogs({ ...filters })
  if (!result.success) {
    showNotification(result.error, 'error')
  }
}

const refreshLogs = () => {
  loadLogs()
}

onMounted(() => {
  loadLogs()
})

// Watch filters
watch(filters, () => {
  auditStore.setPage(1)
  loadLogs()
}, { deep: true })

// Helper functions
const getActionClass = (action) => {
  switch (action) {
    case 'create': return 'bg-blue-100 text-blue-800'
    case 'update': return 'bg-yellow-100 text-yellow-800'
    case 'delete': return 'bg-red-100 text-red-800'
    case 'login': return 'bg-green-100 text-green-800'
    case 'logout': return 'bg-gray-100 text-gray-800'
    case 'export': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const translateAction = (action) => {
  const translations = {
    create: 'Création',
    update: 'Mise à jour',
    delete: 'Suppression',
    login: 'Connexion',
    logout: 'Déconnexion',
    export: 'Exportation',
    email_verified: 'Email vérifié',
    '2fa_enabled': '2FA activé',
    '2fa_disabled': '2FA désactivé'
  }
  return translations[action] || action
}

const translateEntity = (entity) => {
  const translations = {
    user: 'Utilisateur',
    candidate: 'Candidat',
    job: 'Offre',
    application: 'Candidature',
    webinar: 'Webinaire'
  }
  return translations[entity] || entity
}

const viewDetails = (log) => {
  selectedLog.value = log
}

const handleExport = async (format) => {
  try {
    showNotification('Exportation en cours...', 'info')
    // Implémentation réelle de l'export via le service
    await auditStore.fetchLogs({ ...filters, export: format })
    showNotification('Exportation réussie.', 'success')
  } catch (error) {
    showNotification('L\'exportation a échoué.', 'error')
  }
}

// Pagination methods
const goToPage = (page) => {
  auditStore.setPage(page)
  loadLogs()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const resetFilters = () => {
  filters.user_id = ''
  filters.action = ''
  filters.entity_type = ''
}

const displayedPages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>

<style scoped>
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>
