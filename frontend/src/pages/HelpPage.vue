<template>
  <div class="min-h-screen bg-white dark:bg-black">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-brand-600 to-accent-700 py-16 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-bold sm:text-5xl">Centre d'aide</h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-brand-100">Trouvez rapidement les réponses à vos questions.</p>
      </div>
    </div>

    <div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <!-- Search -->
      <div class="mb-12">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Rechercher une question..." class="w-full rounded-2xl border-0 bg-slate-100 px-6 py-4 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400">
          <svg class="absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
      </div>

      <!-- FAQ Categories -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div v-for="category in filteredCategories" :key="category.name" class="card-elevated p-6">
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-950/50">
              <svg class="h-5 w-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="category.icon"></svg>
            </div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">{{ category.name }}</h2>
          </div>
          <div class="space-y-3">
            <div v-for="faq in category.faqs" :key="faq.question">
              <button class="w-full text-left" @click="faq.open = !faq.open">
                <div class="flex items-center justify-between py-2 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                  <span class="font-medium">{{ faq.question }}</span>
                  <svg class="h-4 w-4 transform transition-transform" :class="faq.open ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </button>
              <div v-if="faq.open" class="pb-3 text-sm text-slate-600 dark:text-slate-400">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Still need help -->
      <div class="mt-12 rounded-2xl bg-brand-50 p-8 text-center dark:bg-brand-950/30">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Vous ne trouvez pas votre réponse ?</h2>
        <p class="mt-2 text-slate-600 dark:text-slate-400">Notre équipe support est disponible pour vous aider.</p>
        <router-link to="/contact" class="btn-primary mt-4 inline-block">Contactez-nous</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const categories = ref([
  {
    name: 'Premiers pas',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    faqs: [
      { question: 'Comment créer mon compte ?', answer: 'Cliquez sur "S\'inscrire" et suivez les étapes. Un email de confirmation vous sera envoyé.', open: false },
      { question: 'Comment inviter mon équipe ?', answer: 'Dans Paramètres > Utilisateurs, cliquez sur "Inviter" et entrez les emails de vos collaborateurs.', open: false },
      { question: 'Comment configurer les notifications ?', answer: 'Rendez-vous dans Paramètres > Notifications pour personnaliser vos alertes.', open: false }
    ]
  },
  {
    name: 'Gestion des offres',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
    faqs: [
      { question: 'Comment publier une offre ?', answer: 'Allez dans Offres > Nouvelle offre, remplissez le formulaire et cliquez sur Publier.', open: false },
      { question: 'Comment modifier une offre ?', answer: 'Ouvrez l\'offre concernée et cliquez sur "Modifier" en haut à droite.', open: false },
      { question: 'Peut-on intégrer les offres sur notre site ?', answer: 'Oui ! Utilisez notre API ou le widget embarquable disponible dans Paramètres > Intégrations.', open: false }
    ]
  },
  {
    name: 'Candidatures',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>',
    faqs: [
      { question: 'Comment voir les candidatures ?', answer: 'Accédez à la page Candidatures depuis le menu principal. Filtrez par offre ou statut.', open: false },
      { question: 'Qu\'est-ce que le SmartScore ?', answer: 'C\'est un score IA qui évalue la correspondance entre le candidat et l\'offre basé sur le CV.', open: false },
      { question: 'Comment assigner un recruteur ?', answer: 'Ouvrez une candidature et sélectionnez un recruteur dans le menu déroulant "Assigné à".', open: false }
    ]
  },
  {
    name: 'Compte & Sécurité',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>',
    faqs: [
      { question: 'Comment activer la 2FA ?', answer: 'Dans Paramètres > Sécurité, activez "Double authentification" et scannez le QR code.', open: false },
      { question: 'Comment changer mon mot de passe ?', answer: 'Profil > Modifier le profil > Section Sécurité > Changer le mot de passe.', open: false },
      { question: 'Qui a accès aux données ?', answer: 'Seuls les admins et les recruteurs assignés peuvent voir les candidatures. Tout est traçé dans le journal d\'audit.', open: false }
    ]
  }
])

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  const query = searchQuery.value.toLowerCase()
  return categories.value.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(f => 
      f.question.toLowerCase().includes(query) || 
      f.answer.toLowerCase().includes(query)
    )
  })).filter(cat => cat.faqs.length > 0)
})
</script>
