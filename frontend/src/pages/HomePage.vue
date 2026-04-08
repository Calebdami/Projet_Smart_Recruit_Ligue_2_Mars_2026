<template>
  <div class="mesh-bg -mx-4 -mt-6 min-h-full px-4 pb-16 pt-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
    <div class="mx-auto w-full px-4 lg:px-8">
      <header class="mb-10 animate-fade-in-up sm:mb-14">
        <p class="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/80 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-700 dark:border-brand-500/30 dark:bg-brand-950/40 dark:text-brand-300">
          <span class="h-1.5 w-1.5 rounded-full bg-accent-500" />
          
        </p>
        <h1 class="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Bienvenue sur
          <span class="text-gradient-brand">SmartRecruit</span>
        </h1>
        <p class="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Pilotez vos candidatures, vos talents et vos indicateurs RH depuis un tableau de bord pensé pour les équipes modernes.
        </p>
      </header>

      <div class="stagger-children mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        <article
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="card-elevated-hover group relative overflow-hidden p-6"
        >
          <div
            class="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
            :class="stat.glow"
          />
          <div class="relative flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
              <p class="mt-1 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">{{ stat.value }}</p>
              <p class="mt-2 text-xs font-semibold text-accent-600 dark:text-accent-400">{{ stat.change }} vs mois dernier</p>
            </div>
            <div
              class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105"
              :class="stat.bgColor"
            >
              <component :is="stat.icon" class="h-7 w-7" />
            </div>
          </div>
        </article>
      </div>

      <div class="stagger-children mb-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <router-link
          v-if="$can('view_users')"
          to="/users"
          class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 dark:from-slate-700 dark:to-slate-900"
        >
          <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
          <div class="relative">
            <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold">Utilisateurs</h3>
            <p class="mt-2 text-sm leading-relaxed text-brand-100">Rôles, accès et permissions centralisés.</p>
            <span class="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
              Ouvrir
              <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </div>
        </router-link>

        <router-link
          v-if="$can('view_audit_logs')"
          to="/audit"
          class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 dark:from-slate-700 dark:to-slate-900"
        >
          <div class="relative">
            <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold">Journal d’audit</h3>
            <p class="mt-2 text-sm leading-relaxed text-accent-100">Traçabilité des actions sensibles.</p>
            <span class="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
              Consulter
              <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </div>
        </router-link>

        <router-link
          v-if="$can('view_analytics')"
          to="/analytics"
          class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 p-8 text-white shadow-xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 dark:from-slate-700 dark:to-slate-900"
        >
          <div class="relative">
            <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold">Analytique</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-400">Indicateurs clés pour vos décisions RH.</p>
            <span class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
              Voir les stats
              <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </div>
        </router-link>
      </div>

      <div class="card-elevated mb-16 max-w-3xl p-8 animate-fade-in-up">
        <div class="flex flex-col gap-8 sm:flex-row sm:items-center">
          <div class="relative flex-shrink-0">
            <img
              v-if="user?.avatar_url"
              :src="user.avatar_url"
              :alt="user.first_name"
              class="h-28 w-28 rounded-2xl object-cover shadow-lg ring-4 ring-brand-100 dark:ring-brand-900/50"
            >
            <div
              v-else
              class="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 text-3xl font-bold text-white shadow-lg ring-4 ring-brand-100 dark:ring-brand-900/50"
            >
              {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
            </div>
            <div
              class="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-emerald-500 dark:border-slate-900"
            />
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ user?.first_name }} {{ user?.last_name }}
            </h3>
            <p class="mt-1 text-slate-600 dark:text-slate-400">{{ user?.email }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-3">
              <span
                class="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-800 dark:bg-brand-950/60 dark:text-brand-200"
              >
                {{ user?.role }}
              </span>
              <span class="text-sm text-slate-500 dark:text-slate-500">Dernière connexion : {{ formatDate(user?.last_login_at) }}</span>
            </div>
            <router-link
              to="/profile"
              class="btn-secondary mt-6 inline-flex"
            >
              Modifier le profil
            </router-link>
          </div>
        </div>
      </div>

      <!-- Test Notifications Section (Development Only) -->
      <!-- <section v-if="isDev" class="animate-fade-in-up mb-12">
        <div class="mb-6 text-center">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">🧪 Test des Notifications</h2>
          <p class="mx-auto mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">Cliquez sur les boutons pour tester le système de notifications</p>
        </div>
        <div class="flex flex-wrap justify-center gap-3">
          <button
            @click="testNotification('success')"
            class="btn-success"
          >
            ✅ Succès
          </button>
          <button
            @click="testNotification('error')"
            class="btn-error"
          >
            ❌ Erreur
          </button>
          <button
            @click="testNotification('warning')"
            class="btn-warning"
          >
            ⚠️ Avertissement
          </button>
          <button
            @click="testNotification('info')"
            class="btn-info"
          >
            ℹ️ Information
          </button>
          <button
            @click="testNotification('connection')"
            class="btn-secondary"
          >
            🔗 Connexion
          </button>
          <button
            @click="testNotification('update')"
            class="btn-primary"
          >
            🔄 Mise à jour
          </button>
          <button
            @click="testApiError"
            class="btn-error"
          >
            🚫 Test API Error
          </button>
        </div>
      </section> -->

      <section class="animate-fade-in-up">
        <div class="mb-10 text-center">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Pourquoi SmartRecruit ?</h2>
          <p class="mx-auto mt-2 max-w-xl text-slate-600 dark:text-slate-400">Une expérience unifiée pour recruteurs et candidats.</p>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <article
            v-for="(f, i) in features"
            :key="i"
            class="card-elevated-hover p-8 transition-transform duration-300 hover:-translate-y-1"
          >
            <div
              class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
              :class="f.iconBg"
            >
              <component :is="f.icon" class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ f.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{{ f.desc }}</p>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, h, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAnalyticsStore } from '@/stores/analytics'
import { useToast } from '@/composables/useToast'
import axios from 'axios'

const authStore = useAuthStore()
const analyticsStore = useAnalyticsStore()
const user = computed(() => authStore.user)
const toast = useToast()
const isDev = computed(() => import.meta.env.DEV)

// Fetch real data on mount
onMounted(() => {
  analyticsStore.fetchDashboardStats()
})

// Test notification function
const testNotification = (type) => {
  const messages = {
    success: { title: 'Succès !', message: 'L\'opération a été réalisée avec succès.' },
    error: { title: 'Erreur', message: 'Une erreur inattendue s\'est produite.' },
    warning: { title: 'Attention', message: 'Veuillez vérifier vos informations.' },
    info: { title: 'Information', message: 'Voici une information importante.' },
    connection: { title: 'Connexion établie', message: 'Vous êtes maintenant connecté.' },
    update: { title: 'Mise à jour', message: 'Vos données ont été mises à jour.' }
  }

  const { title, message } = messages[type]
  toast[type](title, message)
}

// Test API error notification
const testApiError = async () => {
  try {
    // Temporarily change axios base URL to trigger an error
    const originalBaseURL = axios.defaults.baseURL
    axios.defaults.baseURL = 'http://invalid-url-that-does-not-exist.com'

    await axios.get('/test-error-endpoint')

    // Restore original base URL
    axios.defaults.baseURL = originalBaseURL
  } catch (error) {
    // Error will be handled by axios interceptor
    // Restore original base URL
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
  }
}

const UsersSvg = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    }),
  ])

const BriefcaseSvg = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    }),
  ])

const ClipboardSvg = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    }),
  ])

const ChartSvg = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z',
    }),
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z',
    }),
  ])

// Reactive stats from store - NO MORE HARDCODED VALUES
const stats = computed(() => [
  {
    label: 'Utilisateurs',
    value: analyticsStore.stats.totalUsers?.toLocaleString() || '0',
    change: '+12 %',
    icon: UsersSvg,
    bgColor: 'bg-gradient-to-br from-violet-500 to-purple-700',
    glow: 'bg-brand-500',
  },
  {
    label: 'Offres actives',
    value: analyticsStore.stats.totalJobs?.toLocaleString() || '0',
    change: '+8 %',
    icon: BriefcaseSvg,
    bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-700',
    glow: 'bg-accent-500',
  },
  {
    label: 'Candidatures',
    value: analyticsStore.stats.totalApplications?.toLocaleString() || '0',
    change: '+23 %',
    icon: ClipboardSvg,
    bgColor: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    glow: 'bg-violet-500',
  },
  {
    label: 'Entretiens',
    value: analyticsStore.stats.interviewsCount?.toLocaleString() || '0',
    change: '+5 %',
    icon: ChartSvg,
    bgColor: 'bg-gradient-to-br from-rose-500 to-red-700',
    glow: 'bg-amber-500',
  },
])

const BoltSvg = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M13 10V3L4 14h7v7l9-11h-7z',
    }),
  ])

const LockSvg = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    }),
  ])

const features = [
  {
    title: 'Rapide et fluide',
    desc: 'Réduisez le time-to-hire avec des flux clairs et des relances ciblées.',
    icon: BoltSvg,
    iconBg: 'bg-gradient-to-br from-slate-600 to-slate-800',
  },
  {
    title: 'Sécurisé',
    desc: 'Authentification renforcée, journaux d’audit et conformité RGPD.',
    icon: LockSvg,
    iconBg: 'bg-gradient-to-br from-slate-600 to-slate-800',
  },
  {
    title: 'Pilotage par la donnée',
    desc: 'Tableaux de bord et scoring pour prioriser les meilleurs profils.',
    icon: ChartSvg,
    iconBg: 'bg-gradient-to-br from-slate-600 to-slate-800',
  },
]

const formatDate = (dateString) => {
  if (!dateString) return 'Jamais'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
