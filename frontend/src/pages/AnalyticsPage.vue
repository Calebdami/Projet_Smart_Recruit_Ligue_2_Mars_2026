<template>
  <div class="mx-auto max-w-7xl animate-fade-in-up">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Analytique</h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Vue d’ensemble de l’activité recrutement</p>
    </div>

    <div class="stagger-children mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="card in statCards"
        :key="card.key"
        class="card-elevated-hover relative overflow-hidden p-6"
      >
        <div
          class="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-25 blur-2xl"
          :class="card.glow"
        />
        <div class="relative flex items-center gap-4">
          <div
            class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
            :class="card.iconBg"
          >
            <component :is="card.icon" class="h-6 w-6" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ card.label }}</p>
            <p class="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{{ stats[card.key] }}</p>
          </div>
        </div>
      </article>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="card-elevated p-6">
        <h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <svg class="h-5 w-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          Croissance utilisateurs
        </h3>
        <div
          class="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/40"
        >
          <svg class="mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
          <p class="text-center text-sm text-slate-500 dark:text-slate-400">Graphique à connecter à l’API</p>
        </div>
      </div>

      <div class="card-elevated p-6">
        <h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <svg class="h-5 w-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
          </svg>
          Statut des candidatures
        </h3>
        <div
          class="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/40"
        >
          <svg class="mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
          </svg>
          <p class="text-center text-sm text-slate-500 dark:text-slate-400">Répartition par étape du pipeline</p>
        </div>
      </div>
    </div>

    <div class="card-elevated mt-6 overflow-hidden">
      <div class="panel-header bg-slate-50/80 dark:bg-slate-800/40">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Activité récente</h3>
      </div>
      <div class="divide-y divide-slate-100 dark:divide-slate-800">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
        >
          <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white"
          >
            {{ activity.user?.first_name?.charAt(0) }}{{ activity.user?.last_name?.charAt(0) }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm text-slate-900 dark:text-slate-100">
              <span class="font-semibold">{{ activity.user?.first_name }} {{ activity.user?.last_name }}</span>
              {{ activity.description }}
            </p>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-500">{{ formatDateTime(activity.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'

const UsersIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    }),
  ])

const CheckIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    }),
  ])

const JobIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    }),
  ])

const AppIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    }),
  ])

const statCards = computed(() => [
  { key: 'totalUsers', label: 'Utilisateurs', icon: UsersIcon, iconBg: 'bg-gradient-to-br from-brand-500 to-brand-700', glow: 'bg-brand-500' },
  { key: 'activeUsers', label: 'Actifs', icon: CheckIcon, iconBg: 'bg-gradient-to-br from-accent-500 to-accent-700', glow: 'bg-accent-500' },
  { key: 'totalJobs', label: 'Offres', icon: JobIcon, iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600', glow: 'bg-amber-500' },
  { key: 'totalApplications', label: 'Candidatures', icon: AppIcon, iconBg: 'bg-gradient-to-br from-violet-500 to-purple-700', glow: 'bg-violet-500' },
])

const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  totalJobs: 0,
  totalApplications: 0
})

const recentActivity = ref([])

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString()
}

const loadAnalytics = async () => {
  // TODO: Implement API calls
  stats.value = {
    totalUsers: 1234,
    activeUsers: 856,
    totalJobs: 45,
    totalApplications: 789
  }

  recentActivity.value = [
    {
      id: 1,
      user: {
        first_name: 'John',
        last_name: 'Doe'
      },
      description: 'created a new job posting',
      created_at: '2024-03-15T10:30:00Z'
    },
    {
      id: 2,
      user: {
        first_name: 'Jane',
        last_name: 'Smith'
      },
      description: 'applied for Senior Developer position',
      created_at: '2024-03-15T11:45:00Z'
    }
  ]
}

onMounted(() => {
  loadAnalytics()
})
</script>
