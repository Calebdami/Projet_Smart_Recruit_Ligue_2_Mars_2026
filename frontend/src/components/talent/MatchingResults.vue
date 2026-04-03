<template>
  <div class="space-y-6">
    <div v-for="match in results" :key="match.id" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
              {{ match.first_name[0] }}{{ match.last_name[0] }}
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ match.first_name }} {{ match.last_name }}</h3>
              <p class="text-sm text-gray-500">{{ match.headline || 'Candidat' }}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-black" :class="getScoreColor(match.match_details.score)">
              {{ match.match_details.score }}%
            </div>
            <p class="text-xs text-gray-400 uppercase tracking-tighter">Score de Match IA</p>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-4 w-full bg-gray-100 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all duration-1000" 
            :class="getScoreBgColor(match.match_details.score)"
            :style="{ width: `${match.match_details.score}%` }"
          ></div>
        </div>

        <!-- Breakdown -->
        <div class="mt-6 grid grid-cols-3 gap-4 border-t border-gray-50 pt-4">
          <div class="text-center">
            <p class="text-xs text-gray-400 uppercase">Compétences</p>
            <p class="font-bold text-gray-700">{{ match.match_details.breakdown.skills.value }}%</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-400 uppercase">Expérience</p>
            <p class="font-bold text-gray-700">{{ match.match_details.breakdown.experience_level.value }}%</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-400 uppercase">Localisation</p>
            <p class="font-bold text-gray-700">{{ match.match_details.breakdown.location.value }}%</p>
          </div>
        </div>

        <div v-if="match.match_details.score > 80" class="mt-4 flex items-center p-2 bg-amber-50 border border-amber-100 rounded text-amber-700 text-xs">
          <Zap class="h-4 w-4 mr-2" />
          Ce candidat a déclenché une alerte automatique par email !
        </div>
      </div>
      <div class="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
        <button class="text-sm text-gray-600 hover:text-gray-900 font-medium">Voir le CV</button>
        <button class="text-sm text-primary-600 hover:text-primary-700 font-bold">Contacter</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Zap } from 'lucide-vue-next'

defineProps({
  results: {
    type: Array,
    required: true
  }
})

const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 50) return 'text-amber-500'
  return 'text-red-500'
}

const getScoreBgColor = (score) => {
  if (score >= 80) return 'bg-green-500'
  if (score >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}
</script>
