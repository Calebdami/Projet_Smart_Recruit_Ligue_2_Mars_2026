<template>
  <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
    <h1 class="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Règles d'automation</h1>
    <p class="mb-6 text-slate-600 dark:text-slate-400">Automatisez vos workflows de recrutement.</p>

    <!-- Rules List -->
    <div class="space-y-4">
      <div v-for="rule in rules" :key="rule.id" class="card-elevated p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ rule.name }}</h3>
              <span :class="rule.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'" class="rounded-full px-2 py-0.5 text-xs">
                {{ rule.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </div>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{{ rule.description }}</p>

            <div class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                <p class="text-xs text-slate-500 uppercase">Si</p>
                <p class="text-sm text-slate-900 dark:text-white">{{ rule.trigger_condition }}</p>
              </div>
              <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                <p class="text-xs text-slate-500 uppercase">Alors</p>
                <p class="text-sm text-slate-900 dark:text-white">{{ rule.action }}</p>
              </div>
            </div>
          </div>
          <div class="ml-4 flex flex-col gap-2">
            <button class="btn-secondary text-sm" @click="toggleRule(rule)">{{ rule.is_active ? 'Désactiver' : 'Activer' }}</button>
            <button class="text-sm text-rose-600 hover:underline" @click="deleteRule(rule.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Rule Button -->
    <button class="btn-primary mt-6 w-full" @click="showCreateModal = true">
      + Nouvelle règle
    </button>

    <!-- Create Modal (simplified) -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-black">
        <h2 class="mb-4 text-xl font-bold text-slate-900 dark:text-white">Nouvelle règle</h2>
        <form class="space-y-4" @submit.prevent="createRule">
          <div>
            <label class="label-field">Nom</label>
            <input v-model="newRule.name" type="text" required class="input-field" placeholder="ex: Notification nouvelle candidature">
          </div>
          <div>
            <label class="label-field">Description</label>
            <input v-model="newRule.description" type="text" class="input-field">
          </div>
          <div>
            <label class="label-field">Condition (quand)</label>
            <select v-model="newRule.trigger" class="input-field">
              <option value="application_received">Nouvelle candidature reçue</option>
              <option value="status_changed">Changement de statut</option>
              <option value="interview_scheduled">Entretien planifié</option>
              <option value="candidate_hired">Candidat embauché</option>
            </select>
          </div>
          <div>
            <label class="label-field">Action (alors)</label>
            <select v-model="newRule.action" class="input-field">
              <option value="send_email">Envoyer email</option>
              <option value="assign_recruiter">Assigner recruteur</option>
              <option value="notify_slack">Notifier Slack</option>
              <option value="create_task">Créer tâche</option>
            </select>
          </div>
          <div class="flex gap-3 pt-4">
            <button type="button" class="btn-secondary flex-1" @click="showCreateModal = false">Annuler</button>
            <button type="submit" class="btn-primary flex-1">Créer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { automationService } from '@/services'
import { useUI } from '@/composables/useUI'

const ui = useUI()
const rules = ref([])
const showCreateModal = ref(false)
const newRule = ref({
  name: '',
  description: '',
  trigger: 'application_received',
  action: 'send_email'
})

const loadRules = async () => {
  try {
    const result = await automationService.getRules()
    rules.value = result.data?.rules || []
  } catch (err) {
    ui.showError('Erreur', 'Impossible de charger les règles')
  }
}

const toggleRule = async (rule) => {
  try {
    await automationService.toggleRule(rule.id, !rule.is_active)
    rule.is_active = !rule.is_active
  } catch (err) {
    ui.showError('Erreur', 'Impossible de modifier la règle')
  }
}

const deleteRule = async (id) => {
  try {
    await automationService.deleteRule(id)
    rules.value = rules.value.filter(r => r.id !== id)
    ui.showSuccess('Supprimé', 'Règle supprimée avec succès')
  } catch (err) {
    ui.showError('Erreur', 'Impossible de supprimer la règle')
  }
}

const createRule = async () => {
  try {
    const data = {
      name: newRule.value.name,
      description: newRule.value.description,
      trigger_condition: newRule.value.trigger,
      action: newRule.value.action,
      is_active: true
    }
    const result = await automationService.createRule(data)
    if (result.success) {
      rules.value.push(result.data?.rule || data)
      showCreateModal.value = false
      newRule.value = { name: '', description: '', trigger: 'application_received', action: 'send_email' }
      ui.showSuccess('Créé', 'Règle créée avec succès')
    }
  } catch (err) {
    ui.showError('Erreur', 'Impossible de créer la règle')
  }
}

onMounted(() => loadRules())
</script>
