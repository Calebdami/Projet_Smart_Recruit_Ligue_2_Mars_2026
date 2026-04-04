<template>
  <div class="mx-auto max-w-3xl animate-fade-in-up pb-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Paramètres du profil</h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Photo, coordonnées et sécurité du compte.</p>
    </div>

    <div class="card-elevated overflow-hidden">
      <div class="panel-header bg-gradient-to-r from-brand-50/50 to-accent-50/30 dark:from-brand-950/30 dark:to-slate-900">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h2 class="font-semibold text-slate-900 dark:text-white">Identité</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Visible par votre organisation</p>
          </div>
        </div>
      </div>

      <form class="space-y-8 p-6 sm:p-8" @submit.prevent="handleSubmit">
        <div>
          <label class="label-field">Photo de profil</label>
          <div class="flex flex-wrap items-center gap-6">
            <img
              v-if="user?.avatar || user?.avatar_url"
              :src="user.avatar || user.avatar_url"
              :alt="displayFirst"
              class="h-24 w-24 rounded-2xl object-cover shadow-md ring-2 ring-brand-100 dark:ring-brand-900/40"
            >
            <div
              v-else
              class="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 text-2xl font-bold text-white shadow-md"
            >
              {{ initials }}
            </div>
            <div>
              <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarChange">
              <button type="button" class="btn-secondary text-sm" @click="$refs.avatarInput.click()">
                Changer la photo
              </button>
              <p class="mt-2 text-xs text-slate-500 dark:text-slate-500">JPG, PNG ou WebP — max 5 Mo</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="firstName" class="label-field">Prénom</label>
            <input id="firstName" v-model="formData.firstName" type="text" required class="input-field">
            <div v-if="errors.firstName" class="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {{ errors.firstName }}
            </div>
          </div>
          <div>
            <label for="lastName" class="label-field">Nom</label>
            <input id="lastName" v-model="formData.lastName" type="text" required class="input-field">
            <div v-if="errors.lastName" class="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {{ errors.lastName }}
            </div>
          </div>
          <div class="sm:col-span-2">
            <label for="email" class="label-field">E-mail</label>
            <input id="email" v-model="formData.email" type="email" disabled class="input-field cursor-not-allowed opacity-80">
            <p class="mt-1.5 text-xs text-slate-500">Modification par un administrateur uniquement.</p>
          </div>
          <div class="sm:col-span-2">
            <label for="phone" class="label-field">Téléphone</label>
            <input id="phone" v-model="formData.phone" type="tel" class="input-field">
            <div v-if="errors.phone" class="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {{ errors.phone }}
            </div>
          </div>
        </div>

        <div>
          <label for="bio" class="label-field">Bio</label>
          <textarea
            id="bio"
            v-model="formData.bio"
            rows="4"
            class="input-field resize-y min-h-[100px]"
            placeholder="Quelques lignes sur votre parcours…"
          />
          <div v-if="errors.bio" class="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {{ errors.bio }}
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 dark:border-slate-700 dark:bg-slate-800/40">
          <div class="mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-brand-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h4 class="font-semibold text-slate-900 dark:text-white">Double authentification (2FA)</h4>
          </div>

          <div v-if="!user?.twoFactorEnabled" class="space-y-4">
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Ajoutez une couche de sécurité avec une application d’authentification.
            </p>
            <button type="button" class="btn-primary" @click="setup2FA">Activer le 2FA</button>
          </div>

          <div v-else class="space-y-4">
            <div class="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <svg class="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-medium">Le 2FA est activé</span>
            </div>
            <button type="button" class="btn-secondary text-rose-600 dark:text-rose-400" @click="disable2FA">
              Désactiver le 2FA
            </button>
          </div>
        </div>

        <div class="flex flex-col-reverse gap-3 border-t border-slate-200/80 pt-6 dark:border-slate-700 sm:flex-row sm:justify-end">
          <button type="button" class="btn-secondary w-full sm:w-auto" @click="resetForm">Annuler</button>
          <button type="submit" class="btn-primary w-full sm:w-auto" :disabled="isSubmitting">
            <span v-if="isSubmitting">Enregistrement…</span>
            <span v-else>Enregistrer</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useNotifications } from '@/composables/useNotifications'

const authStore = useAuthStore()
const userStore = useUserStore()
const { showNotification } = useNotifications()

const user = computed(() => authStore.user)
const avatarInput = ref(null)

const displayFirst = computed(() => user.value?.firstName || user.value?.first_name || 'User')
const initials = computed(() => {
  const u = user.value
  if (!u) return '?'
  const a = (u.firstName || u.first_name || '').charAt(0)
  const b = (u.lastName || u.last_name || '').charAt(0)
  return (a + b).toUpperCase() || '?'
})

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  bio: ''
})

const errors = ref({})
const isSubmitting = ref(false)

onMounted(() => {
  loadProfile()
})

const loadProfile = async () => {
  try {
    const profile = await userStore.getProfile()
    formData.value = {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      bio: profile.bio || ''
    }
  } catch (error) {
    showNotification('Failed to load profile', 'error')
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  errors.value = {}

  try {
    await userStore.updateProfile(formData.value)
    showNotification('Profile updated successfully!', 'success')
    await authStore.refreshUser()
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      showNotification('Failed to update profile', 'error')
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showNotification('File size must be less than 5MB', 'error')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showNotification('Please select an image file', 'error')
    return
  }

  try {
    const formDataObj = new FormData()
    formDataObj.append('avatar', file)
    await userStore.uploadAvatar(formDataObj)
    showNotification('Avatar updated successfully!', 'success')
    await authStore.refreshUser()
  } catch (error) {
    showNotification('Failed to upload avatar', 'error')
  }
}

const setup2FA = async () => {
  try {
    const setupData = await authStore.setup2FA()
    // In a real app, you'd show a QR code modal here
    showNotification('2FA setup initiated. Check your authenticator app.', 'info')
  } catch (error) {
    showNotification('Failed to setup 2FA', 'error')
  }
}

const disable2FA = async () => {
  // In a real app, you'd ask for current 2FA code
  try {
    await authStore.disable2FA('current-code')
    showNotification('2FA disabled successfully', 'success')
    await authStore.refreshUser()
  } catch (error) {
    showNotification('Failed to disable 2FA', 'error')
  }
}

const resetForm = () => {
  loadProfile()
  errors.value = {}
}
</script>