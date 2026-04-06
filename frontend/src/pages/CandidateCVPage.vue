<template>
  <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <router-link :to="`/candidates/${$route.params.id}`" class="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        ← Retour au profil
      </router-link>
    </div>

    <div class="card-elevated p-6">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">CV de {{ candidate?.first_name }} {{ candidate?.last_name }}</h1>
          <p class="text-slate-600 dark:text-slate-400">Visualisation et analyse du CV</p>
        </div>
        <div class="flex gap-2">
          <a v-if="cvUrl" :href="cvUrl" download class="btn-secondary text-sm">
            <svg class="mr-1 inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Télécharger
          </a>
          <button class="btn-secondary text-sm" @click="reparseCV">Ré-analyser</button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- PDF Viewer -->
        <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 class="mb-3 font-semibold text-slate-900 dark:text-white">Aperçu PDF</h2>
          <div v-if="cvUrl" class="aspect-[3/4] w-full rounded-lg bg-white shadow-sm">
            <iframe :src="cvUrl" class="h-full w-full rounded-lg" frameborder="0"></iframe>
          </div>
          <div v-else class="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
            <p class="text-slate-500">Aucun CV disponible</p>
          </div>
        </div>

        <!-- Parsed Data -->
        <div class="space-y-4">
          <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-black">
            <h3 class="mb-3 font-semibold text-slate-900 dark:text-white">Données extraites</h3>
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-slate-500">Nom:</dt>
                <dd class="text-slate-900 dark:text-white font-medium">{{ parsedData?.name || '-' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">Email:</dt>
                <dd class="text-slate-900 dark:text-white">{{ parsedData?.email || '-' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">Téléphone:</dt>
                <dd class="text-slate-900 dark:text-white">{{ parsedData?.phone || '-' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-slate-500">Expérience:</dt>
                <dd class="text-slate-900 dark:text-white">{{ parsedData?.experience || '-' }}</dd>
              </div>
            </dl>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-black">
            <h3 class="mb-3 font-semibold text-slate-900 dark:text-white">Compétences détectées</h3>
            <div v-if="parsedData?.skills?.length" class="flex flex-wrap gap-2">
              <span v-for="skill in parsedData.skills" :key="skill" class="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-800 dark:bg-brand-950/50 dark:text-brand-200">{{ skill }}</span>
            </div>
            <p v-else class="text-slate-500">Aucune compétence détectée</p>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-black">
            <h3 class="mb-3 font-semibold text-slate-900 dark:text-white">Score de correspondance</h3>
            <div class="flex items-center gap-3">
              <div class="h-3 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                <div class="h-3 rounded-full bg-brand-500" :style="`width: ${matchScore}%`"></div>
              </div>
              <span class="font-bold text-brand-600 dark:text-brand-400">{{ matchScore }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCandidatesStore } from '@/stores/candidates'
import { useUI } from '@/composables/useUI'

const route = useRoute()
const ui = useUI()
const candidatesStore = useCandidatesStore()
const { currentCandidate: candidate, candidateCV, loading } = storeToRefs(candidatesStore)

const cvUrl = ref(null)
const parsedData = ref(null)
const matchScore = ref(0)

const loadCV = async () => {
  await candidatesStore.fetchCandidate(route.params.id)
  const cvResult = await candidatesStore.fetchCandidateCV(route.params.id)
  if (cvResult.success) {
    cvUrl.value = cvResult.cv?.url
    parsedData.value = cvResult.cv?.parsed_data
    matchScore.value = cvResult.cv?.match_score || 0
  }
}

const reparseCV = async () => {
  try {
    const result = await candidatesStore.parseCV(route.params.id)
    if (result.success) {
      parsedData.value = result.data?.parsed_data
      matchScore.value = result.data?.match_score || 0
      ui.showSuccess('Analyse terminée', 'Le CV a été ré-analysé avec succès')
    }
  } catch (err) {
    ui.showError('Erreur', 'Impossible de ré-analyser le CV')
  }
}

onMounted(() => loadCV())
</script>
