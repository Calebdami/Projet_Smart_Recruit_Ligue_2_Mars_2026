<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <p class="mt-1 text-sm text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div class="p-6">
        <!-- Profile Picture Section -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
          <div class="flex items-center space-x-6">
            <div class="relative">
              <img
                :src="currentAvatarUrl"
                :alt="`${user?.first_name} ${user?.last_name}`"
                class="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
              <button
                @click="triggerFileInput"
                class="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
            <div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                class="hidden"
              />
              <p class="text-sm text-gray-600 mb-2">
                Upload a new profile picture. JPG, PNG or GIF (max 5MB)
              </p>
              <button
                @click="triggerFileInput"
                class="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                Change picture
              </button>
            </div>
          </div>
        </div>

        <!-- Profile Information Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="first_name"
                v-model="form.first_name"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="last_name"
                v-model="form.last_name"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              disabled
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
            />
            <p class="mt-1 text-sm text-gray-500">Email cannot be changed</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <!-- Preferences Section -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  id="email_notifications"
                  v-model="form.preferences.email_notifications"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="email_notifications" class="ml-2 block text-sm text-gray-900">
                  Email notifications for job matches
                </label>
              </div>

              <div class="flex items-center">
                <input
                  id="profile_visibility"
                  v-model="form.preferences.profile_visibility"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="profile_visibility" class="ml-2 block text-sm text-gray-900">
                  Make profile visible to recruiters
                </label>
              </div>
            </div>
          </div>

          <!-- Two-Factor Authentication Section -->
          <div v-if="user">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
            <div class="bg-gray-50 p-4 rounded-md">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ user.two_factor_enabled ? 'Enabled' : 'Disabled' }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ user.two_factor_enabled
                      ? 'Your account is protected with 2FA'
                      : 'Add an extra layer of security to your account'
                    }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="user.two_factor_enabled ? disable2FA() : setup2FA()"
                  :disabled="is2FALoading"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <span v-if="is2FALoading">Processing...</span>
                  <span v-else>{{ user.two_factor_enabled ? 'Disable' : 'Enable' }} 2FA</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Error/Success Messages -->
          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="text-sm text-red-700">{{ error }}</div>
          </div>

          <div v-if="success" class="rounded-md bg-green-50 p-4">
            <div class="text-sm text-green-700">{{ success }}</div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="isLoading"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span v-if="isLoading">Saving...</span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 2FA Setup Modal -->
    <div v-if="show2FAModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Setup Two-Factor Authentication</h3>

          <div v-if="!twoFASecret" class="text-center">
            <button
              @click="generate2FASecret"
              :disabled="is2FALoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span v-if="is2FALoading">Generating...</span>
              <span v-else>Generate QR Code</span>
            </button>
          </div>

          <div v-else class="space-y-4">
            <div class="text-center">
              <p class="text-sm text-gray-600 mb-2">Scan this QR code with your authenticator app:</p>
              <img :src="qrCodeUrl" alt="2FA QR Code" class="mx-auto border rounded" />
              <p class="text-xs text-gray-500 mt-2">Or enter this code manually: {{ twoFASecret }}</p>
            </div>

            <div>
              <label for="two_fa_code" class="block text-sm font-medium text-gray-700">
                Enter 6-digit code
              </label>
              <input
                id="two_fa_code"
                v-model="twoFACode"
                type="text"
                maxlength="6"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="000000"
              />
            </div>

            <div class="flex space-x-3">
              <button
                @click="enable2FA"
                :disabled="is2FALoading || !twoFACode"
                class="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <span v-if="is2FALoading">Enabling...</span>
                <span v-else>Enable 2FA</span>
              </button>
              <button
                @click="close2FAModal"
                class="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useAuth } from '@/composables/useAuth'

const authStore = useAuthStore()
const userStore = useUserStore()
const { setupTwoFactor, enableTwoFactor: enable2FAFn, disableTwoFactor: disable2FAFn } = useAuth()

const fileInput = ref(null)
const isLoading = ref(false)
const error = ref('')
const success = ref('')
const show2FAModal = ref(false)
const is2FALoading = ref(false)
const twoFASecret = ref('')
const qrCodeUrl = ref('')
const twoFACode = ref('')

const user = computed(() => authStore.user)

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  preferences: {
    email_notifications: true,
    profile_visibility: true,
  },
})

const currentAvatarUrl = computed(() => {
  return user.value?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(
    `${user.value?.first_name || ''} ${user.value?.last_name || ''}`
  )}&background=6366f1&color=fff&size=96`
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (file) {
    await uploadAvatar(file)
  }
}

const uploadAvatar = async (file) => {
  const result = await userStore.uploadAvatar(file)
  if (result.success) {
    success.value = 'Avatar uploaded successfully'
    setTimeout(() => success.value = '', 3000)
  } else {
    error.value = result.error
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''
  success.value = ''

  const result = await userStore.updateProfile({
    first_name: form.first_name,
    last_name: form.last_name,
    phone: form.phone,
    preferences: form.preferences,
  })

  if (result.success) {
    success.value = 'Profile updated successfully'
    // Update auth store user
    authStore.updateUser(result.user)
  } else {
    error.value = result.error
  }

  isLoading.value = false
}

const setup2FA = () => {
  show2FAModal.value = true
  twoFASecret.value = ''
  qrCodeUrl.value = ''
  twoFACode.value = ''
}

const generate2FASecret = async () => {
  is2FALoading.value = true
  const result = await setupTwoFactor()
  if (result.success) {
    twoFASecret.value = result.data.secret
    qrCodeUrl.value = result.data.qr_code
  } else {
    error.value = result.error
  }
  is2FALoading.value = false
}

const enable2FA = async () => {
  is2FALoading.value = true
  const result = await enable2FAFn(twoFASecret.value, twoFACode.value)
  if (result.success) {
    authStore.updateUser({ two_factor_enabled: true })
    show2FAModal.value = false
    success.value = 'Two-factor authentication enabled successfully'
  } else {
    error.value = result.error
  }
  is2FALoading.value = false
}

const disable2FA = async () => {
  const confirmed = confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')
  if (!confirmed) return

  is2FALoading.value = true
  const result = await disable2FAFn(prompt('Enter your current 2FA code to disable:'))
  if (result.success) {
    authStore.updateUser({ two_factor_enabled: false })
    success.value = 'Two-factor authentication disabled successfully'
  } else {
    error.value = result.error
  }
  is2FALoading.value = false
}

const close2FAModal = () => {
  show2FAModal.value = false
  twoFASecret.value = ''
  qrCodeUrl.value = ''
  twoFACode.value = ''
}

onMounted(async () => {
  // Load user profile
  const result = await userStore.fetchProfile()
  if (result.success) {
    form.first_name = result.user.first_name
    form.last_name = result.user.last_name
    form.email = result.user.email
    form.phone = result.user.phone || ''
    form.preferences = { ...form.preferences, ...result.user.preferences }
  }
})
</script>
