<template>
  <transition name="modal-backdrop">
    <div
      v-if="show"
      class="fixed inset-0 z-[9998] overflow-y-auto flex items-center justify-center p-4"
      @click="handleBackdropClick"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-black/60" />
      
      <!-- Modal -->
      <transition name="modal-content">
        <div
          v-if="show"
          class="relative max-w-md w-full transform rounded-2xl border border-slate-200/90 bg-white p-8 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          @click.stop
        >
          <!-- Icon Circle -->
          <div class="flex justify-center mb-6">
            <div
              :class="['w-16 h-16 rounded-full flex items-center justify-center', getIconBgClasses(type)]"
            >
              <component :is="getIcon(type)" class="w-8 h-8" />
            </div>
          </div>
          
          <!-- Content -->
          <div class="text-center mb-8">
            <h3 class="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
              {{ title }}
            </h3>
            <p v-if="message" class="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {{ message }}
            </p>
          </div>
          
          <!-- Actions -->
          <div class="flex flex-col-reverse sm:flex-row gap-3 justify-center">
            <button
              v-if="showCancel"
              @click="handleCancel"
              :disabled="loading"
              class="rounded-xl px-6 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900 bg-slate-100 hover:bg-slate-200"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :disabled="loading"
              :class="getButtonClasses(type)"
              class="px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center"
            >
              <svg v-if="loading" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? loadingText : confirmText }}</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, h } from 'vue'

// Icon Components
const WarningIcon = () => h('svg', {
  fill: 'currentColor',
  viewBox: '0 0 20 20',
  class: 'w-full h-full'
}, [
  h('path', {
    'fill-rule': 'evenodd',
    d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
    'clip-rule': 'evenodd'
  })
])

const DangerIcon = () => h('svg', {
  fill: 'currentColor',
  viewBox: '0 0 20 20',
  class: 'w-full h-full'
}, [
  h('path', {
    'fill-rule': 'evenodd',
    d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
    'clip-rule': 'evenodd'
  })
])

const InfoIcon = () => h('svg', {
  fill: 'currentColor',
  viewBox: '0 0 20 20',
  class: 'w-full h-full'
}, [
  h('path', {
    'fill-rule': 'evenodd',
    d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
    'clip-rule': 'evenodd'
  })
])

const SuccessIcon = () => h('svg', {
  fill: 'currentColor',
  viewBox: '0 0 20 20',
  class: 'w-full h-full'
}, [
  h('path', {
    'fill-rule': 'evenodd',
    d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
    'clip-rule': 'evenodd'
  })
])

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['warning', 'danger', 'info', 'success'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  loadingText: {
    type: String,
    default: 'Processing...'
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const getIconBgClasses = (type) => {
  const classes = {
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
    success: 'bg-emerald-100 text-emerald-600'
  }
  return classes[type] || classes.warning
}

const getButtonClasses = (type) => {
  const classes = {
    warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
  }
  return classes[type] || classes.warning
}

const getIcon = (type) => {
  const icons = {
    warning: WarningIcon,
    danger: DangerIcon,
    info: InfoIcon,
    success: SuccessIcon
  }
  return icons[type] || WarningIcon
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleCancel()
  }
}
</script>

<style scoped>
@keyframes fadeBackdrop {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUpContent {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
