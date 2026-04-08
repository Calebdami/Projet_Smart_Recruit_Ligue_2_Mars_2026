<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Candidats</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400">Tous les candidats ayant postulé à vos offres.</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn-secondary text-sm" :disabled="loading" @click="loadCandidates">
          <svg class="mr-1 inline h-4 w-4" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Rafraîchir
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-black">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <input v-model="filters.search" type="text" placeholder="Nom, Email..." class="input-field" @input="debouncedSearch">
        <select v-model="filters.job_id" class="input-field" @change="loadCandidates">
          <option value="">Toutes les offres</option>
          <option v-for="job in jobs" :key="job.id" :value="job.id">{{ job.title }}</option>
        </select>
        <select v-model="filters.status" class="input-field" @change="loadCandidates">
          <option value="">Tous les statuts</option>
          <option value="new">Nouveau</option>
          <option value="reviewing">En évaluation</option>
          <option value="interview">Entretien</option>
          <option value="offer">Offre</option>
          <option value="hired">Embauché</option>
          <option value="rejected">Refusé</option>
        </select>
        <select v-model="filters.smart_score_min" class="input-field" @change="loadCandidates">
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
        <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ stats.total }}</p>
        <p class="text-sm text-slate-500">Total candidats</p>
      </div>
      <div class="rounded-xl bg-white border border-slate-200 p-4 dark:bg-black dark:border-slate-700">
        <p class="text-2xl font-bold text-brand-600 dark:text-brand-400">{{ stats.new }}</p>
        <p class="text-sm text-slate-500">Nouveaux (7j)</p>
      </div>
      <div class="rounded-xl bg-white border border-slate-200 p-4 dark:bg-black dark:border-slate-700">
        <p class="text-2xl font-bold text-violet-600 dark:text-violet-400">{{ stats.in_process }}</p>
        <p class="text-sm text-slate-500">En processus</p>
      </div>
      <div class="rounded-xl bg-white border border-slate-200 p-4 dark:bg-black dark:border-slate-700">
        <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ stats.hired }}</p>
        <p class="text-sm text-slate-500">Embauchés</p>
      </div>
    </div>

    <!-- Candidates Table -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-black">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead class="bg-slate-50 dark:bg-slate-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Candidat</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Dernière candidature</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">SmartScore</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Statut</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Date</th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          <tr v-for="candidate in candidates" :key="candidate.id" class="hover:bg-slate-50 dark:hover:bg-slate-900">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white font-medium">
                  {{ candidate.first_name?.[0] }}{{ candidate.last_name?.[0] }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-slate-900 dark:text-white">{{ candidate.first_name }} {{ candidate.last_name }}</p>
                  <p class="text-sm text-slate-500">{{ candidate.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <p class="text-sm text-slate-900 dark:text-white">{{ getLatestJobTitle(candidate) }}</p>
              <p class="text-sm text-slate-500">{{ getLatestDepartment(candidate) }}</p>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <div class="h-2 w-16 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div class="h-2 rounded-full bg-brand-500" :style="`width: ${candidate.smart_score || 0}%`"></div>
                </div>
                <span class="text-sm font-medium" :class="getScoreClass(candidate.smart_score)">{{ candidate.smart_score !== undefined && candidate.smart_score !== null ? candidate.smart_score : 'N/A' }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(getLatestStatus(candidate))">{{ getStatusLabel(getLatestStatus(candidate)) }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">{{ formatDate(getLatestApplicationDate(candidate)) }}</td>
            <td class="px-6 py-4 text-right">
              <router-link :to="`/candidates/${candidate.id}`" class="text-sm text-brand-600 hover:underline dark:text-brand-400">Voir →</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="loading" class="mt-8 text-center">
      <BaseLoading />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCandidatesStore } from '@/stores/candidates'
import { useJobsStore } from '@/stores/jobs'
import BaseLoading from '@/components/common/BaseLoading.vue'

const candidatesStore = useCandidatesStore()
const jobsStore = useJobsStore()

const { candidates, loading, stats } = storeToRefs(candidatesStore)
const { jobs } = storeToRefs(jobsStore)

const filters = ref({ search: '', job_id: '', status: '', smart_score_min: '' })

watch(filters, (newFilters) => {
  candidatesStore.setFilters(newFilters)
}, { deep: true })

let debounceTimer = null
const debouncedSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => loadCandidates(), 300)
}

const loadCandidates = async () => {
  await candidatesStore.fetchCandidates()
}

const getStatusClass = (status) => {
  const classes = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
    reviewing: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    interview: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
    offer: 'bg-brand-100 text-brand-800 dark:bg-brand-950/50 dark:text-brand-300',
    hired: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    rejected: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
  }
  return `rounded-full px-2.5 py-0.5 text-xs font-medium ${classes[status] || 'bg-slate-100'}`
}

const getStatusLabel = (status) => ({
  new: 'Nouveau',
  reviewing: 'En évaluation',
  interview: 'Entretien',
  offer: 'Offre',
  hired: 'Embauché',
  rejected: 'Refusé'
}[status] || status)

const getScoreClass = (score) => {
  if (score >= 90) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 80) return 'text-brand-600 dark:text-brand-400'
  if (score >= 70) return 'text-amber-600 dark:text-amber-400'
  return 'text-slate-600 dark:text-slate-400'
}

const getLatestApplication = (candidate) => {
  if (candidate.last_application) return candidate.last_application
  if (candidate.applications?.length) {
    return [...candidate.applications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
  }
  return null
}

const getLatestJobTitle = (candidate) => {
  const app = getLatestApplication(candidate)
  return app?.job_title || app?.job?.title || 'Aucune candidature'
}

const getLatestDepartment = (candidate) => {
  const app = getLatestApplication(candidate)
  return app?.department || app?.job?.department || '-' 
}

const getLatestStatus = (candidate) => getLatestApplication(candidate)?.status || 'inconnu'

const getLatestApplicationDate = (candidate) => {
  const app = getLatestApplication(candidate)
  return app?.created_at || app?.applied_at || null
}

const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-'

onMounted(() => {
  loadCandidates()
  jobsStore.fetchJobs()
})
</script>
