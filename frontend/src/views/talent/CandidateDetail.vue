<template>
  <div class="space-y-6">
    <div class="flex items-center space-x-4">
      <button 
        @click="$router.back()" 
        class="inline-flex items-center p-2 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <ArrowLeft class="h-5 w-5" />
      </button>
      <h1 class="text-3xl font-bold text-gray-900">Détails du Talent</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-500">Chargement du profil...</p>
    </div>

    <div v-else-if="candidate" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Profile Card -->
      <div class="lg:col-span-2">
        <CandidateProfile :candidate="candidate" />
      </div>

      <!-- Right Column: Matching & Actions -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Actions</h3>
          <div class="space-y-3">
            <button class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
              <Mail class="h-4 w-4 mr-2" />
              Contacter par email
            </button>
            <button class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
              <Download class="h-4 w-4 mr-2" />
              Télécharger le CV
            </button>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Auto-Matching</h3>
          <p class="text-sm text-gray-500 mb-4">Scores de match calculés automatiquement pour les offres actives.</p>
          <div class="space-y-4">
            <div class="text-center p-4 bg-gray-50 rounded-lg italic text-sm text-gray-400">
              Sélectionnez une offre pour voir le score.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
      <p class="text-gray-500">Candidat introuvable.</p>
      <router-link to="/candidates" class="text-primary-600 hover:text-primary-700 font-bold mt-2 inline-block">Retour à la liste</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Mail, Download } from 'lucide-vue-next'
import CandidateProfile from '@/components/talent/CandidateProfile.vue'
import { candidateService } from '@/services/candidates.service'

const route = useRoute()
const candidate = ref(null)
const loading = ref(true)

const fetchCandidate = async () => {
  loading.value = true
  try {
    const res = await candidateService.getById(route.params.id)
    candidate.value = res.data.data
  } catch (err) {
    console.error('Failed to fetch candidate', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchCandidate())
</script>
