<template>
  <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
    <h1 class="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Templates d'emails</h1>
    <p class="mb-6 text-slate-600 dark:text-slate-400">Gérez les modèles d'emails pour vos communications automatiques.</p>

    <!-- Templates List -->
    <div class="space-y-4">
      <div v-for="template in templates" :key="template.id" class="card-elevated overflow-hidden">
        <div class="flex cursor-pointer items-center justify-between bg-slate-50 p-4 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800" @click="toggleExpand(template)">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-brand-100 p-2 dark:bg-brand-950/50">
              <svg class="h-5 w-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <h3 class="font-semibold text-slate-900 dark:text-white">{{ template.name }}</h3>
              <p class="text-sm text-slate-500">{{ template.category }} • {{ template.subject }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span :class="template.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'" class="rounded-full px-2 py-0.5 text-xs">
              {{ template.is_active ? 'Actif' : 'Inactif' }}
            </span>
            <svg class="h-5 w-5 transform text-slate-400 transition-transform" :class="template.expanded ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>

        <!-- Expanded Content -->
        <div v-if="template.expanded" class="border-t border-slate-200 p-4 dark:border-slate-700">
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Objet</label>
            <input v-model="template.subject" type="text" class="input-field">
          </div>
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Contenu</label>
            <textarea v-model="template.body" rows="8" class="input-field font-mono text-sm"></textarea>
            <p class="mt-1 text-xs text-slate-500">Variables disponibles: {{ template.variables?.join(', ') }}</p>
          </div>
          <div class="flex gap-2">
            <button class="btn-primary text-sm" @click="saveTemplate(template)">Enregistrer</button>
            <button class="btn-secondary text-sm" @click="previewTemplate(template)">Aperçu</button>
            <button class="text-sm text-rose-600 hover:underline" @click="resetTemplate(template)">Réinitialiser</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Template -->
    <button class="btn-primary mt-6 w-full" @click="showCreateModal = true">
      + Nouveau template
    </button>

    <!-- Preview Modal -->
    <div v-if="previewData" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-2xl rounded-2xl bg-white p-6 dark:bg-black">
        <h3 class="mb-4 text-lg font-bold text-slate-900 dark:text-white">Aperçu</h3>
        <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <p class="mb-2 text-sm text-slate-500">Objet: {{ previewData.subject }}</p>
          <div class="whitespace-pre-wrap text-slate-900 dark:text-white">{{ previewData.body }}</div>
        </div>
        <div class="mt-4 flex justify-end">
          <button class="btn-secondary" @click="previewData = null">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { emailTemplatesService } from '@/services'
import { useUI } from '@/composables/useUI'

const ui = useUI()
const templates = ref([])
const previewData = ref(null)

const loadTemplates = async () => {
  try {
    const result = await emailTemplatesService.getTemplates()
    templates.value = (result.data?.templates || []).map(t => ({ ...t, expanded: false }))
  } catch (err) {
    ui.showError('Erreur', 'Impossible de charger les templates')
  }
}

const toggleExpand = (template) => {
  template.expanded = !template.expanded
}

const saveTemplate = async (template) => {
  try {
    const result = await emailTemplatesService.updateTemplate(template.id, template)
    if (result.success) {
      template.expanded = false
      ui.showSuccess('Sauvegardé', 'Template mis à jour')
    }
  } catch (err) {
    ui.showError('Erreur', 'Impossible de sauvegarder le template')
  }
}

const previewTemplate = (template) => {
  previewData.value = {
    subject: template.subject
      .replace(/{{ candidate_name }}/g, 'Jean Dupont')
      .replace(/{{ job_title }}/g, 'Senior Developer')
      .replace(/{{ interview_date }}/g, '20 Avril 2024 à 14h00')
      .replace(/{{ interview_location }}/g, 'Paris 9ème')
      .replace(/{{ candidate_email }}/g, 'jean@email.com')
      .replace(/{{ smart_score }}/g, '85')
      .replace(/{{ application_url }}/g, 'https://app.example.com/applications/123'),
    body: template.body
      .replace(/{{ candidate_name }}/g, 'Jean Dupont')
      .replace(/{{ job_title }}/g, 'Senior Developer')
      .replace(/{{ interview_date }}/g, '20 Avril 2024 à 14h00')
      .replace(/{{ interview_location }}/g, 'Paris 9ème')
      .replace(/{{ candidate_email }}/g, 'jean@email.com')
      .replace(/{{ smart_score }}/g, '85')
      .replace(/{{ application_url }}/g, 'https://app.example.com/applications/123')
  }
}

const resetTemplate = async (template) => {
  try {
    const result = await emailTemplatesService.resetTemplate(template.id)
    if (result.success) {
      Object.assign(template, result.data?.template)
      template.expanded = false
      ui.showSuccess('Réinitialisé', 'Template réinitialisé aux valeurs par défaut')
    }
  } catch (err) {
    ui.showError('Erreur', 'Impossible de réinitialiser le template')
  }
}

onMounted(() => loadTemplates())
</script>
