<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Base de Candidats</h1>
      <button 
        @click="showUpload = !showUpload" 
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
      >
        <Upload class="h-4 w-4 mr-2" />
        {{ showUpload ? 'Annuler l\'upload' : 'Uploader un CV' }}
      </button>
    </div>

    <!-- Upload Section -->
    <div v-if="showUpload" class="transition-all duration-300">
      <CVUpload @parsed="onParsed" />
    </div>

    <!-- Filters & Stats -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex gap-4">
        <input 
          v-model="filters.location" 
          type="text" 
          placeholder="Ville..." 
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
        <select 
          v-model="filters.experience_level"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">Tous niveaux</option>
          <option value="junior">Junior</option>
          <option value="mid">Intermédiaire</option>
          <option value="senior">Senior</option>
        </select>
      </div>
      <div class="text-sm text-gray-500">
        {{ candidates.length }} candidats trouvés
      </div>
    </div>

    <!-- Candidates List -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-500">Chargement des talents...</p>
    </div>

    <div v-else-if="candidates.length > 0" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="candidate in candidates" 
        :key="candidate.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer p-5"
        @click="$router.push(`/candidates/${candidate.id}`)"
      >
        <div class="flex items-center space-x-4 mb-4">
          <div class="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
            {{ candidate.first_name[0] }}{{ candidate.last_name[0] }}
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ candidate.first_name }} {{ candidate.last_name }}</h3>
            <p class="text-sm text-gray-500">{{ candidate.headline || 'Candidat' }}</p>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="skill in getTopSkills(candidate.skills)" 
            :key="skill"
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
          >
            {{ skill }}
          </span>
        </div>

        <div class="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
          <div class="flex items-center">
            <MapPin class="h-3 w-3 mr-1" />
            {{ candidate.location || 'N/C' }}
          </div>
          <div class="flex items-center">
            <Briefcase class="h-3 w-3 mr-1" />
            {{ candidate.years_experience || 0 }} ans exp.
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white p-12 text-center rounded-lg border-2 border-dashed border-gray-200">
      <User class="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 font-medium">Aucun candidat trouvé.</p>
      <button @click="showUpload = true" class="mt-4 text-primary-600 hover:text-primary-700 font-bold">Uploader votre premier CV</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { Upload, MapPin, Briefcase, User } from 'lucide-vue-next'
import CVUpload from '@/components/talent/CVUpload.vue'
import { candidateService } from '@/services/candidates.service'

const candidates = ref([])
const loading = ref(true)
const showUpload = ref(false)
const filters = reactive({
  location: '',
  experience_level: ''
})

const fetchCandidates = async () => {
  loading.ref = true
  try {
    const res = await candidateService.getAll(filters)
    candidates.value = res.data.data
  } catch (err) {
    console.error('Failed to fetch candidates', err)
  } finally {
    loading.value = false
  }
}

const onParsed = (newCandidate) => {
  showUpload.value = false
  fetchCandidates()
}

const getTopSkills = (skills) => {
  if (!skills) return []
  const list = typeof skills === 'string' ? JSON.parse(skills) : skills
  return list.slice(0, 4)
}

watch(filters, () => fetchCandidates())

onMounted(() => fetchCandidates())
</script>
