<template>
  <div class="min-h-screen bg-white dark:bg-black">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-brand-600 to-accent-700 py-16 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-bold sm:text-5xl">À propos de SmartRecruit</h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-brand-100">La plateforme de recrutement intelligente qui révolutionne la façon dont vous trouvez les meilleurs talents.</p>
      </div>
    </div>

    <div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <!-- Mission -->
      <section class="mb-16">
        <h2 class="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Notre mission</h2>
        <p class="text-slate-700 dark:text-slate-300 leading-relaxed">
          SmartRecruit a été créé pour simplifier et optimiser le processus de recrutement. Nous croyons que chaque entreprise mérite de trouver les meilleurs talents, et que chaque candidat mérite d'être évalué équitablement. Notre plateforme combine intelligence artificielle et workflows automatisés pour vous faire gagner du temps et améliorer la qualité de vos recrutements.
        </p>
      </section>

      <!-- Features -->
      <section class="mb-16">
        <h2 class="mb-8 text-2xl font-bold text-slate-900 dark:text-white">Ce qui nous différencie</h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div class="card-elevated p-6 text-center">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-950/50">
              <svg class="h-7 w-7 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white">Rapide</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Réduisez votre time-to-hire de 50% avec nos workflows optimisés.</p>
          </div>
          <div class="card-elevated p-6 text-center">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50">
              <svg class="h-7 w-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white">Sécurisé</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">RGPD compliant avec chiffrement de bout en bout et audit complet.</p>
          </div>
          <div class="card-elevated p-6 text-center">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-950/50">
              <svg class="h-7 w-7 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white">Intelligent</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">SmartScore IA pour identifier automatiquement les meilleurs profils.</p>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="mb-16">
        <div class="card-elevated p-8">
          <div class="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <div>
              <p class="text-3xl font-bold text-brand-600 dark:text-brand-400">500+</p>
              <p class="text-sm text-slate-600 dark:text-slate-400">Entreprises</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-brand-600 dark:text-brand-400">10k+</p>
              <p class="text-sm text-slate-600 dark:text-slate-400">Recrutements</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-brand-600 dark:text-brand-400">98%</p>
              <p class="text-sm text-slate-600 dark:text-slate-400">Satisfaction</p>
            </div>
            <div>
              <p class="text-3xl font-bold text-brand-600 dark:text-brand-400">24/7</p>
              <p class="text-sm text-slate-600 dark:text-slate-400">Support</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Team -->
      <section>
        <h2 class="mb-8 text-2xl font-bold text-slate-900 dark:text-white">Notre équipe</h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="member in team" :key="member.name" class="card-elevated p-6 text-center">
            <div class="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-brand-500 to-accent-600"></div>
            <h3 class="font-semibold text-slate-900 dark:text-white">{{ member.name }}</h3>
            <p class="text-sm text-slate-500">{{ member.role }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const team = [
  { name: 'Marie Curie', role: 'CEO & Fondatrice' },
  { name: 'Pierre Durand', role: 'CTO' },
  { name: 'Sophie Martin', role: 'Directrice Produit' }
]
</script>
