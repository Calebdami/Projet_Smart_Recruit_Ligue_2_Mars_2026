<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Offres d'emploi</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400">Gérez vos offres et suivez les candidatures.</p>
      </div>
      <router-link v-if="$can('create_jobs')" to="/jobs/new" class="btn-primary w-full sm:w-auto">
        Nouvelle offre
      </router-link>
    </div>

    <!-- Filters -->
    <div class="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="relative">
          <svg
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="filters.search" type="text" placeholder="Rechercher une offre..." class="input-field pl-10" @input="debouncedSearch">
        </div>
        <select v-model="filters.status" class="input-field" @change="loadJobs">
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
          <option value="closed">Clôturé</option>
        </select>
        <select v-model="filters.department" class="input-field" @change="loadJobs">
          <option value="">Tous les départements</option>
          <option v-for="dept in departments" :key="dept.value" :value="dept.value">{{ dept.label }}</option>
        </select>
        <div class="flex items-center gap-2">
           <button @click="loadJobs" class="btn-secondary w-full justify-center py-2.5">
             <svg class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
             Rafraîchir
           </button>
        </div>
      </div>
    </div>

    <!-- Jobs List -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div v-for="job in jobs" :key="job.id" class="card-elevated group flex flex-col p-5 sm:p-6 transition-all hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700">
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mr-3" :title="job.title">
              {{ job.title }}
            </h3>
            <span :class="getStatusClass(job.status)" class="shrink-0">{{ getStatusLabel(job.status) }}</span>
          </div>
          
          <div class="flex items-center gap-2 mb-4">
            <span v-if="job.department" class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {{ job.department }}
            </span>
            <div class="flex items-center gap-1.5 text-xs text-slate-500">
              <svg class="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              </svg>
              <span class="truncate max-w-[150px]">{{ job.location }}</span>
            </div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 min-h-[60px]">
            {{ job.description }}
          </p>

          <div class="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6 border-t border-slate-50 dark:border-slate-800/50 pt-4">
            <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="font-bold">{{ job.salary_range || 'Non spécifié' }}</span>
            </div>
            <div class="flex items-center gap-1.5 text-brand-700 dark:text-brand-300">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="font-bold">{{ job.applications_count || 0 }} candidatures</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-3 mt-auto">
          <router-link :to="`/jobs/${job.id}`" class="btn-primary flex-1 justify-center text-sm py-2.5 shadow-sm">
            Détails
          </router-link>
          <router-link v-if="$can('edit_jobs')" :to="`/jobs/${job.id}/edit`" class="btn-secondary flex-1 justify-center text-sm py-2.5">
            Modifier
          </router-link>
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
import BaseLoading from '@/components/common/BaseLoading.vue'

const jobsStore = useJobsStore()
const { jobs, loading, filters: storeFilters } = storeToRefs(jobsStore)

const departments = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'RH' }
]

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

onMounted(() => loadJobs())
</script>
