<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
    </div>

    <div class="relative max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-6">
          <span class="text-white text-2xl font-bold">SR</span>
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          SmartRecruit
        </h1>
        <h2 class="text-lg text-gray-600">Welcome back</h2>
        <p class="mt-3 text-sm text-gray-500">
          Don't have an account?
          <router-link
            to="/register"
            class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Sign up for free
          </router-link>
        </p>
      </div>
      
      <!-- Login Form -->
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-5">
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="svg-icon text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="email"
                  v-model="formData.email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                >
              </div>
            </div>
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="svg-icon text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  v-model="formData.password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                >
              </div>
            </div>
            <div v-if="requires2FA">
              <label for="twoFactorCode" class="block text-sm font-semibold text-gray-700 mb-2">Two-Factor Code</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="svg-icon text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="twoFactorCode"
                  v-model="formData.twoFactorCode"
                  name="twoFactorCode"
                  type="text"
                  autocomplete="one-time-code"
                  maxlength="6"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all bg-white/50 backdrop-blur-sm text-center text-lg tracking-widest"
                  placeholder="••••••••"
                >
              </div>
            </div>
          </div>

          <div v-if="errors.general" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {{ errors.general }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <span v-if="isSubmitting" class="flex items-center">
                <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
              <span v-else>Sign in</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Footer links -->
      <div class="mt-6 text-center space-y-2">
        <router-link
          to="/forgot-password"
          class="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          Forgot your password?
        </router-link>
        <div class="text-xs text-gray-500">
          By signing in, you agree to our
          <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms</a>
          and
          <a href="#" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useUI } from '@/composables/useUI'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()
const ui = useUI()

const formData = ref({
  email: '',
  password: '',
  twoFactorCode: ''
})

const errors = ref({})
const isSubmitting = ref(false)
const requires2FA = ref(false)

const handleSubmit = async () => {
    isSubmitting.value = true;
    errors.value = {};
    try {
        const response = await login(formData.value);
        console.log('Login response:', response); // Debug
        
        if (response.success === true) {
            ui.showSuccess('Login Successful', 'Welcome back! Redirecting to dashboard...');
            const redirect = route.query.redirect || '/'; 
            console.log('Redirecting to:', redirect); // Debug
            router.push(redirect);
        } else if (response.requires_2fa || response.requires2FA) {
            requires2FA.value = true;
            ui.showInfo('Two-Factor Authentication', 'Please enter your 2FA code to continue.');
        } else {
            errors.value.general = response.error || 'Login failed. Please try again.';
        }
    } catch (error) {
        console.error('Login error:', error); // Debug
        const data = error.response?.data;
        if (data?.requires_2fa || data?.requires2FA) {
            requires2FA.value = true;
            ui.showInfo('Two-Factor Authentication', 'Please enter your 2FA code to continue.');
        } else if (data?.message) {
            errors.value.general = data.message;
            ui.showError('Login Failed', data.message);
        } else {
            errors.value.general = 'Login failed. Please try again.';
            ui.showError('Login Failed', 'An error occurred during login. Please try again.');
        }
    } finally {
        isSubmitting.value = false;
    }
};
</script>