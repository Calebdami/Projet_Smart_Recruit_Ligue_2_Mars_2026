<template>
  <Modal :show="show" @close="$emit('close')" size="xl">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
          Candidature de {{ application?.first_name }} {{ application?.last_name }}
        </h3>
        <div class="flex items-center gap-2">
          <StatusBadge :status="application?.status" />
          <AIScoreBadge :score="application?.ai_score" />
        </div>
      </div>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-slate-900 dark:text-white mb-3">Informations candidat</h4>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <MailIcon class="w-4 h-4 text-slate-400" />
                <span class="text-sm">{{ application?.email }}</span>
              </div>
              <div v-if="application?.phone" class="flex items-center gap-2">
                <PhoneIcon class="w-4 h-4 text-slate-400" />
                <span class="text-sm">{{ application?.phone }}</span>
              </div>
              <div v-if="application?.location" class="flex items-center gap-2">
                <MapPinIcon class="w-4 h-4 text-slate-400" />
                <span class="text-sm">{{ application?.location }}</span>
              </div>
              <div class="flex items-center gap-2">
                <CalendarIcon class="w-4 h-4 text-slate-400" />
                <span class="text-sm">Candidature du {{ formatDate(application?.applied_at) }}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="font-medium text-slate-900 dark:text-white mb-3">Informations poste</h4>
            <div class="space-y-2">
              <p class="text-sm font-medium">{{ application?.job_title }}</p>
              <p class="text-sm text-slate-600 dark:text-slate-400">{{ application?.job_location }}</p>
              <p class="text-sm text-slate-600 dark:text-slate-400">{{ application?.job_department }}</p>
            </div>
          </div>
        </div>

        <!-- Cover Letter -->
        <div v-if="application?.cover_letter">
          <h4 class="font-medium text-slate-900 dark:text-white mb-3">Lettre de motivation</h4>
          <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <p class="text-sm whitespace-pre-wrap">{{ application.cover_letter }}</p>
          </div>
        </div>

        <!-- Screening Answers -->
        <div v-if="application?.screening_answers">
          <h4 class="font-medium text-slate-900 dark:text-white mb-3">Réponses au questionnaire</h4>
          <div class="space-y-3">
            <div
              v-for="[question, answer] in Object.entries(application.screening_answers)"
              :key="question"
              class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg"
            >
              <p class="font-medium text-sm mb-2">{{ question }}</p>
              <p class="text-sm text-slate-600 dark:text-slate-400">{{ answer }}</p>
            </div>
          </div>
        </div>

        <!-- Scores -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-if="application?.ai_score" class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <h4 class="font-medium text-slate-900 dark:text-white mb-2">Score IA</h4>
            <div class="flex items-center gap-2">
              <div class="text-2xl font-bold text-brand-600">{{ application.ai_score }}%</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Matching automatique</div>
            </div>
          </div>

          <div v-if="application?.recruiter_score" class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <h4 class="font-medium text-slate-900 dark:text-white mb-2">Note recruteur</h4>
            <div class="flex items-center gap-2">
              <div class="text-2xl font-bold text-emerald-600">{{ application.recruiter_score }}/10</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Évaluation manuelle</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button
            @click="$emit('close')"
            class="btn-secondary"
          >
            Fermer
          </button>
        </div>

        <div class="flex items-center gap-2">
          <!-- Status Change Buttons -->
          <button
            v-for="status in availableStatuses"
            :key="status.value"
            @click="changeStatus(status.value)"
            :disabled="application?.status === status.value"
            class="btn-secondary"
            :class="{
              'btn-primary': application?.status !== status.value
            }"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import Modal from '@/components/common/Modal.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import AIScoreBadge from '@/components/common/AIScoreBadge.vue'
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon
} from 'lucide-vue-next'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  application: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'status-changed'])

const availableStatuses = [
  { value: 'reviewing', label: 'En évaluation' },
  { value: 'interview', label: 'Entretien' },
  { value: 'offer', label: 'Offre' },
  { value: 'hired', label: 'Embauché' },
  { value: 'rejected', label: 'Refusé' }
]

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const changeStatus = (newStatus) => {
  if (props.application && newStatus !== props.application.status) {
    emit('status-changed', props.application.id, newStatus)
  }
}
</script>