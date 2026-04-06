<template>
  <div class="animate-fade-in-up">
    <div class="mb-8 text-center lg:text-left">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Bon retour</h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Connectez-vous à votre espace SmartRecruit</p>
    </div>

    <form class="space-y-5" @submit.prevent="handleLogin">
      <div class="group">
        <label for="email" class="label-field">Adresse e-mail</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg
              class="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-brand-500 dark:group-focus-within:text-accent-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="vous@entreprise.com"
            required
            class="input-field-icon"
          >
        </div>
      </div>

      <div class="group">
        <label for="password" class="label-field">Mot de passe</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg
              class="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-brand-500 dark:group-focus-within:text-accent-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
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
            placeholder="••••••••"
            required
            class="input-field-icon pr-11"
          >
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
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
                d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.91 9.91 0 00-4.872 1.223l-2.48-2.48zM2.458 10C3.732 14.057 7.522 17 12 17c.528 0 1.037-.054 1.526-.152l-1.341-1.341A4 4 0 018.586 10l-2-2L4.793 6.793l-2.335-2.335z"
                clip-rule="evenodd"
              />
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2">
        <label class="flex cursor-pointer items-center gap-2">
          <input
            v-model="formData.rememberMe"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-black"
          >
          <span class="text-sm font-medium text-slate-600 dark:text-slate-400">Se souvenir de moi</span>
        </label>
        <router-link
          to="/forgot-password"
          class="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-accent-400 dark:hover:text-accent-300"
        >
          Mot de passe oublié ?
        </router-link>
      </div>

      <button type="submit" :disabled="loading" class="btn-primary w-full py-3.5 text-base shadow-lg shadow-brand-500/25">
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
        {{ loading ? 'Connexion…' : 'Se connecter' }}
      </button>
    </form>

    <p class="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
      Pas encore de compte ?
      <router-link
        to="/register"
        class="font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-accent-400"
      >
        Créer un compte
      </router-link>
    </p>

    <div class="my-8 flex items-center gap-4">
      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-600" />
      <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">ou</span>
      <div class="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-600" />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button
        type="button"
        class="btn-secondary justify-center py-2.5 text-sm"
      >
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M12.48 10.92v3.28h2.84c.58-1.6 2.1-4.04 2.1-4.04s-.51-.96-2.1-1.58c-.64-.48-1.45-.76-2.84-.76-2.2 0-3.96 1.76-3.96 3.97s1.76 3.97 3.96 3.97c1.91 0 3.05-1.29 3.39-2.02h2.42c-.69 2.26-2.87 3.78-5.81 3.78-3.61 0-6.52-2.91-6.52-6.52S8.87 5.48 12.48 5.48c3.35 0 5.64 2.23 5.97 5.44h-5.97z"
          />
        </svg>
        Google
      </button>
      <button
        type="button"
        class="btn-secondary justify-center py-2.5 text-sm"
      >
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
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const authStore = useAuthStore()
const { notify } = useUI()
const { login: authLogin } = useAuth()

const showPassword = ref(false)
const loading = ref(false)

const formData = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const handleLogin = async () => {
  if (!formData.email || !formData.password) {
    notify('error', 'Veuillez remplir tous les champs')
    return
  }

  loading.value = true

  try {
    if (typeof authStore.login === 'function') {
      await authStore.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      })
    } else {
      const result = await authLogin({
        email: formData.email,
        password: formData.password,
      })
      if (!result.success) throw new Error(result.error || 'Échec de la connexion')
    }

    notify('success', 'Connexion réussie.')
    setTimeout(() => router.push('/'), 600)
  } catch (error) {
    notify('error', error.message || 'Connexion impossible.')
  } finally {
    loading.value = false
  }
}
</script>
