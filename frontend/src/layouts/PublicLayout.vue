<template>
  <div class="min-h-screen bg-white dark:bg-black">
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-black/80">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-600">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <span class="text-lg font-bold text-slate-900 dark:text-white">SmartRecruit</span>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-6">
            <router-link to="/" class="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
              Accueil
            </router-link>
            <router-link to="/jobs-public" class="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
              Offres d'emploi
            </router-link>
            <router-link to="/about" class="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
              À propos
            </router-link>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <ThemeToggle />
            <router-link to="/login" class="hidden sm:inline-flex btn-secondary text-sm">
              Se connecter
            </router-link>
            <router-link to="/register" class="btn-primary text-sm">
              S'inscrire
            </router-link>
            <!-- Mobile menu button -->
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <svg v-if="!mobileMenuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-slate-200 dark:border-slate-800 py-4">
          <div class="flex flex-col gap-2">
            <router-link to="/" @click="mobileMenuOpen = false" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              Accueil
            </router-link>
            <router-link to="/jobs-public" @click="mobileMenuOpen = false" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              Offres d'emploi
            </router-link>
            <router-link to="/about" @click="mobileMenuOpen = false" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              À propos
            </router-link>
            <div class="border-t border-slate-200 dark:border-slate-800 my-2"></div>
            <router-link to="/login" @click="mobileMenuOpen = false" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              Se connecter
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-600">
                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <span class="text-lg font-bold text-slate-900 dark:text-white">SmartRecruit</span>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              La plateforme de recrutement intelligente qui révolutionne la façon dont vous trouvez les meilleurs talents.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-slate-900 dark:text-white mb-3">Navigation</h3>
            <ul class="space-y-2 text-sm">
              <li><router-link to="/" class="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">Accueil</router-link></li>
              <li><router-link to="/jobs-public" class="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">Offres</router-link></li>
              <li><router-link to="/about" class="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">À propos</router-link></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-slate-900 dark:text-white mb-3">Compte</h3>
            <ul class="space-y-2 text-sm">
              <li><router-link to="/login" class="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">Se connecter</router-link></li>
              <li><router-link to="/register" class="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">S'inscrire</router-link></li>
            </ul>
          </div>
        </div>
        <div class="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-sm text-slate-500">© {{ year }} SmartRecruit. Tous droits réservés.</p>
          <div class="flex gap-4 text-sm">
            <router-link to="/privacy" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Confidentialité</router-link>
            <router-link to="/terms" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">CGU</router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const year = new Date().getFullYear()
const mobileMenuOpen = ref(false)
</script>
