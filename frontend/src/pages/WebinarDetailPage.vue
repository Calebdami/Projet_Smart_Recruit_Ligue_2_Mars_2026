<template>
  <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <router-link to="/webinars" class="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        ← Retour aux webinaires
      </router-link>
    </div>

    <div v-if="webinar" class="space-y-6">
      <!-- Header -->
      <div class="card-elevated p-6">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ webinar.title }}</h1>
              <span :class="getStatusClass(webinar.status)">{{ getStatusLabel(webinar.status) }}</span>
            </div>
            <p class="mt-2 text-slate-600 dark:text-slate-400">{{ webinar.description }}</p>
          </div>
          <div class="flex gap-2">
            <button v-if="webinar.status === 'scheduled'" class="btn-primary" @click="startWebinar">Démarrer</button>
            <button v-if="webinar.status === 'live'" class="btn-secondary" @click="endWebinar">Terminer</button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Stats -->
        <div class="card-elevated p-6">
          <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Statistiques</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
              <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ webinar.registrations_count || 0 }}</p>
              <p class="text-sm text-slate-500">Inscrits</p>
            </div>
            <div class="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
              <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ webinar.attendees_count || 0 }}</p>
              <p class="text-sm text-slate-500">Présents</p>
            </div>
            <div class="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
              <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ webinar.duration || 0 }}min</p>
              <p class="text-sm text-slate-500">Durée</p>
            </div>
            <div class="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
              <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ formatDate(webinar.scheduled_at) }}</p>
              <p class="text-sm text-slate-500">Date</p>
            </div>
          </div>
        </div>

        <!-- Stream Info -->
        <div class="card-elevated p-6">
          <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Informations diffusion</h2>
          <div class="space-y-3">
            <div v-if="webinar.stream_url">
              <label class="text-sm text-slate-500">Lien:</label>
              <div class="flex items-center gap-2">
                <input :value="webinar.stream_url" readonly class="input-field text-sm">
                <button class="btn-secondary text-sm" @click="copyLink">Copier</button>
              </div>
            </div>
            <div v-if="webinar.recording_url">
              <label class="text-sm text-slate-500">Enregistrement:</label>
              <a :href="webinar.recording_url" target="_blank" class="text-brand-600 hover:underline dark:text-brand-400">Voir →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Registrations -->
      <div class="card-elevated p-6">
        <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Liste des inscrits ({{ registrations.length }})</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-slate-500">Nom</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-slate-500">Email</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-slate-500">Inscrit le</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-slate-500">Présent</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr v-for="reg in registrations" :key="reg.id">
                <td class="px-4 py-2 text-sm text-slate-900 dark:text-white">{{ reg.name }}</td>
                <td class="px-4 py-2 text-sm text-slate-500">{{ reg.email }}</td>
                <td class="px-4 py-2 text-sm text-slate-500">{{ formatDate(reg.created_at) }}</td>
                <td class="px-4 py-2">
                  <span v-if="reg.attended" class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">Oui</span>
                  <span v-else class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">Non</span>
                </td>
              </tr>
            </tbody>
          </table>
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
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWebinarsStore } from '@/stores/webinars'
import BaseLoading from '@/components/common/BaseLoading.vue'

const route = useRoute()
const webinarsStore = useWebinarsStore()
const { currentWebinar: webinar, registrations, loading } = storeToRefs(webinarsStore)

const loadWebinar = async () => {
  await webinarsStore.fetchWebinar(route.params.id)
  await webinarsStore.fetchRegistrations(route.params.id)
}

const startWebinar = async () => {
  await webinarsStore.startWebinar(route.params.id)
}

const endWebinar = async () => {
  await webinarsStore.endWebinar(route.params.id)
}

const copyLink = () => {
  navigator.clipboard.writeText(webinar.value?.stream_url)
}

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-slate-100',
    scheduled: 'bg-brand-100',
    live: 'bg-rose-100 animate-pulse',
    ended: 'bg-slate-100'
  }
  return `rounded-full px-2.5 py-0.5 text-xs font-medium ${classes[status] || 'bg-slate-100'}`
}

const getStatusLabel = (status) => ({
  draft: 'Brouillon',
  scheduled: 'Planifié',
  live: 'En direct',
  ended: 'Terminé'
}[status] || status)

const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-'

onMounted(() => loadWebinar())
</script>
