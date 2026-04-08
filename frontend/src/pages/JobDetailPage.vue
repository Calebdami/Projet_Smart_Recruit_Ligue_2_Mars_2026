<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-8 flex items-center justify-between">
      <button 
        @click="goBackSafely" 
        class="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <svg class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour aux offres
      </button>

      <div class="hidden sm:flex items-center gap-3">
        <router-link v-if="$can('update_jobs')" :to="`/jobs/${job?.id}/edit`" class="btn-secondary px-4 py-2.5 text-sm font-bold">
          Modifier
        </router-link>
        <button v-if="$can('update_jobs') && job?.status !== 'closed'" class="btn-danger px-4 py-2.5 text-sm font-bold" @click="closeJob">
          Clôturer l'offre
        </button>
      </div>
    </div>

    <div v-if="job" class="space-y-8 animate-fade-in-up">
      <!-- Job Header Card -->
      <div class="card-elevated relative overflow-hidden p-6 sm:p-10">
        <!-- Decorative Background Element -->
        <div class="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-50/50 dark:bg-brand-900/10 blur-3xl transition-colors duration-700"></div>
        
        <div class="relative flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-3 mb-6">
              <span :class="getStatusClass(job.status)" class="shrink-0 transition-all duration-300">
                {{ getStatusLabel(job.status) }}
              </span>
              <span class="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 transition-colors duration-300">Publié le {{ formatDate(job.created_at) }}</span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight transition-colors duration-300">
              {{ job.title }}
            </h1>
            
            <div class="flex flex-wrap items-center gap-y-4 gap-x-8">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-inner transition-colors duration-300">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Département</p>
                  <p class="text-sm font-bold text-slate-900 dark:text-white transition-colors duration-300">{{ job.department }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-inner transition-colors duration-300">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Localisation</p>
                  <p class="text-sm font-bold text-slate-900 dark:text-white transition-colors duration-300">{{ job.location }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-inner transition-colors duration-300">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Rémunération</p>
                  <p class="text-sm font-bold text-slate-900 dark:text-white transition-colors duration-300">{{ job.salary_min || '?' }} - {{ job.salary_max || '?' }} £</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0 sm:border-t lg:border-t-0 pt-8 lg:pt-0 border-slate-100 dark:border-slate-800 min-w-[240px]">
            <router-link :to="`/applications?job_id=${job.id}`" class="btn-primary flex-1 justify-center py-4 text-sm font-black shadow-lg shadow-brand-500/20">
              Gérer les candidatures
              <span class="ml-2 px-2 py-0.5 rounded-lg bg-white/20 text-xs">{{ job.applications_count || 0 }}</span>
            </router-link>
            <div class="flex gap-3 sm:hidden">
              <router-link v-if="$can('update_jobs')" :to="`/jobs/${job.id}/edit`" class="btn-secondary flex-1 justify-center text-sm py-3 font-bold">
                Modifier
              </router-link>
              <button v-if="$can('update_jobs') && job.status !== 'closed'" class="btn-danger flex-1 justify-center text-sm py-3 font-bold" @click="closeJob">
                Clôturer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Column: Details -->
        <div class="lg:col-span-8 space-y-8">
          <section class="card-elevated p-8 sm:p-10">
            <div class="flex items-center gap-3 mb-8">
              <div class="h-8 w-1.5 bg-brand-500 rounded-full shadow-[0_0_8px_rgba(var(--color-brand-500),0.5)]"></div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Description du poste</h2>
            </div>
            <div class="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
              {{ job.description }}
            </div>
          </section>

          <section v-if="job.skills?.length" class="card-elevated p-8 sm:p-10">
            <div class="flex items-center gap-3 mb-8">
              <div class="h-8 w-1.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(var(--color-violet-500),0.5)]"></div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Compétences requises</h2>
            </div>
            <div class="flex flex-wrap gap-3">
              <span v-for="skill in job.skills" :key="skill" class="px-5 py-2.5 rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300 text-sm font-bold border border-violet-100 dark:border-violet-800 transition-all hover:scale-105 hover:shadow-sm">
                {{ skill }}
              </span>
            </div>
          </section>
        </div>

        <!-- Right Column: Sidebar -->
        <div class="lg:col-span-4 space-y-8">
          <!-- Summary Card -->
          <div class="card-elevated p-8 sticky top-6">
            <h3 class="text-xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Résumé de l'offre</h3>
            <div class="space-y-6">
              <div class="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Type de contrat</span>
                <span class="text-base font-bold text-slate-900 dark:text-white">
                  {{ job.employment_type === 'full_time' ? 'Temps plein (CDI)' : 'Temps partiel' }}
                </span>
              </div>

              <div class="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Département</span>
                <span class="text-base font-bold text-slate-900 dark:text-white">{{ job.department }}</span>
              </div>

              <div class="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Date de clôture prévue</span>
                <span class="text-base font-bold text-slate-900 dark:text-white">{{ job.closing_date ? formatDate(job.closing_date) : 'Non définie' }}</span>
              </div>

              <div class="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div class="flex items-center gap-4 mb-6">
                  <div class="h-12 w-12 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-black shadow-inner transition-colors duration-300">
                    {{ job.recruiter?.first_name?.[0] || 'R' }}
                  </div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Recruteur assigné</p>
                    <p class="text-sm font-bold text-slate-900 dark:text-white transition-colors duration-300">{{ job.recruiter?.first_name || 'Équipe recrutement' }}</p>
                  </div>
                </div>
                
                <div class="bg-brand-50/50 dark:bg-brand-900/10 rounded-2xl p-5 border border-brand-100 dark:border-brand-900/50 transition-colors duration-300">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-sm font-bold text-brand-900 dark:text-brand-200">Candidatures</span>
                    <span class="text-2xl font-black text-brand-600 dark:text-brand-400">{{ job.applications_count || 0 }}</span>
                  </div>
                  <div class="w-full h-2 rounded-full bg-brand-100 dark:bg-brand-900 overflow-hidden mb-2 transition-colors duration-300">
                    <div class="h-full bg-brand-500 rounded-full transition-all duration-700" :style="`width: ${Math.min((job.applications_count || 0) * 5, 100)}%`"></div>
                  </div>
                  <p class="text-[10px] font-bold text-brand-600/60 dark:text-brand-400/60 text-center uppercase tracking-wider">Objectif : 20 candidats</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-24 flex flex-col items-center gap-4">
      <BaseLoading />
      <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Chargement de l'offre...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useJobsStore } from '@/stores/jobs'
import BaseLoading from '@/components/common/BaseLoading.vue'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const { currentJob: job, loading } = storeToRefs(jobsStore)

const goBackSafely = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/jobs')
  }
}

const loadJob = async () => {
  await jobsStore.fetchJob(route.params.id)
}

const closeJob = async () => {
  if (confirm('Êtes-vous sûr de vouloir clôturer cette offre ?')) {
    await jobsStore.closeJob(route.params.id)
  }
}

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    closed: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
  }
  return `rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${classes[status] || classes.draft}`
}

const getStatusLabel = (status) => ({ draft: 'Brouillon', published: 'Publié', closed: 'Clôturé' }[status] || status)
const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-'

onMounted(() => loadJob())
</script>