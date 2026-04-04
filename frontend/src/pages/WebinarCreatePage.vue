<template>
  <div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <router-link to="/webinars" class="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        ← Retour aux webinaires
      </router-link>
    </div>

    <h1 class="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Nouveau webinaire</h1>

    <form class="card-elevated space-y-6 p-6" @submit.prevent="handleSubmit">
      <div>
        <label class="label-field">Titre</label>
        <input v-model="form.title" type="text" required class="input-field" placeholder="ex: Les secrets du recrutement">
      </div>

      <div>
        <label class="label-field">Description</label>
        <textarea v-model="form.description" rows="4" required class="input-field" placeholder="Décrivez le contenu du webinaire..."></textarea>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label class="label-field">Date & Heure</label>
          <input v-model="form.scheduled_at" type="datetime-local" required class="input-field">
        </div>
        <div>
          <label class="label-field">Durée (minutes)</label>
          <input v-model="form.duration" type="number" min="15" class="input-field" placeholder="60">
        </div>
      </div>

      <div>
        <label class="label-field">Lien de diffusion (Zoom/Meet)</label>
        <input v-model="form.stream_url" type="url" class="input-field" placeholder="https://...">
      </div>

      <div>
        <label class="label-field">Nombre max de participants</label>
        <input v-model="form.max_participants" type="number" class="input-field" placeholder="Illimité si vide">
      </div>

      <div class="flex items-center gap-2">
        <input id="recording" v-model="form.enable_recording" type="checkbox" class="h-4 w-4 rounded border-slate-300">
        <label for="recording" class="text-sm text-slate-700 dark:text-slate-300">Activer l'enregistrement</label>
      </div>

      <div class="flex gap-3 pt-4">
        <button type="button" class="btn-secondary" @click="$router.push('/webinars')">Annuler</button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">Création...</span>
          <span v-else>Créer le webinaire</span>
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
