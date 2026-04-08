<template>
  <div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <button 
        @click="goBackSafely" 
        class="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <svg class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour aux offres
      </button>
    </div>

    <h1 class="mb-8 text-3xl font-bold text-slate-900 dark:text-white">Nouvelle offre d'emploi</h1>

    <form class="space-y-8" @submit.prevent="handleSubmit">
      <div class="card-elevated p-6 sm:p-8 space-y-6">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span class="w-1 h-5 bg-brand-500 rounded-full"></span>
          Informations générales
        </h2>
        
        <div>
          <label class="label-field mb-2">Titre du poste</label>
          <input v-model="form.title" type="text" required class="input-field py-3" placeholder="ex: Senior Fullstack Developer">
        </div>

        <div>
          <label class="label-field mb-2">Description</label>
          <textarea v-model="form.description" rows="6" required class="input-field py-3" placeholder="Décrivez les missions, l'équipe, les technos..."></textarea>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="label-field mb-2">Département</label>
            <select v-model="form.department" required class="input-field py-3">
              <option value="">Sélectionner un département</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="hr">RH</option>
              <option value="product">Product</option>
              <option value="design">Design</option>
            </select>
          </div>
          <div>
            <label class="label-field mb-2">Localisation</label>
            <input v-model="form.location" type="text" required class="input-field py-3" placeholder="ex: Paris (75008) / Remote">
          </div>
        </div>
      </div>

      <div class="card-elevated p-6 sm:p-8 space-y-6">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span class="w-1 h-5 bg-violet-500 rounded-full"></span>
          Conditions & Compétences
        </h2>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="label-field mb-2">Type de contrat</label>
            <select v-model="form.contract_type" required class="input-field py-3">
              <option value="">Sélectionner un type</option>
              <option value="full_time">CDI (Temps plein)</option>
              <option value="part_time">CDD / Temps partiel</option>
              <option value="freelance">Freelance / Indépendant</option>
              <option value="internship">Stage / Apprentissage</option>
            </select>
          </div>
          <div>
            <label class="label-field mb-2">Niveau d'expérience</label>
            <select v-model="form.experience_level" required class="input-field py-3">
              <option value="">Sélectionner un niveau</option>
              <option value="junior">Junior (0-2 ans)</option>
              <option value="mid">Confirmé (2-5 ans)</option>
              <option value="senior">Senior (5+ ans)</option>
              <option value="executive">Expert / Cadre</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="label-field mb-2">Fourchette de salaire (min-max)</label>
            <input v-model="form.salary_range" type="text" class="input-field py-3" placeholder="ex: 45k-55k">
            <p class="mt-1.5 text-xs text-slate-500 italic">Laissez vide si non spécifié</p>
          </div>
          <div>
            <label class="label-field mb-2">Compétences clés</label>
            <input v-model="form.skills" type="text" class="input-field py-3" placeholder="React, Tailwind, Node.js...">
            <p class="mt-1.5 text-xs text-slate-500 italic">Séparez les compétences par des virgules</p>
          </div>
        </div>
      </div>

      <div class="card-elevated p-6 sm:p-8">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-slate-200 dark:bg-slate-800">
              <input id="publish" v-model="form.publish_immediately" type="checkbox" class="absolute z-10 w-6 h-6 opacity-0 cursor-pointer peer">
              <span class="absolute top-0.5 left-0.5 w-5 h-5 transition duration-200 ease-in-out bg-white rounded-full shadow peer-checked:translate-x-6 peer-checked:bg-brand-500"></span>
            </div>
            <label for="publish" class="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Publier l'offre immédiatement
            </label>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-3 pt-4">
        <button type="submit" class="btn-primary w-full sm:flex-1 justify-center py-3.5 shadow-lg shadow-brand-500/20" :disabled="isSubmitting">
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Création en cours...' : 'Créer l\'offre d\'emploi' }}
        </button>
        <button 
          type="button" 
          class="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-medium text-slate-600 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white w-full sm:w-auto justify-center" 
          @click="goBackSafely"
        >
          <svg class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Annuler
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'

const router = useRouter()
const jobsStore = useJobsStore()
const isSubmitting = ref(false)

const goBackSafely = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/jobs')
  }
}

const form = ref({
  title: '',
  description: '',
  department: '',
  location: '',
  salary_range: '',
  contract_type: '',
  experience_level: '',
  skills: '',
  publish_immediately: false
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // Parse salary range
    let salary_min = null
    let salary_max = null
    if (form.value.salary_range) {
      const range = form.value.salary_range.replace(/[^\d\-k]/gi, '').toLowerCase()
      const parts = range.split('-')
      if (parts.length === 2) {
        salary_min = parseInt(parts[0].replace('k', '000')) || null
        salary_max = parseInt(parts[1].replace('k', '000')) || null
      }
    }

    // Parse skills
    const skills = form.value.skills ? form.value.skills.split(',').map(s => s.trim()).filter(s => s) : []

    const jobData = {
      title: form.value.title,
      description: form.value.description,
      department: form.value.department,
      location: form.value.location,
      employment_type: form.value.contract_type,
      experience_level: form.value.experience_level,
      salary_min,
      salary_max,
      skills,
      status: form.value.publish_immediately ? 'open' : 'draft'
    }
    const result = await jobsStore.createJob(jobData)
    if (result.success) {
      router.push('/jobs')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
