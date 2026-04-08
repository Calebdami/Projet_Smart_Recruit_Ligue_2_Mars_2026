<template>
  <div class="mx-auto max-w-4xl px-4 py-6 sm:py-10 sm:px-6 lg:px-8 animate-fade-in-up">
    <!-- Page Header -->
    <div class="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">Mon Profil</h1>
        <p class="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400 sm:text-base">Gérez vos informations personnelles et la sécurité de votre compte.</p>
      </div>
      <div class="flex w-fit items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
        <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rôle:</span>
        <span class="text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 px-2 py-0.5 rounded-lg">{{ user?.role }}</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
      <!-- Section 1: Identity & Photo -->
      <section class="card-elevated p-5 sm:p-8">
        <div class="mb-6 flex items-center gap-3 sm:mb-8">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">Identité visuelle</h2>
        </div>

        <div class="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
          <div class="relative shrink-0 group">
            <img
              v-if="user?.avatar || user?.avatar_url"
              :src="user.avatar || user.avatar_url"
              :alt="displayFirst"
              class="h-28 w-28 rounded-3xl object-cover shadow-2xl ring-4 ring-white transition-transform group-hover:scale-105 dark:ring-slate-800 sm:h-32 sm:w-32"
            >
            <div
              v-else
              class="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-accent-600 text-3xl font-black text-white shadow-2xl ring-4 ring-white dark:ring-slate-800 sm:h-32 sm:w-32 sm:text-4xl"
            >
              {{ initials }}
            </div>
            <button 
              type="button" 
              @click="$refs.avatarInput.click()"
              class="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-600 shadow-xl transition-colors hover:bg-brand-500 hover:text-white dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarChange">
          </div>
          <div class="flex-1 text-center space-y-2 sm:text-left">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Votre photo de profil</h3>
            <p class="mx-auto text-sm text-slate-500 sm:mx-0 max-w-[280px] sm:max-w-xs">Elle sera visible par vos collègues et lors de vos interactions sur la plateforme.</p>
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">JPG, PNG ou WebP — Max 5 Mo</p>
          </div>
        </div>
      </section>

      <!-- Section 2: Personal Info -->
      <section class="card-elevated p-5 sm:p-8">
        <div class="mb-6 flex items-center gap-3 sm:mb-8">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-500/20">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">Coordonnées</h2>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          <div class="space-y-2">
            <label class="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Prénom</label>
            <input v-model="formData.firstName" type="text" required class="input-field py-3 text-sm font-bold" placeholder="ex: Jean">
            <p v-if="errors.firstName" class="px-1 text-xs font-bold text-rose-500">{{ errors.firstName }}</p>
          </div>
          <div class="space-y-2">
            <label class="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Nom</label>
            <input v-model="formData.lastName" type="text" required class="input-field py-3 text-sm font-bold" placeholder="ex: Dupont">
            <p v-if="errors.lastName" class="px-1 text-xs font-bold text-rose-500">{{ errors.lastName }}</p>
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label class="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Adresse E-mail</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <input v-model="formData.email" type="email" disabled class="input-field cursor-not-allowed bg-slate-50 py-3 pl-10 text-sm font-bold opacity-80 dark:bg-slate-900">
            </div>
            <p class="px-1 text-[10px] font-medium italic text-slate-400">Contactez un administrateur pour changer votre e-mail.</p>
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label class="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Téléphone</label>
            <input v-model="formData.phone" type="tel" class="input-field py-3 text-sm font-bold" placeholder="+33 6 00 00 00 00">
            <p v-if="errors.phone" class="px-1 text-xs font-bold text-rose-500">{{ errors.phone }}</p>
          </div>
        </div>

        <div class="mt-6 space-y-2 sm:mt-8">
          <label class="px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Bio / Présentation</label>
          <textarea v-model="formData.bio" rows="5" class="input-field resize-none py-3 text-sm font-medium" placeholder="Décrivez votre rôle et votre expertise..."></textarea>
          <p v-if="errors.bio" class="px-1 text-xs font-bold text-rose-500">{{ errors.bio }}</p>
        </div>
      </section>

      <!-- Section 3: Security -->
      <section class="card-elevated p-5 sm:p-8">
        <div class="mb-6 flex items-center gap-3 sm:mb-8">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">Sécurité</h2>
        </div>

        <div class="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/50 sm:p-6">
          <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div class="space-y-1 text-center sm:text-left">
              <h4 class="flex items-center justify-center gap-2 font-bold text-slate-900 dark:text-white sm:justify-start">
                Double authentification (2FA)
                <span v-if="user?.twoFactorEnabled" class="h-2 w-2 rounded-full bg-emerald-500"></span>
              </h4>
              <p class="text-sm text-slate-500">Protégez votre compte avec une application d’authentification.</p>
            </div>
            <button 
              v-if="!user?.twoFactorEnabled"
              type="button" 
              class="btn-primary w-full px-6 py-2.5 text-sm font-bold shadow-lg shadow-brand-500/20 sm:w-auto" 
              @click="setup2FA"
            >
              Activer le 2FA
            </button>
            <button 
              v-else
              type="button" 
              class="btn-secondary w-full border-rose-100 bg-rose-50 px-6 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-400 sm:w-auto" 
              @click="disable2FA"
            >
              Désactiver
            </button>
          </div>
        </div>
      </section>

      <!-- Form Actions -->
      <div class="flex flex-col items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">
        <button type="button" class="btn-secondary w-full px-8 py-3.5 font-bold sm:w-auto" @click="resetForm">
          Réinitialiser
        </button>
        <button type="submit" class="btn-primary w-full px-10 py-3.5 font-bold shadow-xl shadow-brand-500/20 sm:w-auto" :disabled="isSubmitting">
          <svg v-if="isSubmitting" class="-ml-1 mr-3 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useNotifications } from '@/composables/useNotifications'

const authStore = useAuthStore()
const userStore = useUserStore()
const { success: showSuccess, error: showError, info: showInfo } = useNotifications()

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
    showError('Failed to load profile')
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  errors.value = {}

  try {
    await userStore.updateProfile(formData.value)
    showSuccess('Profile updated successfully!')
    await authStore.refreshUser()
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      showError('Failed to update profile')
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
    showError('File size must be less than 5MB')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showError('Please select an image file')
    return
  }

  try {
    const formDataObj = new FormData()
    formDataObj.append('avatar', file)
    await userStore.uploadAvatar(formDataObj)
    showSuccess('Avatar updated successfully!')
    await authStore.refreshUser()
  } catch (error) {
    showError('Failed to upload avatar')
  }
}

const setup2FA = async () => {
  try {
    const setupData = await authStore.setup2FA()
    // In a real app, you'd show a QR code modal here
    showInfo('2FA setup initiated. Check your authenticator app.')
  } catch (error) {
    showError('Failed to setup 2FA')
  }
}

const disable2FA = async () => {
  // In a real app, you'd ask for current 2FA code
  try {
    await authStore.disable2FA('current-code')
    showSuccess('2FA disabled successfully')
    await authStore.refreshUser()
  } catch (error) {
    showError('Failed to disable 2FA')
  }
}

const resetForm = () => {
  loadProfile()
  errors.value = {}
}
</script>