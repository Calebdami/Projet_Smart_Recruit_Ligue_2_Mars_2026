<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Profile Settings
            </h3>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Avatar Section -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div class="flex items-center space-x-4">
                  <img
                    v-if="user?.avatar"
                    :src="user.avatar"
                    :alt="user.firstName"
                    class="w-20 h-20 rounded-full object-cover"
                  >
                  <div v-else class="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span class="text-white text-xl font-medium">
                      {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <input
                      ref="avatarInput"
                      type="file"
                      accept="image/*"
                      @change="handleAvatarChange"
                      class="hidden"
                    >
                    <button
                      type="button"
                      @click="$refs.avatarInput.click()"
                      class="btn-secondary text-sm"
                    >
                      Change Picture
                    </button>
                    <p class="text-xs text-gray-500 mt-1">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Personal Information -->
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    v-model="formData.firstName"
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
                    type="email"
                    disabled
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                  >
                  <p class="mt-1 text-xs text-gray-500">
                    Email cannot be changed. Contact admin to update.
                  </p>
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    v-model="formData.phone"
                    type="tel"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                  <div v-if="errors.phone" class="mt-1 text-sm text-red-600">
                    {{ errors.phone }}
                  </div>
                </div>
              </div>

              <!-- Bio -->
              <div>
                <label for="bio" class="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  v-model="formData.bio"
                  rows="4"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Tell us about yourself..."
                ></textarea>
                <div v-if="errors.bio" class="mt-1 text-sm text-red-600">
                  {{ errors.bio }}
                </div>
              </div>

              <!-- 2FA Section -->
              <div class="border-t pt-6">
                <h4 class="text-md font-medium text-gray-900 mb-4">
                  Two-Factor Authentication
                </h4>

                <div v-if="!user?.twoFactorEnabled" class="space-y-4">
                  <p class="text-sm text-gray-600">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <button
                    type="button"
                    @click="setup2FA"
                    class="btn-primary"
                  >
                    Enable 2FA
                  </button>
                </div>

                <div v-else class="space-y-4">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm text-green-700">Two-factor authentication is enabled</span>
                  </div>
                  <button
                    type="button"
                    @click="disable2FA"
                    class="btn-secondary text-red-600 hover:text-red-700"
                  >
                    Disable 2FA
                  </button>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  @click="resetForm"
                  class="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="btn-primary"
                >
                  <span v-if="isSubmitting">Saving...</span>
                  <span v-else>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
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