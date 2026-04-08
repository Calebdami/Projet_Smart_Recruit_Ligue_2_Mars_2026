<template>
  <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <button 
        @click="goBackSafely" 
        class="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <svg class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour au profil
      </button>
    </div>

    <div class="card-elevated p-5 sm:p-8">
      <div class="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
            CV de {{ candidate?.first_name }} {{ candidate?.last_name }}
          </h1>
          <p class="mt-2 text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Visualisation et analyse intelligente du CV
          </p>
        </div>
        <div class="flex flex-row sm:flex-row gap-3 shrink-0 border-t md:border-t-0 pt-6 md:pt-0 border-slate-100 dark:border-slate-800 w-full md:w-auto">
          <a v-if="cvUrl" :href="cvUrl" download class="btn-primary flex-1 md:flex-none justify-center text-sm py-2.5 shadow-lg shadow-brand-500/20">
            <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Télécharger
          </a>
          <button class="btn-secondary flex-1 md:flex-none justify-center text-sm py-2.5" @click="reparseCV">
            <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Ré-analyser
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- PDF Viewer -->
        <div class="space-y-4">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-1 h-5 bg-red-500 rounded-full"></span>
            Aperçu du document
          </h2>
          <div class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 shadow-inner">
            <div v-if="cvUrl" class="aspect-[3/4] w-full bg-white dark:bg-slate-800">
              <iframe :src="cvUrl" class="h-full w-full" frameborder="0"></iframe>
            </div>
            <div v-else class="flex aspect-[3/4] w-full flex-col items-center justify-center text-slate-400">
              <svg class="h-16 w-16 opacity-10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p class="font-medium">Aucun CV disponible pour visualisation</p>
            </div>
          </div>
        </div>

        <!-- Parsed Data -->
        <div class="space-y-6">
          <div class="space-y-4">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="w-1 h-5 bg-brand-500 rounded-full"></span>
              Données extraites par l'IA
            </h2>
            <div class="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30 space-y-4 shadow-sm">
              <dl class="space-y-4 text-sm">
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <dt class="text-slate-500 font-medium">Nom complet</dt>
                  <dd class="text-slate-900 dark:text-white font-bold">{{ parsedData?.name || '-' }}</dd>
                </div>
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <dt class="text-slate-500 font-medium">Email</dt>
                  <dd class="text-slate-900 dark:text-white font-medium">{{ parsedData?.email || '-' }}</dd>
                </div>
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <dt class="text-slate-500 font-medium">Téléphone</dt>
                  <dd class="text-slate-900 dark:text-white font-medium">{{ parsedData?.phone || '-' }}</dd>
                </div>
                <div class="flex items-center justify-between">
                  <dt class="text-slate-500 font-medium">Expérience cumulée</dt>
                  <dd class="text-slate-900 dark:text-white font-bold bg-brand-50 dark:bg-brand-950/30 px-2 py-0.5 rounded text-xs text-brand-700 dark:text-brand-300">
                    {{ parsedData?.experience || '-' }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="space-y-4">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="w-1 h-5 bg-violet-500 rounded-full"></span>
              Compétences détectées
            </h2>
            <div class="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30 shadow-sm">
              <div v-if="parsedData?.skills?.length" class="flex flex-wrap gap-2">
                <span v-for="skill in parsedData.skills" :key="skill" class="px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300 text-xs font-bold border border-violet-100 dark:border-violet-800">
                  {{ skill }}
                </span>
              </div>
              <p v-else class="text-slate-500 text-sm italic text-center py-4">Aucune compétence détectée automatiquement</p>
            </div>
          </div>

          <div class="space-y-4">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="w-1 h-5 bg-amber-500 rounded-full"></span>
              Score de pertinence
            </h2>
            <div class="rounded-2xl border border-slate-100 bg-amber-50/30 p-6 dark:border-slate-800 dark:bg-amber-950/10 shadow-sm">
              <div class="flex items-center gap-4">
                <div class="relative h-16 w-16 shrink-0 flex items-center justify-center">
                  <svg class="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" class="stroke-slate-100 dark:stroke-slate-800" stroke-width="3"></circle>
                    <circle cx="18" cy="18" r="16" fill="none" class="stroke-amber-500" stroke-width="3" :stroke-dasharray="`${matchScore}, 100`" stroke-linecap="round"></circle>
                  </svg>
                  <span class="absolute text-sm font-black text-amber-700 dark:text-amber-400">{{ matchScore }}%</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-bold text-slate-900 dark:text-white">SmartScore IA</p>
                  <p class="text-xs text-slate-500">Score basé sur l'analyse sémantique du profil par rapport au marché.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCandidatesStore } from '@/stores/candidates'
import { useUI } from '@/composables/useUI'

const route = useRoute()
const router = useRouter()
const ui = useUI()
const candidatesStore = useCandidatesStore()
const { currentCandidate: candidate, candidateCV, loading } = storeToRefs(candidatesStore)

const goBackSafely = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push(`/candidates/${route.params.id}`)
  }
}


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
