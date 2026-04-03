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
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="first_name" class="sr-only">First Name</label>
            <input
              id="first_name"
              v-model="form.first_name"
              name="first_name"
              type="text"
              autocomplete="given-name"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="First Name"
            />
          </div>
          <div>
            <label for="last_name" class="sr-only">Last Name</label>
            <input
              id="last_name"
              v-model="form.last_name"
              name="last_name"
              type="text"
              autocomplete="family-name"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Last Name"
            />
          </div>
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="phone" class="sr-only">Phone</label>
            <input
              id="phone"
              v-model="form.phone"
              name="phone"
              type="tel"
              autocomplete="tel"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Phone (optional)"
            />
          </div>
          <div>
            <label for="role" class="sr-only">Role</label>
            <select
              id="role"
              v-model="form.role"
              name="role"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            >
              <option value="" disabled>Select your role</option>
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
          <div>
            <label for="confirm_password" class="sr-only">Confirm Password</label>
            <input
              id="confirm_password"
              v-model="form.confirm_password"
              name="confirm_password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirm Password"
            />
          </div>
        </div>

        <!-- Password Requirements -->
        <div class="text-sm text-gray-600">
          <p class="font-medium">Password requirements:</p>
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li :class="{ 'text-green-600': passwordValidations.length }">
              At least 8 characters
            </li>
            <li :class="{ 'text-green-600': passwordValidations.uppercase }">
              One uppercase letter
            </li>
            <li :class="{ 'text-green-600': passwordValidations.lowercase }">
              One lowercase letter
            </li>
            <li :class="{ 'text-green-600': passwordValidations.number }">
              One number
            </li>
            <li :class="{ 'text-green-600': passwordValidations.special }">
              One special character
            </li>
          </ul>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-700">{{ error }}</div>
        </div>

        <div v-if="success" class="rounded-md bg-green-50 p-4">
          <div class="text-sm text-green-700">
            {{ success }}
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="absolute left-1/2 transform -translate-x-1/2">
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role: '',
  password: '',
  confirm_password: '',
})

const isLoading = ref(false)
const error = ref('')
const success = ref('')

// Password validation
const passwordValidations = computed(() => ({
  length: form.password.length >= 8,
  uppercase: /[A-Z]/.test(form.password),
  lowercase: /[a-z]/.test(form.password),
  number: /\d/.test(form.password),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
}))

const isPasswordValid = computed(() => {
  return Object.values(passwordValidations.value).every(Boolean)
})

const isFormValid = computed(() => {
  return (
    form.first_name.trim() &&
    form.last_name.trim() &&
    form.email &&
    form.role &&
    isPasswordValid.value &&
    form.password === form.confirm_password
  )
})

const handleSubmit = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields correctly'
    return
  }

  isLoading.value = true
  error.value = ''
  success.value = ''

  const userData = {
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    email: form.email.toLowerCase().trim(),
    phone: form.phone.trim() || undefined,
    role: form.role,
    password: form.password,
  }

  const result = await register(userData)

  if (result.success) {
    success.value = result.message
    // Clear form
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
  } else {
    error.value = result.error
  }

  isLoading.value = false
}
</script>
