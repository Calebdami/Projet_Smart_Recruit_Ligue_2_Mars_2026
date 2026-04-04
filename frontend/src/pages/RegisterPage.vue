<template>
  <div class="animate-fade-in-up">
    <div class="mb-8 text-center lg:text-left">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Créer un compte</h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Rejoignez SmartRecruit et modernisez votre recrutement</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleRegister">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="group">
          <label for="firstName" class="label-field">Prénom</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg class="h-4 w-4 text-slate-400 group-focus-within:text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input id="firstName" v-model="formData.firstName" type="text" required class="input-field-icon" placeholder="Alex">
          </div>
        </div>
        <div class="group">
          <label for="lastName" class="label-field">Nom</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg class="h-4 w-4 text-slate-400 group-focus-within:text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input id="lastName" v-model="formData.lastName" type="text" required class="input-field-icon" placeholder="Martin">
          </div>
        </div>
      </div>

      <div class="group">
        <label for="email" class="label-field">E-mail professionnel</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg class="h-4 w-4 text-slate-400 group-focus-within:text-brand-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <input id="email" v-model="formData.email" type="email" required class="input-field-icon" placeholder="vous@entreprise.com">
        </div>
      </div>

      <div class="group">
        <label for="password" class="label-field">Mot de passe</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg class="h-4 w-4 text-slate-400 group-focus-within:text-brand-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="input-field-icon pr-11"
            placeholder="8 caractères minimum"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            @click="showPassword = !showPassword"
          >
            <svg v-if="!showPassword" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fill-rule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clip-rule="evenodd"
              />
            </svg>
            <svg v-else class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                clip-rule="evenodd"
              />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          </button>
        </div>
      </div>

      <label class="flex items-start gap-3 pt-1">
        <input
          v-model="formData.agreeTerms"
          type="checkbox"
          required
          class="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
        >
        <span class="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
          J’accepte les
          <router-link to="/terms" class="font-semibold text-brand-600 dark:text-accent-400">CGU</router-link>
          et la
          <router-link to="/privacy" class="font-semibold text-brand-600 dark:text-accent-400">politique de confidentialité</router-link>
          .
        </span>
      </label>

      <button type="submit" :disabled="loading" class="btn-primary mt-2 w-full py-3.5 shadow-lg shadow-brand-500/25">
        <svg
          v-if="loading"
          class="h-5 w-5 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {{ loading ? 'Création…' : 'Créer mon compte' }}
      </button>
    </form>

    <p class="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
      Déjà inscrit ?
      <router-link to="/login" class="font-semibold text-brand-600 dark:text-accent-400">Se connecter</router-link>
    </p>

    <div class="my-8 flex items-center gap-4">
      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-600" />
      <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">ou</span>
      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-600" />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button type="button" class="btn-secondary justify-center py-2.5 text-sm">
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M12.48 10.92v3.28h2.84c.58-1.6 2.1-4.04 2.1-4.04s-.51-.96-2.1-1.58c-.64-.48-1.45-.76-2.84-.76-2.2 0-3.96 1.76-3.96 3.97s1.76 3.97 3.96 3.97c1.91 0 3.05-1.29 3.39-2.02h2.42c-.69 2.26-2.87 3.78-5.81 3.78-3.61 0-6.52-2.91-6.52-6.52S8.87 5.48 12.48 5.48c3.35 0 5.64 2.23 5.97 5.44h-5.97z"
          />
        </svg>
        Google
      </button>
      <button type="button" class="btn-secondary justify-center py-2.5 text-sm">
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.6 11.9h-2.4v8.01h-3v-8.01h-1.9v-2.7h1.9v-1.741c0-1.378.645-3.561 3.678-3.561 1.02 0 1.9.076 2.722.166v2.577h-1.866c-.329 0-.40.165-.40.407v1.194h2.777l-.558 2.7z"
          />
        </svg>
        Facebook
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUI } from '@/composables/useUI'

const router = useRouter()
const authStore = useAuthStore()
const { notify } = useUI()

const showPassword = ref(false)
const loading = ref(false)

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  agreeTerms: false,
})

const handleRegister = async () => {
  if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
    notify('error', 'Veuillez remplir tous les champs')
    return
  }
  if (!formData.agreeTerms) {
    notify('error', 'Veuillez accepter les conditions')
    return
  }
  if (formData.password.length < 8) {
    notify('error', 'Le mot de passe doit contenir au moins 8 caractères')
    return
  }

  loading.value = true
  try {
    if (typeof authStore.register === 'function') {
      await authStore.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })
    } else {
      const { useAuth } = await import('@/composables/useAuth')
      const { register } = useAuth()
      const result = await register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: 'candidate',
      })
      if (!result.success) throw new Error(result.error || 'Inscription impossible')
    }
    notify('success', 'Compte créé.')
    setTimeout(() => router.push('/'), 800)
  } catch (error) {
    notify('error', error.message || 'Inscription impossible.')
  } finally {
    loading.value = false
  }
}
</script>
