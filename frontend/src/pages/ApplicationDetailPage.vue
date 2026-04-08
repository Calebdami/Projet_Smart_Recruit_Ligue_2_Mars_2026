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
        Retour aux candidatures
      </button>
    </div>

    <div v-if="application" class="grid grid-cols-1 gap-8 lg:grid-cols-12 animate-fade-in-up">
      <!-- Main Column -->
      <div class="lg:col-span-8 space-y-8">
        <!-- Candidate Card -->
        <div class="card-elevated relative overflow-hidden p-6 sm:p-10">
          <div class="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-50/50 dark:bg-brand-900/10 blur-3xl transition-colors duration-700"></div>
          
          <div class="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            <div class="h-24 w-24 shrink-0 rounded-3xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-brand-500/20 ring-4 ring-white dark:ring-slate-800 transition-all duration-300">
              {{ application.candidate?.first_name?.[0] }}{{ application.candidate?.last_name?.[0] }}
            </div>
            <div class="flex-1 min-w-0 w-full text-center md:text-left">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2 transition-colors duration-300">
                    {{ application.candidate?.first_name }} {{ application.candidate?.last_name }}
                  </h1>
                  <p class="text-slate-600 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 font-medium transition-colors duration-300">
                    <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {{ application.candidate?.email }}
                  </p>
                </div>
                <div class="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0 justify-center">
                  <span :class="getStatusClass(application.status)" class="shadow-sm transition-all duration-300">{{ getStatusLabel(application.status) }}</span>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 transition-colors duration-300">Postulé le {{ formatDate(application.created_at) }}</p>
                </div>
              </div>
              <div class="flex flex-wrap justify-center md:justify-start gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <a :href="`mailto:${application.candidate?.email}`" class="btn-primary py-2.5 px-6 text-sm font-black shadow-lg shadow-brand-500/10">
                  Contacter le candidat
                </a>
                <router-link v-if="application.candidate?.id" :to="`/candidates/${application.candidate.id}`" class="btn-secondary py-2.5 px-6 text-sm font-bold">
                  Voir le profil complet
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Pipeline -->
        <section>
          <ApplicationPipeline :current-status="application.status" @update-status="updateStatus" />
        </section>

        <!-- Job Details -->
        <div class="card-elevated p-8 sm:p-10">
          <div class="flex items-center gap-3 mb-8">
            <div class="h-8 w-1.5 bg-brand-500 rounded-full shadow-[0_0_8px_rgba(var(--color-brand-500),0.5)]"></div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Offre concernée</h2>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
            <div class="min-w-0">
              <p class="text-xl font-black text-slate-900 dark:text-white mb-1">{{ application.job?.title }}</p>
              <p class="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] uppercase tracking-wider">{{ application.job?.department }}</span>
                <span class="text-slate-300 dark:text-slate-600">•</span>
                {{ application.job?.location }}
              </p>
            </div>
            <router-link v-if="application.job?.id" :to="`/jobs/${application.job.id}`" class="btn-secondary shrink-0 py-2.5 px-5 text-xs font-bold uppercase tracking-widest">
              Détails de l'offre
            </router-link>
          </div>
        </div>

        <!-- Notes -->
        <div class="card-elevated p-8 sm:p-10">
          <div class="flex items-center gap-3 mb-8">
            <div class="h-8 w-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Notes & Évaluation</h2>
          </div>
          <textarea 
            v-model="notes" 
            rows="6" 
            class="input-field py-4 px-5 text-lg resize-none focus:ring-amber-500/20 rounded-3xl" 
            placeholder="Partagez vos impressions sur ce candidat, les points forts identifiés lors de l'entretien..."
          ></textarea>
          <div class="mt-6 flex justify-end">
            <button class="btn-primary bg-amber-600 hover:bg-amber-700 border-amber-600 px-8 py-3 font-black shadow-lg shadow-amber-600/20" @click="saveNotes">
              Enregistrer l'évaluation
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar Column -->
      <div class="lg:col-span-4 space-y-8">
        <!-- Assignment -->
        <div class="card-elevated p-8 sticky top-6">
          <h3 class="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3 tracking-tight">
            <div class="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors duration-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            Suivi & Responsable
          </h3>
          <div class="space-y-4">
            <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Recruteur assigné</label>
            <div class="relative">
              <select v-model="application.recruiter_id" class="input-field pl-4 pr-10 py-3 text-sm font-bold rounded-2xl appearance-none" @change="assignRecruiter">
                <option :value="null">Non assigné</option>
                <option v-for="user in recruiters" :key="user.id" :value="user.id">{{ user.first_name }} {{ user.last_name }}</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div class="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <h3 class="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <div class="h-10 w-10 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 transition-colors duration-300">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              Documents
            </h3>
            <div v-if="application.cv_url">
              <a :href="application.cv_url" target="_blank" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all duration-300 group border border-slate-100 dark:border-slate-700/50 hover:border-brand-200 dark:hover:border-brand-700">
                <div class="flex items-center gap-4 min-w-0">
                  <div class="h-12 w-12 shrink-0 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
                    <svg class="h-7 w-7 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-black text-slate-900 dark:text-white truncate">Curriculum Vitae</p>
                    <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">PDF • 1.2 MB</p>
                  </div>
                </div>
                <svg class="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-brand-500 transition-all group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </a>
            </div>
            <div v-else class="text-center py-8 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-300">
              <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Aucun document joint</p>
            </div>
          </div>

          <div class="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <h3 class="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <div class="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors duration-300">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              Historique
            </h3>
            <div class="relative space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
              <div v-for="(event, i) in timeline" :key="i" class="relative pl-8 group">
                <div class="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-700 group-first:bg-brand-500 group-first:shadow-[0_0_8px_rgba(var(--color-brand-500),0.5)] transition-all duration-300"></div>
                <div>
                  <p class="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1 group-first:text-brand-600 dark:group-first:text-brand-400 transition-colors duration-300">{{ event.action }}</p>
                  <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors duration-300">{{ formatDateTime(event.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-24 flex flex-col items-center gap-4">
      <BaseLoading />
      <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Chargement de la candidature...</p>
    </div>

    <div v-else-if="error" class="text-center py-24">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-4">
        <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-slate-900 mb-2">Une erreur est survenue</h3>
      <p class="text-slate-500 mb-8">{{ error }}</p>
      <button @click="loadApplication" class="btn-primary px-6 py-2">
        Réessayer
      </button>
    </div>

    <div v-else class="text-center py-24">
      <p class="text-slate-500">Candidature non trouvée.</p>
      <router-link to="/applications" class="btn-secondary mt-4 inline-block px-6 py-2">
        Retour aux candidatures
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useApplicationsStore } from '@/stores/applications'
import { useUserStore } from '@/stores/user'
import BaseLoading from '@/components/common/BaseLoading.vue'
import ApplicationPipeline from '@/components/core/ApplicationPipeline.vue'

const route = useRoute()
const router = useRouter()
const applicationsStore = useApplicationsStore()
const userStore = useUserStore()

const goBackSafely = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/applications')
  }
}

const { currentApplication: application, loading, error } = storeToRefs(applicationsStore)
const { users: recruiters } = storeToRefs(userStore)

const notes = ref('')
const timeline = ref([])

const loadApplication = async () => {
  const id = route.params.id
  if (!id) return
  
  await applicationsStore.fetchApplication(id)
  await userStore.fetchUsers()
  
  if (application.value) {
    // Timeline simulation for now, should come from API in production
    timeline.value = [
      { action: 'Candidature reçue', created_at: application.value.created_at },
    ]
    notes.value = application.value.notes || ''
  }
}

// Watch for route changes to reload data
watch(() => route.params.id, (newId) => {
  if (newId) loadApplication()
})

const updateStatus = async (newStatus) => {
  try {
    const res = await applicationsStore.updateStatus(route.params.id, newStatus)
    if (res.success) {
      timeline.value.unshift({ 
        action: `Statut changé: ${getStatusLabel(newStatus)}`, 
        created_at: new Date().toISOString() 
      })
    }
  } catch (err) {
    console.error('Failed to update status:', err)
  }
}

const assignRecruiter = async () => {
  try {
    const res = await applicationsStore.assignRecruiter(route.params.id, application.value.recruiter_id)
    if (res.success) {
      const recruiter = recruiters.value.find(r => r.id === application.value.recruiter_id)
      timeline.value.unshift({ 
        action: `Assigné à ${recruiter ? recruiter.first_name + ' ' + recruiter.last_name : 'personne'}`, 
        created_at: new Date().toISOString() 
      })
    }
  } catch (err) {
    console.error('Failed to assign recruiter:', err)
  }
}

const saveNotes = async () => {
  try {
    const res = await applicationsStore.addNote(route.params.id, notes.value)
    if (res.success) {
      // Update local application object with new notes
      if (application.value) {
        application.value.notes = notes.value
      }
    }
  } catch (err) {
    console.error('Failed to save notes:', err)
  }
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
  new: 'Nouvelle',
  reviewing: 'En évaluation',
  interview: 'Entretien',
  offer: 'Offre',
  hired: 'Embauché',
  rejected: 'Refusé'
}[status] || status)

const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-'
const formatDateTime = (date) => date ? new Date(date).toLocaleString('fr-FR', { 
  day: '2-digit', 
  month: '2-digit', 
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}) : '-'

onMounted(() => loadApplication())
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 rounded-full dark:bg-slate-800;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-300 dark:bg-slate-700;
}
</style>