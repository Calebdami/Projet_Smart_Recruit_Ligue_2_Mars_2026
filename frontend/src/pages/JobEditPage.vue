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
        Retour à l'offre
      </button>
    </div>

    <h1 class="mb-8 text-3xl font-bold text-slate-900 dark:text-white">Modifier l'offre d'emploi</h1>

    <form v-if="form" class="space-y-8" @submit.prevent="handleSubmit">
      <!-- Section 1: Base Info -->
      <div class="card-elevated p-6 sm:p-8 space-y-6">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span class="w-1 h-5 bg-brand-500 rounded-full"></span>
          Informations principales
        </h2>
        
        <div>
          <label class="label-field mb-2">Titre du poste</label>
          <input v-model="form.title" type="text" required class="input-field py-3">
        </div>

        <div>
          <label class="label-field mb-2">Description</label>
          <textarea v-model="form.description" rows="8" required class="input-field py-3"></textarea>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="label-field mb-2">Département</label>
            <select v-model="form.department" required class="input-field py-3">
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
            <input v-model="form.location" type="text" required class="input-field py-3">
          </div>
        </div>
      </div>

      <!-- Section 2: Details -->
      <div class="card-elevated p-6 sm:p-8 space-y-6">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span class="w-1 h-5 bg-violet-500 rounded-full"></span>
          Conditions & Statut
        </h2>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="label-field mb-2">Salaire (fourchette)</label>
            <input v-model="form.salary_range" type="text" class="input-field py-3" placeholder="ex: 50k-70k">
          </div>
          <div>
            <label class="label-field mb-2">Type de contrat</label>
            <select v-model="form.contract_type" required class="input-field py-3">
              <option value="full_time">CDI</option>
              <option value="part_time">CDD</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Stage</option>
            </select>
          </div>
        </div>

        <div>
          <label class="label-field mb-2">Statut de l'offre</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label class="relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all"
                   :class="form.status === 'draft' ? 'border-slate-500 bg-slate-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'">
              <input type="radio" v-model="form.status" value="draft" class="sr-only">
              <span class="text-sm font-medium">Brouillon</span>
            </label>
            <label class="relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all"
                   :class="form.status === 'open' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-brand-300'">
              <input type="radio" v-model="form.status" value="open" class="sr-only">
              <span class="text-sm font-medium">Publié</span>
            </label>
            <label class="relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all"
                   :class="form.status === 'closed' ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-rose-300'">
              <input type="radio" v-model="form.status" value="closed" class="sr-only">
              <span class="text-sm font-medium">Clôturé</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center gap-3 pt-4">
        <button type="submit" class="btn-primary w-full sm:flex-1 justify-center py-3.5 shadow-lg shadow-brand-500/20" :disabled="isSubmitting">
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Enregistrement...' : 'Mettre à jour l\'offre' }}
        </button>
        <button 
          type="button" 
          class="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-medium text-slate-600 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white w-full sm:w-auto justify-center" 
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()

const goBackSafely = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push(`/jobs/${route.params.id}`)
  }
}

const form = ref(null)
const isSubmitting = ref(false)

const formatSalaryRange = (min, max) => {
  if (min == null && max == null) return ''
  if (min == null) return `${max}`
  if (max == null) return `${min}`
  return `${min}-${max}`
}

const parseSalaryRange = (range) => {
  let salary_min = null
  let salary_max = null
  if (range) {
    const sanitized = range.replace(/[^\d\-k]/gi, '').toLowerCase()
    const parts = sanitized.split('-')
    if (parts.length === 2) {
      salary_min = parseInt(parts[0].replace('k', '000')) || null
      salary_max = parseInt(parts[1].replace('k', '000')) || null
    }
  }
  return { salary_min, salary_max }
}

const loadJob = async () => {
  const result = await jobsStore.fetchJob(route.params.id)
  if (result.success && result.job) {
    form.value = {
      title: result.job.title || '',
      description: result.job.description || '',
      department: result.job.department || '',
      location: result.job.location || '',
      contract_type: result.job.employment_type || '',
      salary_range: formatSalaryRange(result.job.salary_min, result.job.salary_max),
      status: result.job.status || 'draft'
    }
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const { salary_min, salary_max } = parseSalaryRange(form.value.salary_range)
    const payload = {
      title: form.value.title,
      description: form.value.description,
      department: form.value.department,
      location: form.value.location,
      employment_type: form.value.contract_type,
      status: form.value.status,
      salary_min,
      salary_max,
    }

    const result = await jobsStore.updateJob(route.params.id, payload)
    if (result.success) {
      router.push(`/jobs/${route.params.id}`)
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => loadJob())
</script>
