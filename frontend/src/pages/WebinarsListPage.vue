<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Webinaires</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400">Gérez vos événements et formations en ligne.</p>
      </div>
      <router-link v-if="$can('create_webinars')" to="/webinars/new" class="btn-primary">
        Nouveau webinaire
      </router-link>
    </div>

    <!-- Filters -->
    <div class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-black">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <input v-model="filters.search" type="text" placeholder="Rechercher..." class="input-field" @input="debouncedSearch">
        <select v-model="filters.status" class="input-field" @change="loadWebinars">
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="scheduled">Planifié</option>
          <option value="live">En direct</option>
          <option value="ended">Terminé</option>
        </select>
        <input v-model="filters.date" type="date" class="input-field" @change="loadWebinars">
      </div>
    </div>

    <!-- Webinars Grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="webinar in webinars" :key="webinar.id" class="card-elevated overflow-hidden">
        <div class="h-32 bg-gradient-to-br from-brand-500 to-accent-600"></div>
        <div class="p-5">
          <div class="mb-2 flex items-center justify-between">
            <span :class="getStatusClass(webinar.status)">{{ getStatusLabel(webinar.status) }}</span>
            <span class="text-sm text-slate-500">{{ formatDate(webinar.scheduled_at) }}</span>
          </div>
          <h3 class="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{{ webinar.title }}</h3>
          <p class="mb-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{{ webinar.description }}</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm text-slate-500">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              {{ webinar.registrations_count || 0 }} inscrits
            </div>
            <router-link :to="`/webinars/${webinar.id}`" class="text-sm text-brand-600 hover:underline dark:text-brand-400">Gérer →</router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="mt-8 text-center">
      <BaseLoading />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWebinarsStore } from '@/stores/webinars'
import BaseLoading from '@/components/common/BaseLoading.vue'

const webinarsStore = useWebinarsStore()
const { webinars, loading } = storeToRefs(webinarsStore)

const filters = ref({ search: '', status: '', date: '' })

watch(filters, (newFilters) => {
  webinarsStore.filters = { ...webinarsStore.filters, ...newFilters }
}, { deep: true })

let debounceTimer = null
const debouncedSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => loadWebinars(), 300)
}

const loadWebinars = async () => {
  await webinarsStore.fetchWebinars()
}

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800',
    scheduled: 'bg-brand-100 text-brand-700 dark:bg-brand-950/50',
    live: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 animate-pulse',
    ended: 'bg-slate-100 text-slate-500 dark:bg-slate-800'
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

onMounted(() => loadWebinars())
</script>
