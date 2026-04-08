<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col gap-4">
        <router-link 
          v-if="filters.job_id && selectedJob" 
          :to="`/jobs/${filters.job_id}`" 
          class="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white w-fit"
        >
          <svg class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'offre
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Candidatures</h1>
          <p class="text-sm text-slate-600 dark:text-slate-400" v-if="filters.job_id && selectedJob">
            Pour <span class="font-semibold">{{ selectedJob.title }}</span>
          </p>
          <p class="text-sm text-slate-600 dark:text-slate-400" v-else>Suivez et gérez toutes les candidatures.</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-black">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <input v-model="filters.search" type="text" placeholder="Candidat, offre..." class="input-field" @input="debouncedSearch">
        <select v-model="filters.status" class="input-field" @change="loadApplications">
          <option value="">Tous les statuts</option>
          <option value="new">Nouvelle</option>
          <option value="reviewing">En cours d'évaluation</option>
          <option value="interview">Entretien</option>
          <option value="offer">Offre</option>
          <option value="hired">Embauché</option>
          <option value="rejected">Refusé</option>
        </select>
        <select v-model="filters.job_id" class="input-field" @change="loadApplications">
          <option value="">Toutes les offres</option>
          <option v-for="job in jobs" :key="job.id" :value="job.id">{{ job.title }}</option>
        </select>
        <select v-model="filters.recruiter_id" class="input-field" @change="loadApplications">
          <option value="">Tous les recruteurs</option>
          <option v-for="user in recruiters" :key="user.id" :value="user.id">{{ user.first_name }} {{ user.last_name }}</option>
        </select>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-black md:block">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead class="bg-slate-50 dark:bg-slate-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Candidat</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Offre</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Statut</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Recruteur</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Date</th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          <tr v-for="app in applications" :key="app.id" class="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-medium">
                  {{ app.candidate?.first_name?.[0] }}{{ app.candidate?.last_name?.[0] }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-slate-900 dark:text-white">{{ app.candidate?.first_name }} {{ app.candidate?.last_name }}</p>
                  <p class="text-xs text-slate-500">{{ app.candidate?.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
              <p class="truncate max-w-[200px]" :title="app.job?.title">{{ app.job?.title }}</p>
            </td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(app.status)">{{ getStatusLabel(app.status) }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{{ app.recruiter?.first_name || '-' }}</td>
            <td class="px-6 py-4 text-sm text-slate-500">{{ formatDate(app.created_at) }}</td>
            <td class="px-6 py-4 text-right">
              <router-link :to="`/applications/${app.id}`" class="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">Voir →</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="grid grid-cols-1 gap-4 md:hidden">
      <div v-for="app in applications" :key="app.id" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-black">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
              {{ app.candidate?.first_name?.[0] }}{{ app.candidate?.last_name?.[0] }}
            </div>
            <div class="ml-3">
              <p class="text-sm font-bold text-slate-900 dark:text-white">{{ app.candidate?.first_name }} {{ app.candidate?.last_name }}</p>
              <p class="text-xs text-slate-500 truncate max-w-[150px]">{{ app.candidate?.email }}</p>
            </div>
          </div>
          <span :class="getStatusClass(app.status)">{{ getStatusLabel(app.status) }}</span>
        </div>
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Offre :</span>
            <span class="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{{ app.job?.title }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Recruteur :</span>
            <span class="text-slate-700 dark:text-slate-300">{{ app.recruiter?.first_name || '-' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Date :</span>
            <span class="text-slate-500">{{ formatDate(app.created_at) }}</span>
          </div>
        </div>
        <router-link :to="`/applications/${app.id}`" class="btn-primary w-full justify-center text-sm">
          Gérer la candidature
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="mt-8 text-center">
      <BaseLoading />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useApplicationsStore } from '@/stores/applications'
import { useJobsStore } from '@/stores/jobs'
import { useUserStore } from '@/stores/user'
import BaseLoading from '@/components/common/BaseLoading.vue'

const route = useRoute()
const applicationsStore = useApplicationsStore()
const jobsStore = useJobsStore()
const userStore = useUserStore()

const { applications, loading } = storeToRefs(applicationsStore)
const { jobs } = storeToRefs(jobsStore)
const { users: recruiters } = storeToRefs(userStore)

const filters = ref({ search: '', status: '', job_id: '', recruiter_id: '' })

// Computed property to get selected job details
const selectedJob = computed(() => {
  if (!filters.value.job_id) return null
  return jobs.value.find(j => j.id === filters.value.job_id)
})

// Initialize filters from query parameters
onMounted(async () => {
  // Get query parameters from route
  if (route.query.job_id) {
    filters.value.job_id = route.query.job_id
  }
  if (route.query.status) {
    filters.value.status = route.query.status
  }
  if (route.query.recruiter_id) {
    filters.value.recruiter_id = route.query.recruiter_id
  }
  
  // Load jobs and users for dropdown options
  await jobsStore.fetchJobs()
  await userStore.fetchUsers()
  
  // Load applications with applied filters
  await loadApplications()
})

watch(filters, (newFilters) => {
  applicationsStore.setFilters(newFilters)
}, { deep: true })

let debounceTimer = null
const debouncedSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => loadApplications(), 300)
}

const loadApplications = async () => {
  await applicationsStore.fetchApplications()
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
  new: 'Nouvelle',
  reviewing: 'En évaluation',
  interview: 'Entretien',
  offer: 'Offre',
  hired: 'Embauché',
  rejected: 'Refusé'
}[status] || status)

const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-'

onMounted(() => {
  loadApplications()
  jobsStore.fetchJobs()
  userStore.fetchUsers()
})
</script>
