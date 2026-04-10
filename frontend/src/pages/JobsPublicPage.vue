<template>
  <div class="py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Offres d'emploi</h1>
        <p class="mt-2 text-slate-600 dark:text-slate-400">Découvrez les opportunités disponibles et postulez en quelques clics</p>
      </div>

      <!-- Search & Filters -->
      <div class="mb-8 flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un poste, une entreprise..."
            class="input-field w-full pl-10"
            @keyup.enter="applyFilters"
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <select v-model="selectedStatus" class="input-field sm:w-48" @change="applyFilters">
          <option value="">Tous les statuts</option>
          <option value="published">Publié</option>
          <option value="open">Ouvert</option>
        </select>
        <button @click="applyFilters" class="btn-primary sm:w-auto">
          Rechercher
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <BaseLoading />
      </div>

      <!-- Empty State -->
      <div v-else-if="jobs.length === 0" class="text-center py-12">
        <div class="mx-auto mb-4 h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-slate-500">Aucune offre ne correspond à vos critères.</p>
        <button @click="resetFilters" class="mt-4 text-brand-600 hover:text-brand-700 font-medium">
          Réinitialiser les filtres
        </button>
      </div>

      <!-- Jobs Grid -->
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="job in jobs" :key="job.id" class="card-elevated p-6 hover:shadow-lg transition-shadow">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white font-bold text-lg">
              {{ job.title?.charAt(0) }}
            </div>
            <span :class="getStatusClass(job.status)">{{ getStatusLabel(job.status) }}</span>
          </div>

          <!-- Content -->
          <h3 class="font-semibold text-slate-900 dark:text-white text-lg mb-2">{{ job.title }}</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{{ job.description }}</p>

          <!-- Meta -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm text-slate-500">
              <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              </svg>
              <span>{{ job.location }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-500">
              <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ job.salary_range || job.salary_min && job.salary_max ? `${job.salary_min}-${job.salary_max}£` : 'Salaire à négocier' }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-500">
              <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <span>{{ job.department }}</span>
            </div>
          </div>

          <!-- Skills -->
          <div v-if="job.skills?.length" class="flex flex-wrap gap-1 mb-4">
            <span v-for="skill in job.skills.slice(0, 3)" :key="skill" class="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">
              {{ skill }}
            </span>
            <span v-if="job.skills.length > 3" class="text-xs text-slate-400">+{{ job.skills.length - 3 }}</span>
          </div>

          <!-- Actions -->
          <router-link 
            :to="`/jobs/${job.id}`" 
            class="block w-full text-center btn-primary text-sm"
          >
            Voir les détails
          </router-link>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-8 flex justify-center gap-2">
        <button 
          @click="changePage(pagination.page - 1)" 
          :disabled="pagination.page === 1"
          class="px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          ←
        </button>
        <span class="px-4 py-1 text-sm text-slate-600 dark:text-slate-400">
          Page {{ pagination.page }} sur {{ pagination.totalPages }}
        </span>
        <button 
          @click="changePage(pagination.page + 1)" 
          :disabled="pagination.page === pagination.totalPages"
          class="px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import { storeToRefs } from 'pinia'
import BaseLoading from '@/components/common/BaseLoading.vue'

const jobsStore = useJobsStore()
const { jobs, loading, pagination } = storeToRefs(jobsStore)

const searchQuery = ref('')
const selectedStatus = ref('')

const getStatusClass = (status) => {
  const classes = {
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    closed: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
  }
  return `rounded-full px-2.5 py-0.5 text-xs font-medium ${classes[status] || 'bg-slate-100 text-slate-700'}`
}

const getStatusLabel = (status) => {
  const labels = { draft: 'Brouillon', published: 'Publié', closed: 'Clôturé', open: 'Ouvert' }
  return labels[status] || status
}

const applyFilters = async () => {
  await jobsStore.fetchJobs({ 
    page: 1, 
    search: searchQuery.value, 
    status: selectedStatus.value 
  })
}

const resetFilters = async () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  await jobsStore.fetchJobs({ page: 1 })
}

const changePage = async (page) => {
  if (page < 1 || page > pagination.value.totalPages) return
  await jobsStore.fetchJobs({ 
    page, 
    search: searchQuery.value, 
    status: selectedStatus.value 
  })
}

onMounted(() => {
  jobsStore.fetchJobs({ status: 'published' })
})
</script>
