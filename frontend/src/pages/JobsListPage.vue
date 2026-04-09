<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Offres d'emploi</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400">Gérez vos offres et suivez les candidatures.</p>
      </div>
      <router-link v-if="$can('create_jobs')" to="/jobs/new" class="btn-primary">
        Nouvelle offre
      </router-link>
    </div>

    <!-- Filters -->
    <div class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-black">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <input v-model="filters.search" type="text" placeholder="Rechercher..." class="input-field" @input="debouncedSearch">
        </div>
        <div>
          <select v-model="filters.status" class="input-field" @change="loadJobs">
            <option value="">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="closed">Clôturé</option>
          </select>
        </div>
        <div>
          <select v-model="filters.department" class="input-field" @change="loadJobs">
            <option value="">Tous les départements</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="hr">RH</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Jobs List -->
    <div class="space-y-4">
      <div v-for="job in jobs" :key="job.id" class="card-elevated p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ job.title }}</h3>
              <span :class="getStatusClass(job.status)">{{ getStatusLabel(job.status) }}</span>
            </div>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{{ job.description?.substring(0, 150) }}...</p>
            <div class="mt-4 flex items-center gap-6 text-sm text-slate-500">
              <span class="flex items-center gap-1">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {{ job.location }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ job.salary_range }}
              </span>
              <span v-if="$can('review_applications')" class="flex items-center gap-1">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                {{ job.applications_count || 0 }} candidatures
              </span>
            </div>
          </div>
          <div class="ml-4 flex items-center gap-2">
            <router-link :to="`/jobs/${job.id}`" class="btn-secondary text-sm">Voir</router-link>
            <router-link
              v-if="isCandidate && $can('create_applications') && isJobOpenForApplications(job.status)"
              :to="`/jobs/${job.id}/apply`"
              class="btn-primary text-sm"
            >
              Postuler
            </router-link>
            <router-link v-if="$can('update_jobs')" :to="`/jobs/${job.id}/edit`" class="btn-secondary text-sm">Modifier</router-link>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="mt-8 text-center">
      <BaseLoading />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useJobsStore } from '@/stores/jobs'
import { useAuthStore } from '@/stores/auth'
import BaseLoading from '@/components/common/BaseLoading.vue'

const jobsStore = useJobsStore()
const authStore = useAuthStore()
const { jobs, loading, filters: storeFilters } = storeToRefs(jobsStore)

// Sync local filters with store filters
const filters = ref({ search: '', status: '', department: '' })

watch(filters, (newFilters) => {
  jobsStore.setFilters(newFilters)
}, { deep: true })

let debounceTimer = null

const debouncedSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => loadJobs(), 300)
}

const loadJobs = async () => {
  await jobsStore.fetchJobs()
}

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    closed: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
  }
  return `rounded-full px-2.5 py-0.5 text-xs font-medium ${classes[status] || classes.draft}`
}

const getStatusLabel = (status) => {
  const labels = { draft: 'Brouillon', published: 'Publié', closed: 'Clôturé' }
  return labels[status] || status
}

const isJobOpenForApplications = (status) => ['published', 'open'].includes(status)
const isCandidate = authStore.user?.role === 'candidate'

onMounted(() => loadJobs())
</script>
