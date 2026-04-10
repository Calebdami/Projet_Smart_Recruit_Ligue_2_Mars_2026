<template>
  <div class="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 dark:from-black dark:via-slate-950 dark:to-black">
    <!-- Background Effects -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-600/10"/>
      <div class="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-accent-400/20 blur-3xl dark:bg-accent-600/10"/>
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-slate-200/80 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-black/50">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <router-link to="/" class="flex items-center gap-2 transition-transform hover:scale-105">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-600">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <span class="text-lg font-bold text-slate-900 dark:text-white">SmartRecruit</span>
          </router-link>
          <div class="flex items-center gap-3">
            <ThemeToggle />
            <router-link to="/" class="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
              ← Retour
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 shadow-lg shadow-brand-500/25">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Accès membre</h1>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Connectez-vous ou créez votre compte</p>
        </div>

        <div class="card-elevated rounded-2xl border border-slate-200/80 p-6 shadow-xl dark:border-slate-700/50 dark:bg-slate-900/80 sm:p-8">
          <slot />
        </div>

        <!-- Quick Links -->
        <div class="mt-8 text-center">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Pas encore de compte ?
            <router-link to="/register" class="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
              S'inscrire gratuitement
            </router-link>
          </p>
          <div class="mt-4 flex justify-center gap-4 text-xs text-slate-400">
            <router-link to="/about" class="hover:text-slate-600 dark:hover:text-slate-300">À propos</router-link>
            <span>•</span>
            <router-link to="/jobs-public" class="hover:text-slate-600 dark:hover:text-slate-300">Offres</router-link>
            <span>•</span>
            <router-link to="/help" class="hover:text-slate-600 dark:hover:text-slate-300">Aide</router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-slate-200/50 bg-white/30 py-6 text-center dark:border-slate-800 dark:bg-black/30">
      <p class="text-xs text-slate-500">
        © {{ year }} SmartRecruit · 
        <router-link to="/privacy" class="hover:text-slate-700 dark:hover:text-slate-300">Confidentialité</router-link> · 
        <router-link to="/terms" class="hover:text-slate-700 dark:hover:text-slate-300">CGU</router-link>
      </p>
    </footer>
  </div>
</template>

<script setup>
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const year = new Date().getFullYear()
</script>
