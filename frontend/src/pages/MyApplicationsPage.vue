<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Mes Candidatures</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400">Suivi en temps réel de vos dépôts pour chaque poste.</p>
      </div>
    </div>

    <!-- Table of Applications -->
    <div class="card-elevated overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <BaseLoading />
      </div>
      
      <div v-else-if="applications.length === 0" class="p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-slate-900 dark:text-white">Aucune candidature</h3>
        <p class="mt-2 text-sm text-slate-500">Vous n'avez pas encore postulé à des offres.</p>
        <router-link to="/jobs" class="mt-4 inline-flex btn-primary">Parcourir les offres</router-link>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead class="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th scope="col" class="px-6 py-4 font-medium">Poste visé</th>
              <th scope="col" class="px-6 py-4 font-medium">Lieu</th>
              <th scope="col" class="px-6 py-4 font-medium">Date de dépôt</th>
              <th scope="col" class="px-6 py-4 font-medium">État de l'offre</th>
              <th scope="col" class="px-6 py-4 font-medium">Statut de la Candidature</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700/50">
            <tr v-for="app in applications" :key="app.id" class="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/25">
              <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
                <router-link :to="`/jobs/${app.job_id}`" class="hover:text-brand-600 hover:underline">
                  {{ app.job_title || 'Poste inconnu' }}
                </router-link>
              </td>
              <td class="px-6 py-4">
                {{ app.job_location || '-' }}
              </td>
              <td class="px-6 py-4">
                {{ formatDate(app.applied_at) }}
              </td>
              <td class="px-6 py-4">
                <span :class="getJobStatusClass(app.job_status)">{{ getJobStatusLabel(app.job_status) }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="getApplicationStatusClass(app.status)">
                  {{ getApplicationStatusLabel(app.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useApplicationsStore } from '@/stores/applications'
import BaseLoading from '@/components/common/BaseLoading.vue'

const applicationsStore = useApplicationsStore()
const { allApplications: applications, isLoading: loading } = storeToRefs(applicationsStore)

onMounted(async () => {
  await applicationsStore.fetchMyApplications()
})

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

const getJobStatusClass = (status) => {
  const classes = {
    draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800',
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30',
    closed: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30'
  }
  return `rounded-full px-2 py-0.5 text-xs font-medium ${classes[status] || classes.draft}`
}

const getJobStatusLabel = (status) => {
  return { draft: 'Brouillon', published: 'Ouverte', closed: 'Clôturée' }[status] || status
}

const getApplicationStatusClass = (status) => {
  const statusClasses = {
    new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    reviewing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    screening: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    interview: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    technical_test: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    offer: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    hired: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    withdrawn: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  }
  return `rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses[status] || 'bg-slate-100 text-slate-700'}`
}

const getApplicationStatusLabel = (status) => {
  const labels = {
    new: 'Nouveau',
    reviewing: 'En analyse',
    screening: 'Présélection',
    interview: 'Entretien',
    technical_test: 'Test technique',
    offer: 'Offre envoyée',
    hired: 'Embauché(e)',
    rejected: 'Refusé(e)',
    withdrawn: 'Retirée'
  }
  return labels[status] || status
}
</script>
