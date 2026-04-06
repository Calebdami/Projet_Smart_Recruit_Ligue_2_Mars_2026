<template>
  <div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
    <h1 class="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Paramètres</h1>

    <div class="space-y-6">
      <!-- General Settings -->
      <div class="card-elevated p-6">
        <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Paramètres généraux</h2>
        <div class="space-y-4">
          <div>
            <label class="label-field">Nom de l'organisation</label>
            <input v-model="settings.organization_name" type="text" class="input-field">
          </div>
          <div>
            <label class="label-field">Email de contact</label>
            <input v-model="settings.contact_email" type="email" class="input-field">
          </div>
          <div>
            <label class="label-field">Fuseau horaire par défaut</label>
            <select v-model="settings.timezone" class="input-field">
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="card-elevated p-6">
        <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
        <div class="space-y-3">
          <label class="flex items-center gap-3">
            <input v-model="settings.email_notifications" type="checkbox" class="h-4 w-4 rounded border-slate-300">
            <span class="text-slate-700 dark:text-slate-300">Recevoir les notifications par email</span>
          </label>
          <label class="flex items-center gap-3">
            <input v-model="settings.slack_notifications" type="checkbox" class="h-4 w-4 rounded border-slate-300">
            <span class="text-slate-700 dark:text-slate-300">Notifications Slack</span>
          </label>
          <div v-if="settings.slack_notifications" class="ml-7">
            <input v-model="settings.slack_webhook" type="url" class="input-field text-sm" placeholder="Webhook URL Slack">
          </div>
        </div>
      </div>

      <!-- Recruiting -->
      <div class="card-elevated p-6">
        <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Recrutement</h2>
        <div class="space-y-4">
          <div>
            <label class="label-field">Délai de réponse automatique (jours)</label>
            <input v-model="settings.auto_reply_delay" type="number" min="1" max="30" class="input-field">
          </div>
          <label class="flex items-center gap-3">
            <input v-model="settings.enable_smart_score" type="checkbox" class="h-4 w-4 rounded border-slate-300">
            <span class="text-slate-700 dark:text-slate-300">Activer le SmartScore IA</span>
          </label>
          <label class="flex items-center gap-3">
            <input v-model="settings.auto_assign_applications" type="checkbox" class="h-4 w-4 rounded border-slate-300">
            <span class="text-slate-700 dark:text-slate-300">Assignation automatique des candidatures</span>
          </label>
        </div>
      </div>

      <!-- Security -->
      <div class="card-elevated p-6">
        <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Sécurité</h2>
        <div class="space-y-4">
          <label class="flex items-center gap-3">
            <input v-model="settings.require_2fa_for_admin" type="checkbox" class="h-4 w-4 rounded border-slate-300">
            <span class="text-slate-700 dark:text-slate-300">2FA obligatoire pour les admins</span>
          </label>
          <div>
            <label class="label-field">Durée de session (heures)</label>
            <input v-model="settings.session_duration" type="number" min="1" max="168" class="input-field">
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <button class="btn-primary" :disabled="isSaving" @click="saveSettings">
          <span v-if="isSaving">Enregistrement...</span>
          <span v-else>Enregistrer les paramètres</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { settingsService } from '@/services'
import { useUI } from '@/composables/useUI'

const ui = useUI()

const settings = ref({
  organization_name: 'SmartRecruit',
  contact_email: 'contact@smartrecruit.com',
  timezone: 'Europe/Paris',
  email_notifications: true,
  slack_notifications: false,
  slack_webhook: '',
  auto_reply_delay: 2,
  enable_smart_score: true,
  auto_assign_applications: false,
  require_2fa_for_admin: true,
  session_duration: 24
})
const isSaving = ref(false)

const loadSettings = async () => {
  try {
    const result = await settingsService.getSettings()
    if (result.success && result.data) {
      settings.value = { ...settings.value, ...result.data }
    }
  } catch (err) {
    console.error('Failed to load settings:', err)
  }
}

const saveSettings = async () => {
  isSaving.value = true
  try {
    const result = await settingsService.updateSettings(settings.value)
    if (result.success) {
      ui.showSuccess('Paramètres sauvegardés', 'Vos paramètres ont été enregistrés avec succès')
    } else {
      ui.showError('Erreur', result.error || 'Impossible de sauvegarder les paramètres')
    }
  } catch (err) {
    ui.showError('Erreur', 'Une erreur est survenue lors de la sauvegarde')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => loadSettings())
</script>
