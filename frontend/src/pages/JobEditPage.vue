<template>
  <div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="mb-6">
      <router-link :to="`/jobs/${$route.params.id}`" class="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
        ← Retour à l'offre
      </router-link>
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
          <option value="published">Publié</option>
          <option value="closed">Clôturé</option>
        </select>
      </div>

      <div class="flex gap-3 pt-4">
        <button type="button" class="btn-secondary" @click="$router.back()">Annuler</button>
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

const form = ref(null)
const isSubmitting = ref(false)

const loadJob = async () => {
  const result = await jobsStore.fetchJob(route.params.id)
  if (result.success && result.job) {
    form.value = { ...result.job }
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const result = await jobsStore.updateJob(route.params.id, form.value)
    if (result.success) {
      router.push(`/jobs/${route.params.id}`)
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => loadJob())
</script>
