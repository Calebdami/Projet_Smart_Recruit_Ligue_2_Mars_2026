<template>
  <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <router-link to="/candidates" class="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        ← Retour aux candidatures
      </router-link>
    </div>

    <div v-if="candidate" class="space-y-6">
      <!-- Header -->
      <div class="card-elevated p-6">
        <div class="flex items-start gap-6">
          <div class="h-24 w-24 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-3xl font-bold text-white">
            {{ candidate.first_name?.[0] }}{{ candidate.last_name?.[0] }}
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ candidate.first_name }} {{ candidate.last_name }}</h1>
            <p class="text-slate-600 dark:text-slate-400">{{ candidate.email }}</p>
            <p class="mt-1 text-slate-500">{{ candidate.phone ? candidate.phone : 'Téléphone non renseigné' }}</p>
            <div class="mt-4 flex gap-2">
              <span class="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-800 dark:bg-brand-950/50 dark:text-brand-200">{{ candidate.role }}</span>
              <span v-if="candidate.is_active" class="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">Actif</span>
            </div>
          </div>
          <div class="text-right">
            <div class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <span class="font-bold">{{ candidate.smart_score || 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Bio -->
        <div class="card-elevated p-6">
          <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Bio</h2>
          <p class="text-slate-700 dark:text-slate-300">{{ candidate.bio || 'Aucune bio renseignée.' }}</p>
        </div>

        <!-- Skills -->
        <div class="card-elevated p-6">
          <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Compétences</h2>
          <div v-if="candidate.skills?.length" class="flex flex-wrap gap-2">
            <span v-for="skill in candidate.skills" :key="skill" class="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200">{{ Object.entries(skill).map(([key, value]) => `${key}: ${value}`).join(', ') }}</span>
          </div>
          <p v-else class="text-slate-500">Aucune compétence renseignée.</p>
        </div>
      </div>

      <!-- Applications History -->
      <div class="card-elevated p-6">
        <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Historique des candidatures</h2>
        <div class="space-y-3">
          <div v-for="app in applications" :key="app.id" class="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <div>
              <p class="font-medium text-slate-900 dark:text-white">{{ app.job?.title }}</p>
              <p class="text-sm text-slate-500">Postulé le {{ formatDate(app.created_at) }}</p>
            </div>
            <span :class="getStatusClass(app.status)">{{ getStatusLabel(app.status) }}</span>
          </div>
          <p v-if="!applications.length" class="text-slate-500">Aucune candidature.</p>
        </div>
      </div>

      <!-- CV Section -->
      <div class="card-elevated p-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">CV</h2>
          <div class="flex gap-2">
            <router-link v-if="candidate.cv_url" :to="`/candidates/${candidate.id}/cv`" class="btn-secondary text-sm">Voir le CV</router-link>
            <button class="btn-secondary text-sm" @click="uploadCV">{{ candidate.cv_url ? 'Mettre à jour' : 'Uploader CV' }}</button>
          </div>
        </div>
        <p v-if="!candidate.cv_url" class="mt-2 text-slate-500">Aucun CV uploadé.</p>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-12">
      <BaseLoading />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCandidatesStore } from '@/stores/candidates'
import BaseLoading from '@/components/common/BaseLoading.vue'

const route = useRoute()
const candidatesStore = useCandidatesStore()
const { currentCandidate: candidate, loading } = storeToRefs(candidatesStore)

const applications = ref([])

const loadCandidate = async () => {
  await candidatesStore.fetchCandidate(route.params.id)
  // Load candidate applications from store/service when API is available
  const result = await candidatesStore.fetchCandidateApplications?.(route.params.id)
  applications.value = result?.applications || []
}

const uploadCV = async () => {
  // TODO: Implement file picker and upload
}

const getStatusClass = (status) => {
  const classes = {
    new: 'bg-blue-100 text-blue-800',
    reviewing: 'bg-amber-100 text-amber-800',
    interview: 'bg-violet-100 text-violet-800',
    offer: 'bg-brand-100 text-brand-800',
    hired: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-rose-100 text-rose-800'
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

onMounted(() => loadCandidate())
</script>
