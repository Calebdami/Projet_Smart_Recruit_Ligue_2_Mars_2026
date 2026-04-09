<template>
  <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <button @click="goBackSafely" class="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        ← Retour aux offres
      </button>
    </div>

    <div v-if="job" class="card-elevated p-6">
      <div class="mb-6 flex items-start justify-between">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ job.title }}</h1>
            <span :class="getStatusClass(job.status)">{{ getStatusLabel(job.status) }}</span>
          </div>
          <p class="mt-2 text-slate-600 dark:text-slate-400">{{ job.department }} • {{ job.location }}</p>
        </div>
        <div class="flex gap-2">
          <router-link v-if="$can('update_jobs')" :to="`/jobs/${job.id}/edit`" class="btn-secondary">Modifier</router-link>
          <button v-if="$can('update_jobs') && job.status !== 'closed'" class="btn-secondary" @click="closeJob">Clôturer</button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-6">
          <section>
            <h2 class="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Description</h2>
            <p class="text-slate-700 dark:text-slate-300">{{ job.description }}</p>
          </section>

          <section v-if="job.skills?.length">
            <h2 class="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Compétences requises</h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="skill in job.skills" :key="skill" class="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-800 dark:bg-brand-950/50 dark:text-brand-200">
                {{ skill }}
              </span>
            </div>
          </section>
        </div>

        <div class="space-y-4">
          <div class="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
            <h3 class="font-semibold text-slate-900 dark:text-white">Détails</h3>
            <dl class="mt-3 space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-500">Salaire:</dt>
                <dd class="text-slate-900 dark:text-white">{{ job.salary_min || 'Non spécifié' }} à {{ job.salary_max || 'Non spécifié' }} £</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">Contrat:</dt>
                <dd class="text-slate-900 dark:text-white">{{ job.employment_type === 'full_time' ? 'Temps plein' : 'Temps partiel' || 'Non spécifié' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">Publié le:</dt>
                <dd class="text-slate-900 dark:text-white">{{ formatDate(job.created_at) }}</dd>
              </div>
            </dl>
          </div>

          <div v-if="$can('review_applications')" class="rounded-xl bg-brand-50 p-4 dark:bg-brand-950/30">
            <h3 class="font-semibold text-brand-900 dark:text-brand-200">Candidatures</h3>
            <p class="mt-1 text-2xl font-bold text-brand-700 dark:text-brand-300">{{ job.applications_count || 0 }}</p>
            <router-link :to="`/applications?job_id=${job.id}`" class="mt-2 text-sm text-brand-600 hover:underline dark:text-brand-400">Voir les candidatures →</router-link>
          </div>
          
          <div v-if="!$can('review_applications') && job.status === 'published'" class="rounded-xl border border-brand-100 bg-white p-4 shadow-sm dark:border-brand-900/50 dark:bg-black">
            <h3 class="font-semibold text-slate-900 dark:text-white mb-3">Êtes-vous intéressé(e) ?</h3>
            <button @click="showApplyModal = true" class="btn-primary w-full shadow-md justify-center">Postuler maintenant</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-12">
      <BaseLoading />
    </div>

    <!-- Apply Modal -->
    <div
      v-if="showApplyModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="showApplyModal = false"
    >
      <div class="mx-4 w-full max-w-xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Postuler à cette offre</h2>
          <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" @click="showApplyModal = false">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form @submit.prevent="submitApplication" class="p-6 space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Lettre de motivation</label>
            <textarea
              v-model="coverLetter"
              class="input-field min-h-[160px] resize-y"
              placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
              required
            ></textarea>
            <p class="mt-2 text-xs text-slate-500">Votre profil public et votre score de matching y seront automatiquement attachés. Assurez-vous d'avoir rempli votre profil !</p>
          </div>
          
          <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" class="btn-secondary" @click="showApplyModal = false" :disabled="submitting">Annuler</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              <span v-if="submitting">Envoi en cours...</span>
              <span v-else>Soumettre ma candidature</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useJobsStore } from '@/stores/jobs'
import { useApplicationsStore } from '@/stores/applications'
import { useNotifications } from '@/composables/useNotifications'
import BaseLoading from '@/components/common/BaseLoading.vue'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const applicationsStore = useApplicationsStore()
const { success: showSuccess, error: showError } = useNotifications()

const { currentJob: job, loading } = storeToRefs(jobsStore)

const showApplyModal = ref(false)
const coverLetter = ref('')
const submitting = ref(false)

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
  await jobsStore.closeJob(route.params.id)
}

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800',
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50',
    closed: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50'
  }
  return `rounded-full px-2.5 py-0.5 text-xs font-medium ${classes[status]}`
}

const getStatusLabel = (status) => ({ draft: 'Brouillon', published: 'Publié', closed: 'Clôturé' }[status])
const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-'

const submitApplication = async () => {
  submitting.value = true
  try {
    const result = await applicationsStore.applyForJob({
      job_id: job.value.id,
      cover_letter: coverLetter.value
    })
    
    if (result.success) {
      showSuccess('Candidature envoyée avec succès !')
      showApplyModal.value = false
      coverLetter.value = ''
      router.push('/my-applications')
    } else {
      showError(result.error || 'Erreur lors de la candidature (profil incomplet ?)')
    }
  } catch (error) {
    showError("Une erreur inattendue s'est produite lors de l'envoi")
  } finally {
    submitting.value = false
  }
}

onMounted(() => loadJob())
</script>
