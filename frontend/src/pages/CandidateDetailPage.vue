<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-8">
      <button 
        @click="goBackSafely" 
        class="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <svg class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour aux candidats
      </button>
    </div>

    <div v-if="candidate" class="space-y-8 animate-fade-in-up">
      <!-- Header -->
      <div class="card-elevated relative overflow-hidden p-6 sm:p-10">
        <div class="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-50/50 dark:bg-brand-900/10 blur-3xl transition-colors duration-700"></div>
        
        <div class="relative flex flex-col md:flex-row items-center md:items-start gap-8">
          <div class="h-28 w-28 shrink-0 rounded-3xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-brand-500/20 ring-4 ring-white dark:ring-slate-800 transition-all duration-300">
            {{ candidate.first_name?.[0] }}{{ candidate.last_name?.[0] }}
          </div>
          <div class="flex-1 min-w-0 w-full text-center md:text-left">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2 transition-colors duration-300">
                  {{ candidate.first_name }} {{ candidate.last_name }}
                </h1>
                <div class="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium transition-colors duration-300">
                    <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {{ candidate.email }}
                  </span>
                  <span v-if="candidate.phone" class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium transition-colors duration-300">
                    <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {{ candidate.phone }}
                  </span>
                </div>
              </div>
              
              <div class="flex flex-row md:flex-col items-center md:items-end gap-4 shrink-0 justify-center">
                <div class="inline-flex flex-col items-center md:items-end">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1 transition-colors duration-300">SmartScore</span>
                  <div class="inline-flex items-center gap-2 rounded-2xl bg-amber-50 dark:bg-amber-950/20 px-5 py-2.5 text-amber-700 dark:text-amber-400 border-2 border-amber-100 dark:border-amber-800 shadow-sm transition-all duration-300">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <span class="font-black text-2xl leading-none">{{ getSmartScore(candidate) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Main Column -->
        <div class="lg:col-span-8 space-y-8">
          <!-- Bio -->
          <div class="card-elevated p-8 sm:p-10">
            <div class="flex items-center gap-3 mb-8">
              <div class="h-8 w-1.5 bg-brand-500 rounded-full shadow-[0_0_8px_rgba(var(--color-brand-500),0.5)]"></div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Bio & Présentation</h2>
            </div>
            <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{{ candidate.bio || 'Aucune bio renseignée.' }}</p>
          </div>

          <!-- Skills -->
          <div class="card-elevated p-8 sm:p-10">
            <div class="flex items-center gap-3 mb-8">
              <div class="h-8 w-1.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(var(--color-violet-500),0.5)]"></div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Compétences techniques</h2>
            </div>
            <div v-if="candidate.skills?.length" class="flex flex-wrap gap-3">
              <span v-for="skill in candidate.skills" :key="skill" class="px-5 py-2.5 rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300 text-sm font-bold border border-violet-100 dark:border-violet-800 transition-all hover:scale-105 hover:shadow-sm">
                {{ typeof skill === 'string' ? skill : Object.entries(skill).map(([k, v]) => `${k}: ${v}`).join(', ') }}
              </span>
            </div>
            <div v-else class="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <svg class="h-16 w-16 opacity-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              <p class="font-bold">Aucune compétence renseignée.</p>
            </div>
          </div>

          <!-- Applications History -->
          <div class="card-elevated p-8 sm:p-10">
            <div class="flex items-center gap-3 mb-8">
              <div class="h-8 w-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(var(--color-emerald-500),0.5)]"></div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Historique des candidatures</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" v-if="candidate.applications?.length">
              <div v-for="app in candidate.applications" :key="app.id" class="flex flex-col justify-between rounded-3xl border border-slate-100 p-6 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-brand-300 dark:hover:border-brand-700 transition-all group">
                <div class="mb-6">
                  <p class="text-lg font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors leading-tight mb-2">{{ app.job?.title }}</p>
                  <p class="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Postulé le {{ formatDate(app.created_at) }}
                  </p>
                </div>
                <div class="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span :class="getStatusClass(app.status)">{{ getStatusLabel(app.status) }}</span>
                  <router-link :to="`/applications/${app.id}`" class="text-xs font-black text-brand-600 dark:text-brand-400 hover:text-brand-700 uppercase tracking-widest">Voir détails →</router-link>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-16 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p class="text-slate-500 font-bold">Aucune candidature enregistrée pour ce talent.</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-4 space-y-8">
          <!-- Info Card -->
          <div class="card-elevated p-8 sticky top-6">
            <h3 class="text-xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Informations clés</h3>
            <div class="space-y-6">
              <div class="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rôle plateforme</span>
                <span class="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">{{ getRoleLabel(candidate) }}</span>
              </div>

              <div class="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut du compte</span>
                <div class="flex items-center gap-2 mt-1">
                  <span v-if="candidate.is_active" class="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <span class="text-base font-bold" :class="candidate.is_active ? 'text-emerald-600' : 'text-slate-400'">
                    {{ candidate.is_active ? 'Actif' : 'Inactif' }}
                  </span>
                </div>
              </div>

              <!-- CV Section in Sidebar -->
              <div class="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-4 mb-6">
                  <div class="h-12 w-12 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 shadow-inner">
                    <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Curriculum Vitae</p>
                    <p class="text-xs font-bold text-slate-900 dark:text-white">{{ candidate.cv_url ? 'Disponible' : 'Non renseigné' }}</p>
                  </div>
                </div>
                
                <div class="flex flex-col gap-3">
                  <a v-if="candidate.cv_url" :href="candidate.cv_url" target="_blank" class="btn-primary w-full justify-center py-3 text-sm font-black shadow-lg shadow-brand-500/20">
                    Consulter le CV
                  </a>
                  <button class="btn-secondary w-full justify-center py-3 text-sm font-bold" @click="uploadCV">
                    {{ candidate.cv_url ? 'Mettre à jour le CV' : 'Uploader un CV' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-24 flex flex-col items-center gap-4">
      <BaseLoading />
      <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Chargement du profil...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCandidatesStore } from '@/stores/candidates'
import BaseLoading from '@/components/common/BaseLoading.vue'

const route = useRoute()
const router = useRouter()
const candidatesStore = useCandidatesStore()
const { currentCandidate: candidate, loading } = storeToRefs(candidatesStore)

const goBackSafely = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/candidates')
  }
}

const loadCandidate = async () => {
  await candidatesStore.fetchCandidate(route.params.id)
}

const getSmartScore = (candidate) => candidate.smart_score ?? 'N/A'

const getRoleLabel = (candidate) => {
  const roles = { admin: 'Administrateur', recruiter: 'Recruteur', candidate: 'Candidat' }
  return roles[candidate.role] || candidate.role
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
  return `rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${classes[status] || 'bg-slate-100'}`
}

const getStatusLabel = (status) => ({
  new: 'Nouveau',
  reviewing: 'En évaluation',
  interview: 'Entretien',
  offer: 'Offre',
  hired: 'Embauché',
  rejected: 'Refusé'
}[status] || status)

const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-'

const uploadCV = () => {
  // Logic for CV upload would go here
  alert('Fonctionnalité d\'upload de CV bientôt disponible.')
}

onMounted(() => loadCandidate())
</script>