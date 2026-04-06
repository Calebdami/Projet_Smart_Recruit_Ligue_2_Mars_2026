<template>
  <div class="fixed top-4 right-4 z-[9999] pointer-events-none max-w-sm">
    <transition-group
      name="notification"
      tag="div"
      class="space-y-3 flex flex-col"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'relative overflow-hidden rounded-2xl p-4 flex items-start space-x-4 pointer-events-auto border backdrop-blur-md transition-colors duration-300',
          getNotificationClasses(notification.type)
        ]"
      >
        <!-- Icon Container -->
        <div class="flex-shrink-0 mt-0.5">
          <div :class="['w-5 h-5 flex items-center justify-center rounded-full', getIconBgClasses(notification.type)]">
            <component :is="getIcon(notification.type)" class="w-3 h-3" />
          </div>
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p :class="['text-sm font-semibold', getTitleClasses(notification.type)]">
            {{ notification.title }}
          </p>
          <p v-if="notification.message" :class="['text-sm mt-1', getMessageClasses(notification.type)]">
            {{ notification.message }}
          </p>
        </div>
        
        <!-- Close Button -->
        <button
          @click="emit('remove', notification.id)"
          :class="['flex-shrink-0 ml-2 transition-colors duration-200', getCloseButtonClasses(notification.type)]"
          class="hover:opacity-80"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Progress Bar -->
        <div class="absolute bottom-0 left-0 h-1 rounded-b-xl" :class="getProgressBarClasses(notification.type)" style="animation: progressBar 5s linear forwards;" />
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { defineEmits, h } from 'vue'

// Icon Components
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

const ErrorIcon = () => h('svg', {
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

const props = defineProps({
  notifications: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['remove'])

const getNotificationClasses = (type) => {
  const classes = {
    success:
      'bg-emerald-50 border-emerald-200/80 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-100 shadow-soft',
    error:
      'bg-red-50 border-red-200/80 text-red-900 dark:bg-red-950/40 dark:border-red-900 dark:text-red-100 shadow-soft',
    warning:
      'bg-amber-50 border-amber-200/80 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-100 shadow-soft',
    info:
      'bg-brand-50 border-brand-200/80 text-brand-900 dark:bg-brand-950/40 dark:border-brand-800 dark:text-brand-100 shadow-soft',
  }
  return classes[type] || classes.info
}

const getIconBgClasses = (type) => {
  const classes = {
    success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300',
    error: 'bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-300',
    warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-300',
    info: 'bg-brand-100 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300',
  }
  return classes[type] || classes.info
}

const getTitleClasses = (type) => {
  const classes = {
    success: 'text-emerald-900 dark:text-emerald-50',
    error: 'text-red-900 dark:text-red-50',
    warning: 'text-amber-900 dark:text-amber-50',
    info: 'text-brand-900 dark:text-brand-50',
  }
  return classes[type] || classes.info
}

const getMessageClasses = (type) => {
  const classes = {
    success: 'text-emerald-700 dark:text-emerald-200/90',
    error: 'text-red-700 dark:text-red-200/90',
    warning: 'text-amber-700 dark:text-amber-200/90',
    info: 'text-brand-700 dark:text-brand-200/90',
  }
  return classes[type] || classes.info
}

const getCloseButtonClasses = (type) => {
  const classes = {
    success: 'text-emerald-600 hover:text-emerald-800 dark:text-emerald-400',
    error: 'text-red-600 hover:text-red-800 dark:text-red-400',
    warning: 'text-amber-600 hover:text-amber-800 dark:text-amber-400',
    info: 'text-brand-600 hover:text-brand-800 dark:text-brand-400',
  }
  return classes[type] || classes.info
}

const getProgressBarClasses = (type) => {
  const classes = {
    success: 'bg-gradient-to-r from-emerald-400 to-accent-500',
    error: 'bg-gradient-to-r from-red-400 to-red-500',
    warning: 'bg-gradient-to-r from-amber-400 to-amber-500',
    info: 'bg-gradient-to-r from-brand-400 to-accent-500',
  }
  return classes[type] || classes.info
}

const getIcon = (type) => {
  const icons = {
    success: SuccessIcon,
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon
  }
  return icons[type] || InfoIcon
}
</script>

<style scoped>
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(384px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(384px);
  }
}

@keyframes progressBar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.notification-enter-active {
  animation: slideInRight 0.3s ease-out;
}

.notification-leave-active {
  animation: slideOutRight 0.3s ease-out;
}

.notification-move {
  transition: transform 0.3s ease-out;
}
</style>