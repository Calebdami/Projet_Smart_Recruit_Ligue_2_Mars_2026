<template>
  <div class="card-elevated p-5 sm:p-6 overflow-hidden">
    <h2 class="mb-8 text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
      <span class="h-5 w-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(var(--color-brand-500),0.5)]"></span>
      Parcours de la candidature
    </h2>
    
    <!-- Pipeline Steps -->
    <div class="relative px-2">
      <!-- Background Line -->
      <div class="absolute left-0 top-[18px] sm:top-5 h-0.5 w-full bg-slate-100 dark:bg-slate-800"></div>
      
      <div class="flex items-start justify-between">
        <div 
          v-for="(step, index) in steps" 
          :key="step.value"
          class="relative flex flex-col items-center flex-1 z-10"
        >
          <!-- Step Circle -->
          <button
            @click="$emit('update-status', step.value)"
            :class="[
              'h-9 w-9 sm:h-10 sm:w-10 rounded-full font-black text-xs sm:text-sm transition-all flex items-center justify-center shadow-sm',
              currentStatus === step.value 
                ? 'bg-brand-500 text-white ring-4 ring-brand-100 dark:ring-brand-900/50 scale-110 z-20 shadow-lg shadow-brand-500/20' 
                : isStepCompleted(index)
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/10'
                : 'bg-white text-slate-400 border-2 border-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-600 hover:border-brand-200 dark:hover:border-brand-900'
            ]"
            :title="`Marquer comme ${step.label}`"
          >
            <svg v-if="isStepCompleted(index)" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </button>
          
          <!-- Step Label -->
          <p 
            :class="[
              'mt-3 text-[10px] sm:text-xs font-bold text-center px-1 max-w-[65px] sm:max-w-none leading-tight transition-colors',
              currentStatus === step.value ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'
            ]"
          >
            {{ step.label }}
          </p>
        </div>
      </div>
    </div>

    <!-- Status Legend -->
    <div class="mt-10 pt-6 border-t border-slate-50 dark:border-slate-800/50 flex flex-wrap justify-center gap-x-6 gap-y-3">
      <div v-for="status in statuses" :key="status.value" class="flex items-center gap-2 group cursor-default">
        <span :class="[
          'h-2 w-2 rounded-full ring-2 ring-transparent transition-all group-hover:ring-slate-200 dark:group-hover:ring-slate-700',
          getStatusColor(status.value)
        ]" />
        <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{{ status.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentStatus: {
    type: String,
    default: 'new'
  }
})

const emit = defineEmits(['update-status'])

const steps = [
  { value: 'new', label: 'Nouvelle', order: 0 },
  { value: 'reviewing', label: 'En évaluation', order: 1 },
  { value: 'interview', label: 'Entretien', order: 2 },
  { value: 'offer', label: 'Offre', order: 3 },
  { value: 'hired', label: 'Embauché', order: 4 },
  { value: 'rejected', label: 'Refusé', order: 5 }
]

const statuses = [
  { value: 'new', label: 'Nouvelle' },
  { value: 'reviewing', label: 'En évaluation' },
  { value: 'interview', label: 'Entretien' },
  { value: 'offer', label: 'Offre' },
  { value: 'hired', label: 'Embauché' },
  { value: 'rejected', label: 'Refusé' }
]

const currentStatusIndex = computed(() => {
  const step = steps.find(s => s.value === props.currentStatus)
  return step ? step.order : -1
})

const isStepCompleted = (index) => {
  return index < currentStatusIndex.value
}

const getStatusColor = (status) => {
  const colors = {
    new: 'bg-blue-500',
    reviewing: 'bg-amber-500',
    interview: 'bg-violet-500',
    offer: 'bg-brand-500',
    hired: 'bg-emerald-500',
    rejected: 'bg-rose-500'
  }
  return colors[status] || 'bg-slate-500'
}
</script>