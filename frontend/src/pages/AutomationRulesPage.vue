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

    <!-- Create Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 p-2 backdrop-blur-sm transition-all duration-300 sm:p-4"
      @click.self="showCreateModal = false"
    >
      <div class="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">Nouvelle règle</h2>
          <button
            type="button"
            class="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 transition-all"
            @click="showCreateModal = false"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="createRule" class="flex flex-col max-h-[80vh]">
          <div class="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
            <div class="space-y-1.5">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Nom de la règle</label>
              <input 
                v-model="newRule.name" 
                type="text" 
                required 
                class="input-field w-full py-2.5" 
                placeholder="ex: Notification nouvelle candidature"
              >
            </div>
            
            <div class="space-y-1.5">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Description</label>
              <textarea 
                v-model="newRule.description" 
                rows="2"
                class="input-field w-full py-2.5 resize-none"
                placeholder="Décrivez l'objectif de cette règle..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Événement (Si)</label>
                <select v-model="newRule.trigger" class="input-field w-full py-2.5">
                  <option value="application_received">Candidature reçue</option>
                  <option value="status_changed">Statut modifié</option>
                  <option value="interview_scheduled">Entretien prévu</option>
                  <option value="candidate_hired">Candidat recruté</option>
                </select>
              </div>
              
              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Action (Alors)</label>
                <select v-model="newRule.action" class="input-field w-full py-2.5">
                  <option value="send_email">Envoyer email</option>
                  <option value="assign_recruiter">Assigner recruteur</option>
                  <option value="notify_slack">Notifier Slack</option>
                  <option value="create_task">Créer tâche</option>
                </select>
              </div>
            </div>

            <div class="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 mt-4">
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                La règle sera activée immédiatement après sa création. Vous pourrez la désactiver à tout moment depuis la liste.
              </p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row gap-3">
            <button 
              type="button" 
              class="btn-secondary w-full sm:flex-1 justify-center py-2.5" 
              @click="showCreateModal = false"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="btn-primary w-full sm:flex-1 justify-center py-2.5 shadow-lg shadow-brand-500/20"
            >
              Créer la règle
            </button>
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
