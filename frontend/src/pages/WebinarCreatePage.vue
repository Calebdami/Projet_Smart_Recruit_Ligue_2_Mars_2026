<template>
  <div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <button 
        @click="goBackSafely" 
        class="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <svg class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour aux webinaires
      </button>
    </div>

    <h1 class="mb-8 text-3xl font-bold text-slate-900 dark:text-white">Nouveau webinaire</h1>

    <form class="space-y-8" @submit.prevent="handleSubmit">
      <div class="card-elevated p-6 sm:p-8 space-y-6">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span class="w-1 h-5 bg-brand-500 rounded-full"></span>
          Informations générales
        </h2>
        
        <div>
          <label class="label-field mb-2">Titre du webinaire</label>
          <input v-model="form.title" type="text" required class="input-field py-3" placeholder="ex: Les secrets du recrutement en 2026">
        </div>

        <div>
          <label class="label-field mb-2">Description</label>
          <textarea v-model="form.description" rows="5" required class="input-field py-3" placeholder="Décrivez le contenu, les intervenants..."></textarea>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="label-field mb-2">Date & Heure de début</label>
            <input v-model="form.scheduled_at" type="datetime-local" required class="input-field py-3">
          </div>
          <div>
            <label class="label-field mb-2">Durée estimée (minutes)</label>
            <input v-model="form.duration" type="number" min="15" class="input-field py-3" placeholder="60">
          </div>
        </div>
      </div>

      <div class="card-elevated p-6 sm:p-8 space-y-6">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span class="w-1 h-5 bg-violet-500 rounded-full"></span>
          Logistique & Accès
        </h2>

        <div>
          <label class="label-field mb-2">Lien de diffusion (Zoom, Meet, Teams...)</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <input v-model="form.stream_url" type="url" class="input-field py-3 pl-10" placeholder="https://zoom.us/j/...">
          </div>
        </div>

        <div>
          <label class="label-field mb-2">Capacité maximale</label>
          <input v-model="form.max_participants" type="number" class="input-field py-3" placeholder="Laissez vide pour illimité">
        </div>

        <div class="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
          <div class="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-slate-200 dark:bg-slate-800">
            <input id="recording" v-model="form.enable_recording" type="checkbox" class="absolute z-10 w-6 h-6 opacity-0 cursor-pointer peer">
            <span class="absolute top-0.5 left-0.5 w-5 h-5 transition duration-200 ease-in-out bg-white rounded-full shadow peer-checked:translate-x-6 peer-checked:bg-brand-500"></span>
          </div>
          <label for="recording" class="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            Enregistrer automatiquement la session
          </label>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-3 pt-4">
        <button type="submit" class="btn-primary w-full sm:flex-1 justify-center py-3.5 shadow-lg shadow-brand-500/20" :disabled="isSubmitting">
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Création en cours...' : 'Planifier le webinaire' }}
        </button>
        <button 
          type="button" 
          class="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-medium text-slate-600 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white w-full sm:w-auto justify-center" 
          @click="goBackSafely"
        >
          <svg class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Annuler
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWebinarsStore } from '@/stores/webinars'

const router = useRouter()
const webinarsStore = useWebinarsStore()
const isSubmitting = ref(false)

const goBackSafely = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/webinars')
  }
}

const form = ref({
  title: '',
  description: '',
  scheduled_at: '',
  duration: 60,
  stream_url: '',
  max_participants: null,
  enable_recording: true
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const result = await webinarsStore.createWebinar(form.value)
    if (result.success) {
      router.push('/webinars')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
