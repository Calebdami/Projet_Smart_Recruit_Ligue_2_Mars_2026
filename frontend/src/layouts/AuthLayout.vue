<template>
  <div class="relative min-h-screen overflow-hidden bg-white dark:bg-black">
    <div
      class="pointer-events-none absolute inset-0 opacity-40 dark:opacity-25"
      aria-hidden="true"
    >
      <div
        class="absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl dark:bg-brand-600/20 animate-float"
      />
      <div
        class="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-accent-400/25 blur-3xl dark:bg-accent-600/15"
        style="animation-delay: -2s"
      />
    </div>

    <div class="absolute right-4 top-4 z-50 sm:right-6 sm:top-6">
      <ThemeToggle />
    </div>

    <div class="relative z-10 flex min-h-screen">
      <div
        class="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 px-10 py-12 text-white lg:flex xl:px-14"
      >
        <div class="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
          <svg class="absolute -right-8 top-24 h-64 w-64 text-white/10" viewBox="0 0 200 200" fill="currentColor">
            <path d="M100 20c44 0 80 36 80 80s-36 80-80 80S20 144 20 100 56 20 100 20zm0 24c-31 0-56 25-56 56s25 56 56 56 56-25 56-56-25-56-56-56z" />
          </svg>
          <svg class="absolute bottom-20 left-8 h-48 w-48 text-accent-400/20" viewBox="0 0 200 200" fill="currentColor">
            <path d="M40 160 L100 40 L160 160 Z" opacity="0.5" />
          </svg>
        </div>

        <div class="relative z-10">
          <router-link to="/" class="inline-flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 shadow-lg shadow-brand-900/40"
            >
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span class="text-xl font-bold tracking-tight">SmartRecruit</span>
          </router-link>
          <p class="mt-3 text-sm font-medium text-brand-200/90">Recrutez les bons talents, plus vite.</p>
        </div>

        <div class="relative z-10 max-w-md animate-fade-in-up">
          <h2 class="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            La plateforme qui aligne candidats et équipes sur vos enjeux RH.
          </h2>
          <p class="mt-6 text-base leading-relaxed text-slate-300">
            Suivi des candidatures, scoring intelligent et traçabilité — tout ce dont vous avez besoin pour un recrutement professionnel.
          </p>

          <ul class="mt-10 space-y-4">
            <li v-for="(item, i) in highlights" :key="i" class="flex items-start gap-3">
              <span
                class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20"
              >
                <component :is="item.icon" class="h-4 w-4 text-accent-300" />
              </span>
              <div>
                <p class="font-semibold text-white">{{ item.title }}</p>
                <p class="text-sm text-slate-400">{{ item.desc }}</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-400">
          <span>© {{ year }} SmartRecruit</span>
          <div class="flex gap-6">
            <router-link to="/privacy" class="transition-colors hover:text-white">Confidentialité</router-link>
            <router-link to="/terms" class="transition-colors hover:text-white">CGU</router-link>
          </div>
        </div>
      </div>

      <div
        class="flex w-full flex-col justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-12 dark:from-black dark:to-black lg:w-1/2 lg:py-0 xl:px-12"
      >
        <div class="mx-auto w-full max-w-md animate-fade-in-up">
          <div class="mb-8 text-center lg:hidden">
            <div
              class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-lg"
            >
              <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">SmartRecruit</h1>
            <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Espace recrutement</p>
          </div>

          <div
            class="card-elevated rounded-3xl border border-slate-200/90 p-6 shadow-soft-lg sm:p-8 dark:border-slate-700/80 dark:shadow-none"
          >
            <slot />
          </div>

          <p class="mt-8 text-center text-xs text-slate-500 dark:text-slate-500">
            © {{ year }} SmartRecruit · Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const year = new Date().getFullYear()

const ShieldIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    }),
  ])

const ChartIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    }),
  ])

const UsersIcon = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'h-full w-full' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    }),
  ])

const highlights = [
  { title: 'Sécurité & conformité', desc: 'Authentification renforcée et journalisation des actions.', icon: ShieldIcon },
  { title: 'Décisions data-driven', desc: 'Indicateurs et scoring pour prioriser les profils.', icon: ChartIcon },
  { title: 'Expérience candidat', desc: 'Parcours fluide du dépôt de CV à l’entretien.', icon: UsersIcon },
]
</script>
