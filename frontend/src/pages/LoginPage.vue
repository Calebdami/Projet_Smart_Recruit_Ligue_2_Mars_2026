<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link
            to="/register"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            create a new account
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="formData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            >
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            >
          </div>
          <div v-if="requires2FA">
            <label for="twoFactorCode" class="sr-only">2FA Code</label>
            <input
              id="twoFactorCode"
              v-model="formData.twoFactorCode"
              name="twoFactorCode"
              type="text"
              autocomplete="one-time-code"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="2FA Code"
            >
          </div>
        </div>

        <div v-if="errors.general" class="text-red-600 text-sm text-center">
          {{ errors.general }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting" class="absolute left-1/2 transform -translate-x-1/2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showNotification } = useNotifications()

const formData = ref({
  email: '',
  password: '',
  twoFactorCode: ''
})

const errors = ref({})
const isSubmitting = ref(false)
const requires2FA = ref(false)

const handleSubmit = async () => {
  console.log(formData.value)
  isSubmitting.value = true
  errors.value = {}

  try {
    console.log('dedans 1');
    const result = await authStore.login(formData.value);
    
    if (result.requires2FA) {
      requires2FA.value = true
      showNotification('Please enter your 2FA code', 'info')
      return
    }
    showNotification('Login successful!', 'success')

    // Redirect to intended page or home
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    if (error.response?.data?.requires2FA) {
      requires2FA.value = true
    } else if (error.response?.data?.message) {
      errors.value.general = error.response.data.message
    } else {
      errors.value.general = 'Login failed. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>