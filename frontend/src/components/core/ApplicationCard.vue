<template>
  <div
    class="application-card bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 cursor-move transition-all hover:shadow-md"
    :class="{
      'opacity-50 rotate-2 scale-95': isDragging,
      'ring-2 ring-brand-400': isSelected
    }"
    draggable="true"
    @dragstart="$emit('dragstart', $event)"
    @dragend="$emit('dragend')"
    @click="$emit('click')"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <h4 class="font-medium text-slate-900 dark:text-white truncate">
          {{ application.first_name }} {{ application.last_name }}
        </h4>
        <p class="text-sm text-slate-600 dark:text-slate-400 truncate">
          {{ application.job_title }}
        </p>
      </div>
      <div class="flex items-center gap-2 ml-2">
        <!-- AI Score Badge -->
        <div
          v-if="application.ai_score"
          class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
          :class="getScoreColor(application.ai_score)"
        >
          <BrainIcon class="w-3 h-3" />
          {{ application.ai_score }}%
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-2">
      <!-- Email -->
      <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <MailIcon class="w-4 h-4 flex-shrink-0" />
        <span class="truncate">{{ application.email }}</span>
      </div>

      <!-- Location -->
      <div v-if="application.location" class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <MapPinIcon class="w-4 h-4 flex-shrink-0" />
        <span class="truncate">{{ application.location }}</span>
      </div>

      <!-- Applied Date -->
      <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <CalendarIcon class="w-4 h-4 flex-shrink-0" />
        <span>{{ formatDate(application.applied_at) }}</span>
      </div>

      <!-- Recruiter Score -->
      <div v-if="application.recruiter_score" class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <StarIcon class="w-4 h-4 flex-shrink-0" />
        <span>Note: {{ application.recruiter_score }}/10</span>
      </div>
    </div>

    <!-- Cover Letter Preview -->
    <div v-if="application.cover_letter" class="mt-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
      "{{ application.cover_letter }}"
    </div>

    <!-- Status Badge -->
    <div class="mt-3 flex items-center justify-between">
      <div
        class="px-2 py-1 rounded-full text-xs font-medium"
        :class="getStatusStyle(application.status)"
      >
        {{ getStatusLabel(application.status) }}
      </div>

      <!-- Priority Indicator -->
      <div
        v-if="application.priority === 'urgent'"
        class="w-2 h-2 bg-red-500 rounded-full animate-pulse"
        title="Priorité urgente"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  MailIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  BrainIcon
} from 'lucide-vue-next'

const props = defineProps({
  application: {
    type: Object,
    required: true
  },
  isDragging: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['dragstart', 'dragend', 'click'])

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getScoreColor = (score) => {
  if (score >= 80) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
  if (score >= 60) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

const getStatusStyle = (status) => {
  const styles = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    reviewing: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    interview: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
    offer: 'bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400',
    hired: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    withdrawn: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
  }
  return styles[status] || styles.new
}

const getStatusLabel = (status) => {
  const labels = {
    new: 'Nouvelle',
    reviewing: 'En évaluation',
    interview: 'Entretien',
    offer: 'Offre',
    hired: 'Embauché',
    rejected: 'Refusé',
    withdrawn: 'Retiré'
  }
  return labels[status] || status
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.application-card {
  user-select: none;
}

.application-card:hover {
  transform: translateY(-1px);
}
</style>