<template>
  <div class="card-elevated p-6">
    <h2 class="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Parcours de la candidature</h2>
    
    <!-- Pipeline Steps -->
    <div class="flex items-center justify-between">
      <div 
        v-for="(step, index) in steps" 
        :key="step.value"
        class="flex flex-col items-center flex-1"
      >
        <!-- Step Circle -->
        <button
          @click="$emit('update-status', step.value)"
          :class="[
            'h-10 w-10 rounded-full font-semibold text-sm transition-all',
            currentStatus === step.value 
              ? 'bg-brand-500 text-white ring-4 ring-brand-200 dark:ring-brand-900 scale-110' 
              : isStepCompleted(index)
              ? 'bg-emerald-500 text-white hover:scale-105'
              : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'
          ]"
          :title="`Marquer comme ${step.label}`"
        >
          <span v-if="isStepCompleted(index)">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </button>
        
        <!-- Step Label -->
        <p class="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300 text-center">
          {{ step.label }}
        </p>
        
        <!-- Connector Line -->
        <div 
          v-if="index < steps.length - 1"
          :class="[
            'absolute h-1 w-12 mt-[-2.5rem] ml-20 transition-all',
            isStepCompleted(index) 
              ? 'bg-emerald-500' 
              : currentStatusIndex > index
              ? 'bg-emerald-500'
              : 'bg-slate-200 dark:bg-slate-700'
          ]"
        />
      </div>
    </div>

    <!-- Status Legend -->
    <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div v-for="status in statuses" :key="status.value" class="flex items-center gap-2 text-xs">
        <span :class="[
          'h-2 w-2 rounded-full',
          getStatusColor(status.value)
        ]" />
        <span class="text-slate-600 dark:text-slate-400">{{ status.label }}</span>
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
