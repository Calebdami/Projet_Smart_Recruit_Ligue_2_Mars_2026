<template>
  <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <button @click="goBackSafely" class="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        ← Retour à l'offre
      </button>
    </div>

    <div class="card-elevated p-6">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Postuler à l'offre</h1>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {{ job?.title || 'Chargement...' }}
      </p>

      <div v-if="!job" class="py-10 text-center">
        <BaseLoading />
      </div>

      <form v-else class="mt-6 space-y-6" @submit.prevent="submitApplication">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Lettre de motivation</label>
          <textarea
            v-model="coverLetter"
            rows="8"
            required
            class="input-field"
            placeholder="Présentez votre motivation et votre adéquation avec le poste..."
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Questions de présélection (JSON optionnel)</label>
          <textarea
            v-model="screeningAnswersRaw"
            rows="6"
            class="input-field font-mono text-xs"
            placeholder='{"disponibilite":"immédiate","mobilite":"oui"}'
          />
          <p class="mt-1 text-xs text-slate-500">Laisse vide si non applicable.</p>
        </div>

        <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <h2 class="text-base font-semibold text-slate-900 dark:text-white">CV principal (PDF/Image)</h2>
          <p class="mt-1 text-xs text-slate-500">Ce document sera scanné automatiquement.</p>
          <input type="file" class="mt-3 block w-full text-sm" accept=".pdf,image/png,image/jpeg,image/webp" @change="onResumeChange">
          <p v-if="resumeFile" class="mt-2 text-xs text-slate-600">{{ resumeFile.name }}</p>
        </div>

        <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <h2 class="text-base font-semibold text-slate-900 dark:text-white">Documents complémentaires</h2>
          <p class="mt-1 text-xs text-slate-500">Ajoute tous les fichiers utiles (portfolio, certificats, etc.).</p>
          <input type="file" multiple class="mt-3 block w-full text-sm" accept=".pdf,image/png,image/jpeg,image/webp" @change="onDocumentsChange">
          <ul v-if="documents.length" class="mt-3 list-disc pl-5 text-xs text-slate-600 space-y-1">
            <li v-for="file in documents" :key="`${file.name}-${file.size}`">{{ file.name }}</li>
          </ul>
        </div>

        <div class="flex justify-end gap-3">
          <button type="button" class="btn-secondary" @click="goBackSafely">Annuler</button>
          <button type="submit" class="btn-primary" :disabled="submitting">
            <span v-if="submitting">Soumission en cours...</span>
            <span v-else>Soumettre ma candidature</span>
          </button>
        </div>
      </form>
    </div>

    <div v-if="scanResults.length" class="mt-6 card-elevated p-6">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Résultats de scan des documents</h2>
      <div class="mt-4 space-y-3">
        <div v-for="result in scanResults" :key="result.name" class="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <p class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ result.name }}</p>
          <pre class="mt-2 whitespace-pre-wrap text-xs text-slate-600 dark:text-slate-300">{{ JSON.stringify(result.scan, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import jobsService from '@/services/jobs.service'
import applicationsService from '@/services/applications.service'
import candidatesService from '@/services/candidates.service'
import BaseLoading from '@/components/common/BaseLoading.vue'
import { useNotifications } from '@/composables/useNotifications'

const route = useRoute()
const router = useRouter()
const { success: showSuccess, error: showError } = useNotifications()

const job = ref(null)
const coverLetter = ref('')
const screeningAnswersRaw = ref('')
const resumeFile = ref(null)
const documents = ref([])
const submitting = ref(false)
const scanResults = ref([])

const goBackSafely = () => {
  router.push(`/jobs-internal/${route.params.id}`)
}

const onResumeChange = (event) => {
  resumeFile.value = event.target.files?.[0] || null
}

const onDocumentsChange = (event) => {
  documents.value = Array.from(event.target.files || [])
}

const loadJob = async () => {
  const response = await jobsService.getJob(route.params.id)
  job.value = response.data?.job || response.data
}

const parseScreeningAnswers = () => {
  if (!screeningAnswersRaw.value?.trim()) return {}
  try {
    return JSON.parse(screeningAnswersRaw.value)
  } catch (error) {
    throw new Error('Le JSON des questions de présélection est invalide.')
  }
}

const submitApplication = async () => {
  submitting.value = true
  scanResults.value = []
  try {
    const screeningAnswers = parseScreeningAnswers()

    const applicationResp = await applicationsService.applyForJob({
      job_id: route.params.id,
      cover_letter: coverLetter.value,
      screening_answers: screeningAnswers
    })
    const application = applicationResp.data

    if (resumeFile.value) {
      await candidatesService.uploadMyResume(resumeFile.value)
    }

    for (const file of documents.value) {
      const docResp = await applicationsService.uploadApplicationDocument(application.id, file)
      scanResults.value.push({
        name: file.name,
        scan: docResp.data?.scan_data || {}
      })
    }

    showSuccess('Candidature envoyée avec succès')
    router.push(`/applications/${application.id}`)
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Erreur lors de la soumission'
    showError(message)
  } finally {
    submitting.value = false
  }
}

onMounted(() => loadJob())
</script>
