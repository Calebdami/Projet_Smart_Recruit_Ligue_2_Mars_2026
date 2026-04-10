<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white">
      <div class="pointer-events-none absolute inset-0 opacity-30">
        <div class="absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl"/>
        <div class="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl"/>
      </div>
      
      <div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm mb-6">
            <span class="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/>
            <span>+500 offres disponibles</span>
          </div>
          <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
            Trouvez votre <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">prochain défi</span>
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Découvrez des opportunités uniques dans le monde professionnel. Notre plateforme intelligente vous connecte aux meilleures entreprises utilisant les dernières avancées en IA et technologie.
          </p>
          <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/jobs-public" class="btn-primary text-base px-8 py-3">
              Explorer les offres
            </router-link>
            <router-link to="/about" class="btn-secondary text-base px-8 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20">
              En savoir plus
            </router-link>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <p class="text-3xl font-bold text-brand-400">{{ stat.value }}</p>
            <p class="mt-1 text-sm text-slate-400">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Jobs Section -->
    <section class="py-20 bg-slate-50 dark:bg-slate-950">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Offres en vedette</h2>
            <p class="mt-2 text-slate-600 dark:text-slate-400">Les meilleures opportunités sélectionnées pour vous</p>
          </div>
          <router-link to="/jobs-public" class="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
            Voir toutes les offres
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <BaseLoading />
        </div>

        <div v-else-if="featuredJobs.length === 0" class="text-center py-12">
          <p class="text-slate-500">Aucune offre disponible pour le moment.</p>
        </div>

        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="job in featuredJobs" :key="job.id" class="card-elevated p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-start justify-between mb-4">
              <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white font-bold text-lg">
                {{ job.title?.charAt(0) }}
              </div>
              <span :class="getJobTypeClass(job.employment_type)">{{ getJobTypeLabel(job.employment_type) }}</span>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white text-lg mb-2">{{ job.title }}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{{ job.description }}</p>
            <div class="flex items-center gap-4 text-sm text-slate-500 mb-4">
              <span class="flex items-center gap-1">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                {{ job.location }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ job.salary_range || 'à négocier' }}
              </span>
            </div>
            <router-link 
              :to="`/jobs/${job.id}`" 
              class="block w-full text-center btn-primary text-sm"
            >
              Voir les détails
            </router-link>
          </div>
        </div>

        <div class="mt-8 text-center sm:hidden">
          <router-link to="/jobs-public" class="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
            Voir toutes les offres
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- AI & Tech Section -->
    <section class="py-20 bg-white dark:bg-black">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-brand-100 dark:bg-brand-950/50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300 mb-4">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Intelligence Artificielle
            </div>
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              L'IA au service de votre carrière
            </h2>
            <p class="text-slate-600 dark:text-slate-400 mb-6">
              Notre technologie d'intelligence artificielle analyse votre profil et vous propose les offres les plus pertinentes. Plus besoin de parcourir des centaines d'annonces : nous trouvons pour vous les opportunités qui correspondent à vos compétences et aspirations.
            </p>
            <ul class="space-y-3">
              <li v-for="feature in aiFeatures" :key="feature" class="flex items-center gap-3">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                  <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </span>
                <span class="text-slate-700 dark:text-slate-300">{{ feature }}</span>
              </li>
            </ul>
          </div>
          <div class="relative">
            <div class="absolute -inset-4 bg-gradient-to-r from-brand-500 to-accent-500 rounded-2xl opacity-20 blur-2xl"/>
            <div class="relative card-elevated p-8">
              <div class="space-y-4">
                <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <div class="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center">
                    <svg class="h-5 w-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                  </div>
                  <div>
                    <p class="font-medium text-slate-900 dark:text-white">Matching intelligent</p>
                    <p class="text-sm text-slate-500">95% de compatibilité</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <div class="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
                    <svg class="h-5 w-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                  </div>
                  <div>
                    <p class="font-medium text-slate-900 dark:text-white">Analyse prédictive</p>
                    <p class="text-sm text-slate-500">Évolution du marché</p>
                  </div>
                </div>
                <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <div class="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                    <svg class="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p class="font-medium text-slate-900 dark:text-white">Réponse instantanée</p>
                    <p class="text-sm text-slate-500">Moins de 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Industries Section -->
    <section class="py-20 bg-slate-50 dark:bg-slate-950">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Secteurs d'activité</h2>
          <p class="mt-2 text-slate-600 dark:text-slate-400">Découvrez les avancées technologiques par industrie</p>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="industry in industries" :key="industry.name" class="card-elevated p-6 text-center hover:shadow-lg transition-shadow">
            <div class="mx-auto mb-4 h-14 w-14 rounded-2xl flex items-center justify-center" :class="industry.bgClass">
              <component :is="industry.icon" class="h-7 w-7" :class="industry.iconClass"/>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white mb-1">{{ industry.name }}</h3>
            <p class="text-sm text-slate-500">{{ industry.jobs }} offres</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-br from-brand-600 to-accent-700 text-white">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-4">Prêt à booster votre carrière ?</h2>
        <p class="text-lg text-brand-100 mb-8">
          Rejoignez des milliers de professionnels qui ont trouvé leur emploi idéal grâce à SmartRecruit.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/register" class="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-white text-brand-600 font-semibold hover:bg-brand-50 transition-colors">
            Créer un compte gratuit
          </router-link>
          <router-link to="/jobs-public" class="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/20">
            Parcourir les offres
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import BaseLoading from '@/components/common/BaseLoading.vue'

const jobsStore = useJobsStore()
const featuredJobs = ref([])
const loading = ref(true)

const stats = [
  { value: '500+', label: 'Offres actives' },
  { value: '200+', label: 'Entreprises' },
  { value: '10k+', label: 'Candidats' },
  { value: '95%', label: 'Taux de satisfaction' }
]

const aiFeatures = [
  'Matching intelligent entre profils et offres',
  'Analyse prédictive des tendances du marché',
  'Suggestions personnalisées basées sur vos compétences',
  'Évaluation automatique des candidatures'
]

const CodeIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' })
])
const ChipIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' })
])
const HeartIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' })
])
const ChartIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
])

const industries = [
  { name: 'Technologie & IA', jobs: '120+', bgClass: 'bg-brand-100 dark:bg-brand-950/50', iconClass: 'text-brand-600 dark:text-brand-400', icon: CodeIcon },
  { name: 'Industrie 4.0', jobs: '85+', bgClass: 'bg-violet-100 dark:bg-violet-950/50', iconClass: 'text-violet-600 dark:text-violet-400', icon: ChipIcon },
  { name: 'Santé & Biotech', jobs: '60+', bgClass: 'bg-rose-100 dark:bg-rose-950/50', iconClass: 'text-rose-600 dark:text-rose-400', icon: HeartIcon },
  { name: 'Finance & Data', jobs: '95+', bgClass: 'bg-emerald-100 dark:bg-emerald-950/50', iconClass: 'text-emerald-600 dark:text-emerald-400', icon: ChartIcon }
]

const getJobTypeClass = (type) => {
  const classes = {
    full_time: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    part_time: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    contract: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    internship: 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400'
  }
  return `rounded-full px-2.5 py-0.5 text-xs font-medium ${classes[type] || 'bg-slate-100 text-slate-700'}`
}

const getJobTypeLabel = (type) => {
  const labels = {
    full_time: 'CDI',
    part_time: 'Temps partiel',
    contract: 'CDD',
    internship: 'Stage'
  }
  return labels[type] || type
}

onMounted(async () => {
  try {
    await jobsStore.fetchJobs({ limit: 6, status: 'published' })
    featuredJobs.value = jobsStore.jobs.slice(0, 6)
  } catch (error) {
    console.error('Failed to load jobs:', error)
  } finally {
    loading.value = false
  }
})
</script>
