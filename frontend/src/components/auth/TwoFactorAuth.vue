<template>
  <div class="two-factor-auth bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div class="flex items-center space-x-3 mb-6">
      <div class="p-2 bg-indigo-50 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Authentification à deux facteurs</h3>
        <p class="text-sm text-gray-500">Sécurisez davantage votre compte en ajoutant une étape de vérification.</p>
      </div>
    </div>

    <!-- 2FA Enabled Status -->
    <div v-if="user?.two_factor_enabled" class="space-y-4">
      <div class="flex items-center p-4 bg-green-50 border border-green-100 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm text-green-800 font-medium">La 2FA est actuellement activée sur votre compte.</p>
      </div>
      <div class="pt-4 border-t border-gray-100">
        <p class="text-sm text-gray-600 mb-4">Pour désactiver la 2FA, veuillez entrer votre code actuel de l'application d'authentification.</p>
        <form @submit.prevent="handleDisable" class="flex items-end space-x-3">
          <div class="flex-1 max-w-xs">
            <label for="disable_code" class="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">Code de vérification</label>
            <input
              id="disable_code"
              v-model="verificationCode"
              type="text"
              placeholder="000000"
              maxlength="6"
              class="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 sm:text-sm"
              :disabled="isSubmitting"
            />
          </div>
          <button
            type="submit"
            class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            :disabled="isSubmitting || verificationCode.length !== 6"
          >
            {{ isSubmitting ? 'Désactivation...' : 'Désactiver la 2FA' }}
          </button>
        </form>
      </div>
    </div>

    <!-- 2FA Setup Flow -->
    <div v-else class="space-y-6">
      <div v-if="!setupData" class="space-y-4">
        <p class="text-sm text-gray-600">
          L'authentification à deux facteurs ajoute une couche supplémentaire de sécurité en exigeant non seulement un mot de passe et un nom d'utilisateur, mais aussi un code généré par une application sur votre téléphone (comme Google Authenticator ou Authy).
        </p>
        <button
          @click="startSetup"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Initialisation...</span>
          <span v-else>Configurer la 2FA</span>
        </button>
      </div>

      <!-- Setup Step: QR Code -->
      <div v-else class="space-y-6 animate-fade-in">
        <div class="bg-blue-50 p-4 rounded-md border border-blue-100">
          <p class="text-sm text-blue-800">
            <strong>Étape 1 :</strong> Scannez le QR code ci-dessous avec votre application d'authentification.
          </p>
        </div>

        <div class="flex flex-col items-center space-y-4">
          <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <img :src="setupData.qr_code" alt="QR Code de configuration 2FA" class="w-48 h-48" />
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Clé secrète (si le scan échoue)</p>
            <code class="px-2 py-1 bg-gray-100 rounded text-indigo-600 font-mono text-sm select-all">{{ setupData.secret }}</code>
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded-md border border-blue-100">
          <p class="text-sm text-blue-800">
            <strong>Étape 2 :</strong> Entrez le code à 6 chiffres généré par votre application pour confirmer la configuration.
          </p>
        </div>

        <form @submit.prevent="handleEnable" class="space-y-4">
          <div>
            <label for="verification_code" class="block text-sm font-medium text-gray-700">Code de vérification</label>
            <input
              id="verification_code"
              v-model="verificationCode"
              type="text"
              placeholder="000000"
              maxlength="6"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :disabled="isSubmitting"
              autocomplete="one-time-code"
            />
          </div>
          <div class="flex space-x-3">
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              :disabled="isSubmitting || verificationCode.length !== 6"
            >
              {{ isSubmitting ? 'Vérification...' : 'Activer la 2FA' }}
            </button>
            <button
              type="button"
              @click="cancelSetup"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
              :disabled="isSubmitting"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Feedback messages -->
    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-md">
      {{ error }}
    </div>
    <div v-if="success" class="mt-4 p-3 bg-green-50 border border-green-100 text-green-700 text-sm rounded-md">
      {{ success }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

const { user, setupTwoFactor, enableTwoFactor, disableTwoFactor } = useAuth()
const { showNotification } = useNotifications()

const setupData = ref(null)
const verificationCode = ref('')
const isSubmitting = ref(false)
const error = ref('')
const success = ref('')

const startSetup = async () => {
  isSubmitting.value = true
  error.value = ''
  success.value = ''
  
  const result = await setupTwoFactor()
  if (result.success) {
    setupData.value = result.data
  } else {
    error.value = result.error || 'Impossible d\'initialiser la configuration 2FA'
    showNotification(error.value, 'error')
  }
  
  isSubmitting.value = false
}

const handleEnable = async () => {
  if (verificationCode.value.length !== 6) return
  
  isSubmitting.value = true
  error.value = ''
  
  const result = await enableTwoFactor(setupData.value.secret, verificationCode.value)
  if (result.success) {
    success.value = 'L\'authentification à deux facteurs a été activée avec succès !'
    showNotification(success.value, 'success')
    setupData.value = null
    verificationCode.value = ''
  } else {
    error.value = result.error || 'Code invalide. Veuillez réessayer.'
    showNotification(error.value, 'error')
  }
  
  isSubmitting.value = false
}

const handleDisable = async () => {
  if (verificationCode.value.length !== 6) return
  
  isSubmitting.value = true
  error.value = ''
  
  const result = await disableTwoFactor(verificationCode.value)
  if (result.success) {
    success.value = 'L\'authentification à deux facteurs a été désactivée.'
    showNotification(success.value, 'success')
    verificationCode.value = ''
  } else {
    error.value = result.error || 'Code invalide. Impossible de désactiver la 2FA.'
    showNotification(error.value, 'error')
  }
  
  isSubmitting.value = false
}

const cancelSetup = () => {
  setupData.value = null
  verificationCode.value = ''
  error.value = ''
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
