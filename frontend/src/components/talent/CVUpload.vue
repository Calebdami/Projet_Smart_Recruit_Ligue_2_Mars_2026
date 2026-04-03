<template>
  <div class="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
    <div v-if="!isUploading">
      <input 
        type="file" 
        ref="fileInput" 
        class="hidden" 
        accept=".pdf,.docx"
        @change="handleFileChange"
      >
      <div class="flex flex-col items-center cursor-pointer" @click="$refs.fileInput.click()">
        <UploadCloud class="h-12 w-12 text-gray-400 mb-2" />
        <p class="text-lg font-medium text-gray-700">Cliquez pour uploader un CV (PDF ou DOCX)</p>
        <p class="text-sm text-gray-500 mt-1">L'IA extraira automatiquement les informations</p>
      </div>
    </div>

    <div v-else class="py-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-primary-600 font-medium">Analyse du CV par SmartRecruit AI...</p>
    </div>

    <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UploadCloud } from 'lucide-vue-next'
import { candidateService } from '@/services/candidates.service'

const emit = defineEmits(['close', 'parsed'])
const isUploading = ref(false)
const error = ref(null)

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  error.value = null

  try {
    const formData = new FormData()
    formData.append('resume', file)
    
    // For now, using a dummy candidate ID for testing or the real one if we have it
    const candidateId = 'new' 
    const result = await candidateService.parseCV(candidateId, formData)
    
    emit('parsed', result.data)
  } catch (err) {
    error.value = "Erreur lors de l'analyse : " + (err.response?.data?.message || err.message)
  } finally {
    isUploading.value = false
  }
}
</script>
