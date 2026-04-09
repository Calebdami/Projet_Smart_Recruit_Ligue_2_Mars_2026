<template>
  <footer class="mt-auto border-t border-slate-200/80 bg-white/50 backdrop-blur-md dark:border-slate-800/80 dark:bg-black/50">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div class="flex items-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-brand-500 to-accent-600">
            <span class="text-[10px] font-bold text-white">SR</span>
          </div>
          <span class="text-sm font-semibold text-slate-800 dark:text-slate-200">
            SmartRecruit
          </span>
          <span class="text-xs text-slate-500 dark:text-slate-400">
            © {{ new Date().getFullYear() }}
          </span>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
          <router-link to="/about" class="transition-colors hover:text-brand-600 dark:hover:text-brand-400">À propos</router-link>
          <router-link to="/contact" class="transition-colors hover:text-brand-600 dark:hover:text-brand-400">Contact</router-link>
          <router-link to="/privacy" class="transition-colors hover:text-brand-600 dark:hover:text-brand-400">Confidentialité</router-link>
          <router-link to="/terms" class="transition-colors hover:text-brand-600 dark:hover:text-brand-400">CGU</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// The component is purely presentational
</script>
