<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Assignation des Candidats</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400">Assignez les candidats aux recruteurs via drag & drop.</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn-secondary text-sm" :disabled="loading" @click="loadData">
          <svg class="mr-1 inline h-4 w-4" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Rafraîchir
        </button>
        <button
          v-if="selectedCandidates.length > 0"
          class="btn-primary text-sm"
          :disabled="bulkAssigning"
          @click="showBulkAssignModal = true"
        >
          <svg v-if="bulkAssigning" class="mr-1 inline h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Assigner {{ selectedCandidates.length }} candidat(s)
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-black">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <input v-model="filters.search" type="text" placeholder="Nom, Email..." class="input-field" @input="debouncedSearch">
        <select v-model="filters.job_id" class="input-field" @change="loadData">
          <option value="">Toutes les offres</option>
          <option v-for="job in jobs" :key="job.id" :value="job.id">{{ job.title }}</option>
        </select>
        <select v-model="filters.status" class="input-field" @change="loadData">
          <option value="">Tous les statuts</option>
          <option value="new">Nouveau</option>
          <option value="reviewing">En évaluation</option>
          <option value="interview">Entretien</option>
          <option value="offer">Offre</option>
        </select>
        <select v-model="filters.smart_score_min" class="input-field" @change="loadData">
          <option value="">SmartScore minimum</option>
          <option value="90">90+ (Excellent)</option>
          <option value="80">80+ (Très bon)</option>
          <option value="70">70+ (Bon)</option>
          <option value="60">60+ (Moyen)</option>
        </select>
      </div>
    </div>

    <!-- Stats -->
    <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="rounded-xl bg-white border border-slate-200 p-4 dark:bg-black dark:border-slate-700">
        <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ unassignedCandidates.length }}</p>
        <p class="text-sm text-slate-500">Non assignés</p>
      </div>
      <div class="rounded-xl bg-white border border-slate-200 p-4 dark:bg-black dark:border-slate-700">
        <p class="text-2xl font-bold text-brand-600 dark:text-brand-400">{{ selectedCandidates.length }}</p>
        <p class="text-sm text-slate-500">Sélectionnés</p>
      </div>
      <div class="rounded-xl bg-white border border-slate-200 p-4 dark:bg-black dark:border-slate-700">
        <p class="text-2xl font-bold text-violet-600 dark:text-violet-400">{{ recruiters.length }}</p>
        <p class="text-sm text-slate-500">Recruteurs actifs</p>
      </div>
      <div class="rounded-xl bg-white border border-slate-200 p-4 dark:bg-black dark:border-slate-700">
        <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ totalAssigned }}</p>
        <p class="text-sm text-slate-500">Total assignés</p>
      </div>
    </div>

    <!-- Drag & Drop Interface -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <!-- Unassigned Candidates -->
      <div class="lg:col-span-2">
        <div class="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-black">
          <div class="border-b border-slate-200 p-4 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Candidats non assignés</h3>
              <button
                v-if="selectedCandidates.length > 0"
                @click="clearSelection"
                class="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Désélectionner tout
              </button>
            </div>
          </div>
          <div class="p-4">
            <div
              v-if="filteredUnassignedCandidates.length === 0"
              class="py-8 text-center text-slate-500"
            >
              Aucun candidat non assigné trouvé.
            </div>
            <div
              v-else
              class="space-y-3 max-h-96 overflow-y-auto"
              @dragover.prevent
              @drop.prevent="onDropToUnassigned"
            >
              <div
                v-for="candidate in filteredUnassignedCandidates"
                :key="candidate.id"
                class="candidate-card"
                :class="{ 'selected': selectedCandidates.includes(candidate.id) }"
                draggable="true"
                @dragstart="onDragStart($event, candidate)"
                @click="toggleCandidateSelection(candidate.id)"
              >
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    :checked="selectedCandidates.includes(candidate.id)"
                    @change="toggleCandidateSelection(candidate.id)"
                    class="rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600"
                  >
                  <div class="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white text-xs font-medium">
                    {{ candidate.first_name?.[0] }}{{ candidate.last_name?.[0] }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {{ candidate.first_name }} {{ candidate.last_name }}
                    </p>
                    <p class="text-xs text-slate-500 truncate">{{ candidate.email }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <div class="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700">
                        <div class="h-1.5 rounded-full bg-brand-500" :style="`width: ${candidate.smart_score || 0}%`"></div>
                      </div>
                      <span class="text-xs font-medium" :class="getScoreClass(candidate.smart_score)">
                        {{ candidate.smart_score || 'N/A' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recruiters -->
      <div class="lg:col-span-2">
        <div class="space-y-4 max-h-[600px] overflow-y-auto">
          <div
            v-for="recruiter in recruiters"
            :key="recruiter.id"
            class="recruiter-drop-zone"
            @dragover.prevent
            @drop.prevent="onDropToRecruiter($event, recruiter.id)"
          >
            <div class="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-black">
              <div class="border-b border-slate-200 p-4 dark:border-slate-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      {{ recruiter.first_name?.[0] }}{{ recruiter.last_name?.[0] }}
                    </div>
                    <div>
                      <h4 class="font-medium text-slate-900 dark:text-white">
                        {{ recruiter.first_name }} {{ recruiter.last_name }}
                      </h4>
                      <p class="text-sm text-slate-500">{{ assignedCandidates[recruiter.id]?.length || 0 }} candidat(s)</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-slate-900 dark:text-white">{{ recruiter.email }}</p>
                    <p class="text-xs text-slate-500">{{ recruiter.role }}</p>
                  </div>
                </div>
              </div>
              <div class="p-4">
                <div
                  v-if="!assignedCandidates[recruiter.id] || assignedCandidates[recruiter.id].length === 0"
                  class="py-6 text-center text-slate-400"
                >
                  <svg class="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p class="mt-2 text-sm">Déposez les candidats ici</p>
                </div>
                <div v-else class="space-y-2">
                  <div
                    v-for="candidate in assignedCandidates[recruiter.id]"
                    :key="candidate.id"
                    class="assigned-candidate-card"
                    draggable="true"
                    @dragstart="onDragStart($event, candidate)"
                  >
                    <div class="flex items-center gap-2">
                      <div class="h-6 w-6 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white text-xs font-medium">
                        {{ candidate.first_name?.[0] }}{{ candidate.last_name?.[0] }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-slate-900 dark:text-white truncate">
                          {{ candidate.first_name }} {{ candidate.last_name }}
                        </p>
                        <div class="flex items-center gap-1">
                          <div class="h-1 w-8 rounded-full bg-slate-200 dark:bg-slate-700">
                            <div class="h-1 rounded-full bg-brand-500" :style="`width: ${candidate.smart_score || 0}%`"></div>
                          </div>
                          <span class="text-xs" :class="getScoreClass(candidate.smart_score)">
                            {{ candidate.smart_score || 'N/A' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Assign Modal -->
    <div
      v-if="showBulkAssignModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click="showBulkAssignModal = false"
    >
      <div class="mx-4 w-full max-w-md rounded-2xl bg-white p-6 dark:bg-black" @click.stop>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Assigner {{ selectedCandidates.length }} candidat(s)
        </h3>
        <div class="space-y-3">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Sélectionner un recruteur
          </label>
          <select
            v-model="bulkRecruiterId"
            class="input-field"
          >
            <option value="">Choisir un recruteur...</option>
            <option v-for="recruiter in recruiters" :key="recruiter.id" :value="recruiter.id">
              {{ recruiter.first_name }} {{ recruiter.last_name }} ({{ assignedCandidates[recruiter.id]?.length || 0 }} candidat(s))
            </option>
          </select>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="showBulkAssignModal = false"
            class="btn-secondary"
          >
            Annuler
          </button>
          <button
            @click="bulkAssignCandidates"
            :disabled="!bulkRecruiterId || bulkAssigning"
            class="btn-primary"
          >
            <svg v-if="bulkAssigning" class="mr-2 inline h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Assigner
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useApplicationsStore } from '@/stores/applications'
import { useUserStore } from '@/stores/user'
import { useJobsStore } from '@/stores/jobs'
import { useUI } from '@/composables/useUI'
import { useDebounce } from '@/composables/useDebounce'

const { toast } = useUI()

// Stores
const applicationsStore = useApplicationsStore()
const userStore = useUserStore()
const jobsStore = useJobsStore()

// State
const loading = ref(false)
const bulkAssigning = ref(false)
const showBulkAssignModal = ref(false)
const bulkRecruiterId = ref('')
const draggedCandidate = ref(null)
const selectedCandidates = ref([])
const assignedCandidates = ref({})

// Filters
const filters = ref({
  search: '',
  job_id: '',
  status: '',
  smart_score_min: ''
})

// Methods
const loadData = async () => {
  loading.value = true
  try {
    await Promise.all([
      applicationsStore.fetchApplications(),
      userStore.fetchUsers({ role: 'recruiter' }),
      jobsStore.fetchJobs()
    ])
    organizeAssignedCandidates()
  } catch (error) {
    toast.error('Erreur lors du chargement des données')
  } finally {
    loading.value = false
  }
}

const { debouncedFunction: debouncedSearch } = useDebounce(loadData)

// Computed
const candidates = computed(() => applicationsStore.allApplications)
const recruiters = computed(() => userStore.users.filter(u => u.role === 'recruiter'))
const jobs = computed(() => jobsStore.allJobs)

const unassignedCandidates = computed(() =>
  candidates.value.filter(c => !c.recruiter_id)
)

const filteredUnassignedCandidates = computed(() => {
  let filtered = unassignedCandidates.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(c =>
      `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(search)
    )
  }

  if (filters.value.job_id) {
    filtered = filtered.filter(c => c.job_id === filters.value.job_id)
  }

  if (filters.value.status) {
    filtered = filtered.filter(c => c.status === filters.value.status)
  }

  if (filters.value.smart_score_min) {
    filtered = filtered.filter(c => (c.smart_score || 0) >= parseInt(filters.value.smart_score_min))
  }

  return filtered
})

const totalAssigned = computed(() => {
  return Object.values(assignedCandidates.value).reduce((total, candidates) => total + candidates.length, 0)
})

const organizeAssignedCandidates = () => {
  assignedCandidates.value = {}
  candidates.value.forEach(candidate => {
    if (candidate.recruiter_id) {
      if (!assignedCandidates.value[candidate.recruiter_id]) {
        assignedCandidates.value[candidate.recruiter_id] = []
      }
      assignedCandidates.value[candidate.recruiter_id].push(candidate)
    }
  })
}

const onDragStart = (event, candidate) => {
  draggedCandidate.value = candidate
  event.dataTransfer.effectAllowed = 'move'
}

const onDropToRecruiter = async (event, recruiterId) => {
  if (!draggedCandidate.value) return

  try {
    const result = await applicationsStore.assignRecruiter(draggedCandidate.value.id, recruiterId)
    if (!result || !result.success) {
      toast.error(result?.error || 'Erreur lors de l\'assignation')
      return
    }
    toast.success(`Candidat assigné avec succès`)
    await loadData()
  } catch (error) {
    let msg = 'Erreur lors de l\'assignation';
    if (error && typeof error === 'object') {
      msg = error.message || msg;
    }
    toast.error(msg)
  } finally {
    draggedCandidate.value = null
  }
}

const unassignCandidate = async (candidateId) => {
    try {
        // On appelle le store et on attend le résultat
        const result = await applicationsStore.assignRecruiter(candidateId, null);

        // PROTECTION : Si result est undefined (Store buggé), on ne crash pas
        if (result?.success) {
            toast.success('Candidat désassigné');
            
            // Mise à jour locale immédiate pour éviter l'actualisation page
            const app = applicationsStore.applications.find(a => a.id === candidateId);
            if (app) app.recruiter_id = null;
            
            organizeAssignedCandidates();
        } else {
            // Si le store a renvoyé success: false
            toast.error(result?.error || 'Échec de la désassignation');
        }
    } catch (error) {
        console.error('Erreur attrapée dans unassignCandidate :', error);
        
        // PROTECTION : On récupère le message sans JAMAIS lire une propriété sur undefined
        const message = error?.response?.data?.error 
                     || error?.message 
                     || 'Une erreur inattendue est survenue';
                     
        toast.error(message);
    }
};

const onDropToUnassigned = async (event) => {
    if (!draggedCandidate.value) return;
    
    const idToUnassign = draggedCandidate.value.id;
    draggedCandidate.value = null; // On nettoie avant l'appel pour l'UI
    
    await unassignCandidate(idToUnassign);
};

const toggleCandidateSelection = (candidateId) => {
  const index = selectedCandidates.value.indexOf(candidateId)
  if (index > -1) {
    selectedCandidates.value.splice(index, 1)
  } else {
    selectedCandidates.value.push(candidateId)
  }
}

const clearSelection = () => {
  selectedCandidates.value = []
}

const bulkAssignCandidates = async () => {
  if (!bulkRecruiterId.value || selectedCandidates.value.length === 0) return

  bulkAssigning.value = true
  try {
    const result = await applicationsStore.bulkAssignRecruiter(selectedCandidates.value, bulkRecruiterId.value)
    
    // Protection contre result undefined
    if (!result?.success) {
      toast.error(result?.error || 'Erreur lors de l\'assignation en masse')
      return
    }

    toast.success(`${selectedCandidates.value.length} candidat(s) assigné(s) avec succès`)
    // Réinitialiser la sélection pour faire disparaître le bouton
    selectedCandidates.value = []
    showBulkAssignModal.value = false
    bulkRecruiterId.value = ''
    // Recharger les données pour une UI réactive
    await loadData()
  } catch (error) {
    toast.error(error?.message || 'Erreur lors de l\'assignation en masse')
  } finally {
    bulkAssigning.value = false
  }
}

const getScoreClass = (score) => {
  if (!score) return 'text-slate-400'
  if (score >= 90) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 80) return 'text-blue-600 dark:text-blue-400'
  if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

// Watchers
watch(() => candidates.value, organizeAssignedCandidates, { immediate: true })

// Lifecycle
onMounted(loadData)
</script>

<style scoped>
.candidate-card {
  @apply p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer transition-all hover:bg-slate-100 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:border-slate-500;
}

.candidate-card.selected {
  @apply bg-brand-50 border-brand-300 dark:bg-brand-900/20 dark:border-brand-600;
}

.recruiter-drop-zone {
  @apply transition-all;
}

.recruiter-drop-zone:hover {
  @apply transform scale-[1.02];
}

.assigned-candidate-card {
  @apply p-2 rounded-md bg-slate-100 border border-slate-200 cursor-move transition-all hover:bg-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600;
}
</style>