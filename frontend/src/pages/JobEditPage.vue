<template>
  <div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <button @click="goBackSafely" class="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        ← Retour à l'offre
      </button>
    </div>

    <h1 class="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Modifier l'offre</h1>

    <form v-if="form" class="card-elevated space-y-6 p-6" @submit.prevent="handleSubmit">
      <div>
        <label class="label-field">Titre du poste</label>
        <input v-model="form.title" type="text" required class="input-field">
      </div>

      <div>
        <label class="label-field">Description</label>
        <textarea v-model="form.description" rows="5" required class="input-field"></textarea>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label class="label-field">Département</label>
          <select v-model="form.department" required class="input-field">
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="hr">RH</option>
          </select>
        </div>
        <div>
          <label class="label-field">Localisation</label>
          <input v-model="form.location" type="text" required class="input-field">
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label class="label-field">Salaire</label>
          <input v-model="form.salary_range" type="text" class="input-field">
        </div>
        <div>
          <label class="label-field">Type de contrat</label>
          <select v-model="form.contract_type" required class="input-field">
            <option value="full_time">CDI</option>
            <option value="part_time">CDD</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Stage</option>
          </select>
        </div>
      </div>

      <div>
        <label class="label-field">Statut</label>
        <select v-model="form.status" required class="input-field">
          <option value="draft">Brouillon</option>
          <option value="open">Publié</option>
          <option value="closed">Clôturé</option>
        </select>
      </div>

      <div class="flex gap-3 pt-4">
        <button type="button" class="btn-secondary" @click="goBackSafely">Annuler</button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">Enregistrement...</span>
          <span v-else>Enregistrer</span>
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
    router.push(`/jobs-internal/${route.params.id}`)
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
      router.push(`/jobs-internal/${route.params.id}`)
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => loadJob())
</script>
