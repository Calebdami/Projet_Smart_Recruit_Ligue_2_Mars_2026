<template>
  <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <button @click="goBackSafely" class="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        ← Retour aux candidatures
      </button>
    </div>

    <div v-if="application" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Candidate Card -->
        <div class="card-elevated p-6">
          <div class="flex items-start gap-4">
            <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-2xl font-bold text-white">
              {{ application.candidate?.first_name?.[0] }}{{ application.candidate?.last_name?.[0] }}
            </div>
            <div class="flex-1">
              <h1 class="text-xl font-bold text-slate-900 dark:text-white">
                {{ application.candidate?.first_name }} {{ application.candidate?.last_name }}
              </h1>
              <p class="text-slate-600 dark:text-slate-400">{{ application.candidate?.email }}</p>
              <div class="mt-3 flex gap-2">
                <a :href="`mailto:${application.candidate?.email}`" class="btn-secondary text-sm">Contacter</a>
                <router-link v-if="application.candidate?.id" :to="`/candidates/${application.candidate.id}`" class="btn-secondary text-sm">Voir profil</router-link>
              </div>
            </div>
            <div class="text-right">
              <span :class="getStatusClass(application.status)">{{ getStatusLabel(application.status) }}</span>
              <p class="mt-2 text-sm text-slate-500">Postulé le {{ formatDate(application.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Pipeline -->
        <ApplicationPipeline :current-status="application.status" @update-status="updateStatus" />

        <!-- Job Details -->
        <div class="card-elevated p-6">
          <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Offre concernée</h2>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-slate-900 dark:text-white">{{ application.job?.title }}</p>
              <p class="text-sm text-slate-600 dark:text-slate-400">{{ application.job?.department }} • {{ application.job?.location }}</p>
            </div>
            <router-link :to="`/jobs/${application.job?.id}`" class="text-sm text-brand-600 hover:underline dark:text-brand-400">Voir l'offre →</router-link>
          </div>
        </div>

        <!-- Notes -->
        <div class="card-elevated p-6">
          <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Notes & Évaluation</h2>
          <textarea v-model="notes" rows="4" class="input-field" placeholder="Ajouter des notes sur ce candidat..."></textarea>
          <div class="mt-4 flex justify-end">
            <button class="btn-secondary text-sm" @click="saveNotes">Enregistrer les notes</button>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Assignment -->
        <div class="card-elevated p-4">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-3"> Assigné à</h3>
          <select v-model="application.recruiter_id" class="input-field text-sm" @change="assignRecruiter">
            <option :value="null">Non </option>
            <option v-for="user in recruiters" :key="user.id" :value="user.id">{{ user.first_name }} {{ user.last_name }}</option>
          </select>
        </div>

        <!-- Documents -->
        <div class="card-elevated p-4">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-3">Documents</h3>
          <div v-if="application.cv_url" class="space-y-2">
            <a :href="application.cv_url" target="_blank" class="flex items-center gap-2 text-sm text-brand-600 hover:underline dark:text-brand-400">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              CV (PDF)
            </a>
          </div>
          <p v-else class="text-sm text-slate-500">Aucun document</p>
        </div>

        <!-- Timeline -->
        <div class="card-elevated p-4">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-3">Historique</h3>
          <div class="space-y-3 text-sm">
            <div v-for="(event, i) in timeline" :key="i" class="flex gap-3">
              <div class="h-2 w-2 rounded-full bg-brand-500 mt-1.5"></div>
              <div>
                <p class="text-slate-900 dark:text-white">{{ event.action }}</p>
                <p class="text-slate-500">{{ formatDateTime(event.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-12">
      <BaseLoading />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

const { currentApplication: application, loading } = storeToRefs(applicationsStore)
const { users: recruiters } = storeToRefs(userStore)

const notes = ref('')
const timeline = ref([])

const loadApplication = async () => {
  await applicationsStore.fetchApplication(route.params.id)
  await userStore.fetchUsers()
  // Timeline will be loaded from API when available
  timeline.value = [
    { action: 'Candidature reçue', created_at: application.value?.created_at },
  ]
  notes.value = application.value?.notes || ''
}

const updateStatus = async (newStatus) => {
  await applicationsStore.updateStatus(route.params.id, newStatus)
  timeline.value.unshift({ action: `Statut changé: ${getStatusLabel(newStatus)}`, created_at: new Date().toISOString() })
}

const assignRecruiter = async () => {
  await applicationsStore.assignRecruiter(route.params.id, application.value.recruiter_id)
  const recruiter = recruiters.value.find(r => r.id === application.value.recruiter_id)
  timeline.value.unshift({ action: ` à ${recruiter?.first_name || 'personne'}`, created_at: new Date().toISOString() })
}

const saveNotes = async () => {
  await applicationsStore.addNote(route.params.id, notes.value)
}

const getStatusClass = (status) => {
  const classes = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50',
    reviewing: 'bg-amber-100 text-amber-800',
    interview: 'bg-violet-100 text-violet-800',
    offer: 'bg-brand-100 text-brand-800',
    hired: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-rose-100 text-rose-800'
  }
  return `rounded-full px-3 py-1 text-sm font-medium ${classes[status] || 'bg-slate-100'}`
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
const formatDateTime = (date) => date ? new Date(date).toLocaleString('fr-FR') : '-'

onMounted(() => loadApplication())
</script>
