<template>
  <div class="min-h-screen bg-white dark:bg-black">
    <!-- Hero -->
    <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 py-20 text-white">
      <div class="pointer-events-none absolute inset-0 opacity-30">
        <div class="absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl"/>
        <div class="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl"/>
      </div>
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-bold sm:text-5xl">Le futur du recrutement</h1>
        <p class="mx-auto mt-4 max-w-3xl text-lg text-brand-100">
          Découvrez comment l'intelligence artificielle et les avancées technologiques transforment le monde professionnel et la façon dont nous recrutons.
        </p>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <!-- AI & Technology Section -->
      <section class="mb-20">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-brand-100 dark:bg-brand-950/50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300 mb-4">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Intelligence Artificielle
            </div>
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              L'IA révolutionne le monde du travail
            </h2>
            <p class="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Les avancées en intelligence artificielle transforment profondément le marché de l'emploi. De l'automatisation des tâches répétitives à l'analyse prédictive des compétences, l'IA permet aux entreprises de prendre des décisions de recrutement plus éclairées et aux candidats de trouver des opportunités qui correspondent réellement à leur potentiel.
            </p>
            <ul class="space-y-3">
              <li v-for="item in aiHighlights" :key="item" class="flex items-center gap-3">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                  <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </span>
                <span class="text-slate-700 dark:text-slate-300">{{ item }}</span>
              </li>
            </ul>
          </div>
          <div class="relative">
            <div class="absolute -inset-4 bg-gradient-to-r from-brand-500 to-accent-500 rounded-2xl opacity-20 blur-2xl"/>
            <div class="relative grid grid-cols-2 gap-4">
              <div v-for="(stat, i) in techStats" :key="stat.label" class="card-elevated p-6 text-center" :class="i === 1 ? 'mt-8' : ''">
                <p class="text-3xl font-bold text-brand-600 dark:text-brand-400">{{ stat.value }}</p>
                <p class="mt-1 text-sm text-slate-500">{{ stat.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Industries -->
      <section class="mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Les secteurs en transformation</h2>
          <p class="mt-2 text-slate-600 dark:text-slate-400">Découvrez les industries les plus dynamiques et innovantes</p>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="industry in industries" :key="industry.name" class="card-elevated p-6 hover:shadow-lg transition-shadow">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" :class="industry.bgClass">
              <component :is="industry.icon" class="h-7 w-7" :class="industry.iconClass"/>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white mb-2">{{ industry.name }}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">{{ industry.description }}</p>
          </div>
        </div>
      </section>

      <!-- Professional World -->
      <section class="mb-20">
        <div class="card-elevated p-8 lg:p-12">
          <div class="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">Le monde professionnel en 2024</h2>
              <p class="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Le monde du travail connaît des mutations profondes. Le télétravail hybride, les compétences en IA et l'agilité digitale sont devenus essentiels. Les entreprises recherchent des profils capables de s'adapter rapidement et d'innover dans un environnement en constante évolution.
              </p>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="trend in trends" :key="trend" class="flex items-center gap-2">
                  <svg class="h-5 w-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                  <span class="text-sm text-slate-700 dark:text-slate-300">{{ trend }}</span>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <div v-for="(item, i) in professionalInsights" :key="item.title" class="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-white font-bold">
                  {{ i + 1 }}
                </div>
                <div>
                  <h4 class="font-semibold text-slate-900 dark:text-white">{{ item.title }}</h4>
                  <p class="text-sm text-slate-600 dark:text-slate-400">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="mb-20">
        <h2 class="mb-8 text-3xl font-bold text-slate-900 dark:text-white text-center">Pourquoi choisir SmartRecruit</h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div v-for="feature in features" :key="feature.title" class="card-elevated p-6 text-center">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" :class="feature.bgClass">
              <component :is="feature.icon" class="h-7 w-7" :class="feature.iconClass"/>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white">{{ feature.title }}</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{{ feature.desc }}</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="text-center">
        <div class="card-elevated p-8 bg-gradient-to-br from-brand-600 to-accent-700 text-white">
          <h2 class="text-2xl font-bold mb-4">Prêt à rejoindre l'aventure ?</h2>
          <p class="mb-6 text-brand-100">Que vous soyez candidat ou recruteur, découvrez comment SmartRecruit peut transformer votre expérience.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/jobs-public" class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-brand-600 font-semibold hover:bg-brand-50 transition-colors">
              Explorer les offres
            </router-link>
            <router-link to="/register" class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/20">
              Créer un compte
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'

// AI Highlights
const aiHighlights = [
  'Matching intelligent entre profils et offres d\'emploi',
  'Analyse prédictive des compétences recherchées',
  'Automatisation des processus de candidature',
  'Évaluation objective basée sur les données'
]

// Tech Stats
const techStats = [
  { value: '73%', label: 'Des entreprises utilisent l\'IA dans leur recrutement' },
  { value: '40%', label: 'De réduction du time-to-hire' },
  { value: '85%', label: 'Des RH utilisent des outils digitaux' },
  { value: '3x', label: 'Plus d\'efficacité avec l\'automatisation' }
]

// Industry Icons
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
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' })
])

// Industries
const industries = [
  { 
    name: 'Technologie & IA', 
    description: 'Développement logiciel, data science, machine learning et cybersécurité',
    bgClass: 'bg-brand-100 dark:bg-brand-950/50', 
    iconClass: 'text-brand-600 dark:text-brand-400', 
    icon: CodeIcon 
  },
  { 
    name: 'Industrie 4.0', 
    description: 'Automatisation, robotique, IoT et manufacturing intelligent',
    bgClass: 'bg-violet-100 dark:bg-violet-950/50', 
    iconClass: 'text-violet-600 dark:text-violet-400', 
    icon: ChipIcon 
  },
  { 
    name: 'Santé & Biotech', 
    description: 'Recherche médicale, biotechnologie et santé digitale',
    bgClass: 'bg-rose-100 dark:bg-rose-950/50', 
    iconClass: 'text-rose-600 dark:text-rose-400', 
    icon: HeartIcon 
  },
  { 
    name: 'Finance & Fintech', 
    description: 'Banque digitale, blockchain, trading algorithmique',
    bgClass: 'bg-emerald-100 dark:bg-emerald-950/50', 
    iconClass: 'text-emerald-600 dark:text-emerald-400', 
    icon: ChartIcon 
  }
]

// Professional Trends
const trends = [
  'Télétravail hybride',
  'Compétences IA',
  'Agilité digitale',
  'Apprentissage continu',
  'Collaboration à distance',
  'Intrapreneuriat'
]

const professionalInsights = [
  { title: 'Compétences recherchées', desc: 'L\'adaptabilité et la capacité d\'apprentissage surpassent désormais l\'expérience traditionnelle.' },
  { title: 'Marque employeur', desc: 'Les candidats privilégient les entreprises engagées en faveur du bien-être et de la durabilité.' },
  { title: 'Processus digitalisé', desc: 'Le recrutement 100% digital devient la norme, de la candidature à l\'intégration.' }
]

// Features
const BoltIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 10V3L4 14h7v7l9-11h-7z' })
])
const ShieldIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })
])
const BrainIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' })
])

const features = [
  { 
    title: 'Rapide & Efficace', 
    desc: 'Réduisez votre time-to-hire de 50% avec nos workflows optimisés par l\'IA.',
    bgClass: 'bg-brand-100 dark:bg-brand-950/50',
    iconClass: 'text-brand-600 dark:text-brand-400',
    icon: BoltIcon
  },
  { 
    title: 'Sécurisé & Conforme', 
    desc: 'RGPD compliant avec chiffrement de bout en bout et audit complet.',
    bgClass: 'bg-emerald-100 dark:bg-emerald-950/50',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    icon: ShieldIcon
  },
  { 
    title: 'Intelligent & Prédictif', 
    desc: 'SmartScore IA pour identifier automatiquement les meilleurs profils.',
    bgClass: 'bg-violet-100 dark:bg-violet-950/50',
    iconClass: 'text-violet-600 dark:text-violet-400',
    icon: BrainIcon
  }
]
</script>
