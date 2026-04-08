<template>
  <div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <button @click="goBackSafely" class="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        ← Retour aux offres
      </button>
    </div>

    <h1 class="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Nouvelle offre d'emploi</h1>

    <form class="card-elevated space-y-6 p-6" @submit.prevent="handleSubmit">
      <div>
        <label class="label-field">Titre du poste</label>
        <input v-model="form.title" type="text" required class="input-field" placeholder="ex: Senior Developer">
      </div>

      <div>
        <label class="label-field">Description</label>
        <textarea v-model="form.description" rows="5" required class="input-field" placeholder="Décrivez le poste, les responsabilités..."></textarea>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label class="label-field">Département</label>
          <select v-model="form.department" required class="input-field">
            <option value="">Sélectionner...</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="hr">RH</option>
          </select>
        </div>
        <div>
          <label class="label-field">Localisation</label>
          <input v-model="form.location" type="text" required class="input-field" placeholder="ex: Paris, Remote">
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label class="label-field">Salaire (min-max)</label>
          <input v-model="form.salary_range" type="text" class="input-field" placeholder="ex: 60k-80k">
        </div>
        <div>
          <label class="label-field">Type de contrat</label>
          <select v-model="form.contract_type" required class="input-field">
            <option value="">Sélectionner...</option>
            <option value="full_time">CDI</option>
            <option value="part_time">CDD</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Stage</option>
          </select>
        </div>
        <div>
          <label class="label-field">Niveau d'expérience</label>
          <select v-model="form.experience_level" required class="input-field">
            <option value="">Sélectionner...</option>
            <option value="junior">Junior</option>
            <option value="mid">Intermédiaire</option>
            <option value="senior">Senior</option>
            <option value="executive">Cadre</option>
          </select>
        </div>
      </div>

      <div>
        <label class="label-field">Compétences requises</label>
        <input v-model="form.skills" type="text" class="input-field" placeholder="Séparez par des virgules: React, Node.js, Python">
      </div>

      <div class="flex items-center gap-2">
        <input id="publish" v-model="form.publish_immediately" type="checkbox" class="h-4 w-4 rounded border-slate-300">
        <label for="publish" class="text-sm text-slate-700 dark:text-slate-300">Publier immédiatement</label>
      </div>

      <div class="flex gap-3 pt-4">
        <button type="button" class="btn-secondary" @click="goBackSafely">Annuler</button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">Création...</span>
          <span v-else>Créer l'offre</span>
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
