<template>
  <div class="min-h-screen bg-white dark:bg-black">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-brand-600 to-accent-700 py-16 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-bold sm:text-5xl">Contactez-nous</h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-brand-100">Une question ? Notre équipe est là pour vous aider.</p>
      </div>
    </div>

    <div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Contact Info -->
        <div class="space-y-6">
          <div class="card-elevated p-6">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-950/50">
                <svg class="h-6 w-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <h3 class="font-semibold text-slate-900 dark:text-white">Email</h3>
                <a href="mailto:support@smartrecruit.com" class="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">support@smartrecruit.com</a>
              </div>
            </div>
          </div>

          <div class="card-elevated p-6">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-950/50">
                <svg class="h-6 w-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div>
                <h3 class="font-semibold text-slate-900 dark:text-white">Téléphone</h3>
                <a href="tel:+33123456789" class="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">+33 1 23 45 67 89</a>
              </div>
            </div>
          </div>

          <div class="card-elevated p-6">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-950/50">
                <svg class="h-6 w-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <h3 class="font-semibold text-slate-900 dark:text-white">Adresse</h3>
                <p class="text-slate-600 dark:text-slate-400">123 Avenue des Champs-Élysées<br>75008 Paris, France</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="card-elevated p-6">
          <h2 class="mb-4 text-xl font-bold text-slate-900 dark:text-white">Envoyer un message</h2>
          <form class="space-y-4" @submit.prevent="submitForm">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="label-field">Prénom</label>
                <input v-model="form.firstName" type="text" required class="input-field">
              </div>
              <div>
                <label class="label-field">Nom</label>
                <input v-model="form.lastName" type="text" required class="input-field">
              </div>
            </div>
            <div>
              <label class="label-field">Email</label>
              <input v-model="form.email" type="email" required class="input-field">
            </div>
            <div>
              <label class="label-field">Sujet</label>
              <select v-model="form.subject" required class="input-field">
                <option value="">Sélectionner...</option>
                <option value="support">Support technique</option>
                <option value="sales">Demande commerciale</option>
                <option value="partnership">Partenariat</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label class="label-field">Message</label>
              <textarea v-model="form.message" rows="4" required class="input-field" placeholder="Comment pouvons-nous vous aider ?"></textarea>
            </div>
            <button type="submit" class="btn-primary w-full" :disabled="isSubmitting">
              <span v-if="isSubmitting">Envoi...</span>
              <span v-else>Envoyer le message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { contactService } from '@/services'
import { useUI } from '@/composables/useUI'

const ui = useUI()
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})
const isSubmitting = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  try {
    const result = await contactService.sendMessage(form.value)
    if (result.success) {
      ui.showSuccess('Message envoyé', 'Votre message a été envoyé avec succès !')
      form.value = { firstName: '', lastName: '', email: '', subject: '', message: '' }
    } else {
      ui.showError('Erreur', result.error || 'Une erreur est survenue')
    }
  } catch (err) {
    ui.showError('Erreur', 'Impossible d\'envoyer le message')
  } finally {
    isSubmitting.value = false
  }
}
</script>
