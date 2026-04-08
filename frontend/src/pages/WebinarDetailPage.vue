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
        Retour aux webinaires
      </button>
    </div>

    <div v-if="webinar" class="space-y-6">
      <!-- Header -->
      <div class="card-elevated p-6 sm:p-8">
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-3 mb-4">
              <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                {{ webinar.title }}
              </h1>
              <span :class="getStatusClass(webinar.status)" class="shrink-0">
                {{ getStatusLabel(webinar.status) }}
              </span>
            </div>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              {{ webinar.description }}
            </p>
          </div>
          <div class="flex flex-row md:flex-col gap-3 shrink-0 border-t md:border-t-0 pt-6 md:pt-0 border-slate-100 dark:border-slate-800">
            <button v-if="webinar.status === 'scheduled'" class="btn-primary flex-1 md:w-full justify-center text-sm py-2.5 shadow-lg shadow-brand-500/20" @click="startWebinar">
              Démarrer le direct
            </button>
            <button v-if="webinar.status === 'live'" class="btn-secondary bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900 flex-1 md:w-full justify-center text-sm py-2.5" @click="endWebinar">
              Terminer la session
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Stats Column -->
        <div class="lg:col-span-1 space-y-6">
          <div class="card-elevated p-6">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <span class="w-1 h-5 bg-brand-500 rounded-full"></span>
              Statistiques clés
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <p class="text-2xl font-black text-brand-600 dark:text-brand-400">{{ webinar.registrations_count || 0 }}</p>
                <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Inscrits</p>
              </div>
              <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400">{{ webinar.attendees_count || 0 }}</p>
                <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Présents</p>
              </div>
              <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <p class="text-xl font-bold text-slate-900 dark:text-white">{{ webinar.duration || 0 }} min</p>
                <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Durée</p>
              </div>
              <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ formatDate(webinar.scheduled_at) }}</p>
                <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Date</p>
              </div>
            </div>
          </div>

          <!-- Stream Info -->
          <div class="card-elevated p-6">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <span class="w-1 h-5 bg-violet-500 rounded-full"></span>
              Accès au direct
            </h2>
            <div class="space-y-4">
              <div v-if="webinar.stream_url">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Lien de la visioconférence</label>
                <div class="flex items-center gap-2">
                  <input :value="webinar.stream_url" readonly class="input-field text-xs py-2 bg-slate-50 dark:bg-slate-900/50">
                  <button class="btn-secondary text-xs px-3 py-2" @click="copyLink">Copier</button>
                </div>
              </div>
              <div v-if="webinar.recording_url" class="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Replay disponible</label>
                <a :href="webinar.recording_url" target="_blank" class="flex items-center justify-between p-3 rounded-xl bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300 hover:bg-violet-100 transition-colors">
                  <span class="text-sm font-bold">Voir l'enregistrement</span>
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </a>
              </div>
              <div v-else-if="webinar.status === 'ended'" class="text-center py-4 text-slate-400 italic text-sm">
                L'enregistrement n'est pas encore disponible.
              </div>
            </div>
          </div>
        </div>

        <!-- Registrations Table -->
        <div class="lg:col-span-2">
          <div class="card-elevated overflow-hidden">
            <div class="p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1 h-5 bg-emerald-500 rounded-full"></span>
                Participants inscrits ({{ registrations.length }})
              </h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                <thead class="bg-slate-50/50 dark:bg-slate-900/50">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Nom / Email</th>
                    <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Date d'inscription</th>
                    <th class="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Statut</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="reg in registrations" :key="reg.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td class="px-6 py-4">
                      <p class="text-sm font-bold text-slate-900 dark:text-white">{{ reg.name }}</p>
                      <p class="text-xs text-slate-500">{{ reg.email }}</p>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500">{{ formatDate(reg.created_at) }}</td>
                    <td class="px-6 py-4 text-center">
                      <span v-if="reg.attended" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 text-xs font-bold">
                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Présent
                      </span>
                      <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold">
                        <span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span> Inscrit
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="!registrations.length" class="py-12 text-center text-slate-400 italic">
                Aucun participant n'est encore inscrit à ce webinaire.
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
import { useWebinarsStore } from '@/stores/webinars'
import BaseLoading from '@/components/common/BaseLoading.vue'

const route = useRoute()
const router = useRouter()
const webinarsStore = useWebinarsStore()
const { currentWebinar: webinar, registrations, loading } = storeToRefs(webinarsStore)

const goBackSafely = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/webinars')
  }
}

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
