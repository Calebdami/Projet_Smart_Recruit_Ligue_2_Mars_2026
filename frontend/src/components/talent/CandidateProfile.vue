<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg" v-if="candidate">
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Profil du Candidat
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Détails personnels et expériences extraites par l'IA.
        </p>
      </div>
      <div v-if="candidate.profile_completion_percentage" class="text-right">
        <div class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
          Complété à {{ candidate.profile_completion_percentage }}%
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y border-gray-200">
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Nom complet</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ candidate.first_name }} {{ candidate.last_name }}
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Titre / Headline</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ candidate.headline || 'Non spécifié' }}
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Email</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ candidate.email }}
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Compétences</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="skill in parsedSkills" 
                :key="skill"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ skill }}
              </span>
            </div>
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Expériences détaillées</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <ul v-if="parsedExperience.length" class="space-y-4">
              <li v-for="(exp, index) in parsedExperience" :key="index" class="border-l-2 border-primary-500 pl-4">
                <div class="font-bold text-gray-900">{{ exp.role }}</div>
                <div class="text-gray-600">{{ exp.company }}</div>
                <div class="text-xs text-gray-400 uppercase tracking-wider">{{ exp.duration }}</div>
              </li>
            </ul>
            <p v-else class="text-gray-400 italic">Aucune expérience extraite</p>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  candidate: {
    type: Object,
    required: true
  }
})

const parsedSkills = computed(() => {
  if (!props.candidate.skills) return []
  return typeof props.candidate.skills === 'string' 
    ? JSON.parse(props.candidate.skills) 
    : props.candidate.skills
})

const parsedExperience = computed(() => {
  if (!props.candidate.experience) return []
  return typeof props.candidate.experience === 'string' 
    ? JSON.parse(props.candidate.experience) 
    : props.candidate.experience
})
</script>
