<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            sign in to existing account
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              v-model="formData.firstName"
              name="firstName"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
            <div v-if="errors.firstName" class="mt-1 text-sm text-red-600">
              {{ errors.firstName }}
            </div>
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              v-model="formData.lastName"
              name="lastName"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
            <div v-if="errors.lastName" class="mt-1 text-sm text-red-600">
              {{ errors.lastName }}
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              v-model="formData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
            <div v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Phone Number (Optional)
            </label>
            <input
              id="phone"
              v-model="formData.phone"
              name="phone"
              type="tel"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
            <div v-if="errors.phone" class="mt-1 text-sm text-red-600">
              {{ errors.phone }}
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              type="password"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
            <div v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
            <div v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ errors.confirmPassword }}
            </div>
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
            <span v-else>Create Account</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const authStore = useAuthStore()
const { showNotification } = useNotifications()

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({})
const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  errors.value = {}

  try {
    await authStore.register(formData.value)
    showNotification('Account created successfully! Please log in.', 'success')
    router.push('/login')
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else if (error.response?.data?.message) {
      errors.value.general = error.response.data.message
    } else {
      errors.value.general = 'Registration failed. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>