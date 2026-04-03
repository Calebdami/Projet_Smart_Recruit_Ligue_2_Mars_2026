<template>
  <div class="text-center">
    <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
      Bienvenue sur <span class="text-primary-600">SmartRecruit v2.0</span>
    </h1>
    <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
      La plateforme de recrutement prédictif boostée par l'intelligence artificielle.
    </p>
    <div class="mt-10 flex justify-center gap-4">
      <router-link to="/candidates" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
        Gérer les Candidats
      </router-link>
      <router-link to="/jobs" class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
        Voir les Jobs
      </router-link>
    </div>
  </div>
</template>
