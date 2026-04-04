<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Candidatures</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400">Suivez et gérez toutes les candidatures.</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-black">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
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

    <!-- Applications Table -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-black">
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
          <tr v-for="app in applications" :key="app.id" class="hover:bg-slate-50 dark:hover:bg-slate-900">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-medium">
                  {{ app.candidate?.first_name?.[0] }}{{ app.candidate?.last_name?.[0] }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-slate-900 dark:text-white">{{ app.candidate?.first_name }} {{ app.candidate?.last_name }}</p>
                  <p class="text-sm text-slate-500">{{ app.candidate?.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{{ app.job?.title }}</td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(app.status)">{{ getStatusLabel(app.status) }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{{ app.recruiter?.first_name || '-' }}</td>
            <td class="px-6 py-4 text-sm text-slate-500">{{ formatDate(app.created_at) }}</td>
            <td class="px-6 py-4 text-right">
              <router-link :to="`/applications/${app.id}`" class="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400">Voir →</router-link>
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
import { useApplicationsStore } from '@/stores/applications'
import { useJobsStore } from '@/stores/jobs'
import { useUserStore } from '@/stores/user'
import BaseLoading from '@/components/common/BaseLoading.vue'

const applicationsStore = useApplicationsStore()
const jobsStore = useJobsStore()
const userStore = useUserStore()

const { applications, loading } = storeToRefs(applicationsStore)
const { jobs } = storeToRefs(jobsStore)
const { users: recruiters } = storeToRefs(userStore)

const filters = ref({ search: '', status: '', job_id: '', recruiter_id: '' })

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
