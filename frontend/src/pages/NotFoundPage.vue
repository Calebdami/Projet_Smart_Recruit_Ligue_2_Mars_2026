<template>
  <div
    class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 text-center animate-fade-in-up"
  >
    <div class="relative mb-10">
      <div
        class="absolute inset-0 animate-pulse-soft rounded-full bg-gradient-to-br from-brand-400/30 to-accent-400/30 blur-3xl"
      />
      <div
        class="relative flex h-32 w-32 items-center justify-center rounded-3xl border border-slate-200/80 bg-white shadow-soft-lg dark:border-slate-700 dark:bg-slate-900"
      >
        <svg class="h-16 w-16 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <span
        class="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-sm font-black text-white shadow-lg"
      >
        404
      </span>
    </div>

    <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Page introuvable</h1>
    <p class="mx-auto mt-4 max-w-md text-slate-600 dark:text-slate-400">
      Le lien est peut-être expiré ou l’URL est incorrecte. Revenez au tableau de bord pour poursuivre votre navigation.
    </p>

    <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
      <router-link 
        to="/" 
        class="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-700 hover:scale-105 active:scale-95"
      >
        <svg class="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour à l'accueil
      </router-link>
      <button type="button" class="btn-secondary" @click="$router.back()">Retour</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
void router
</script>
