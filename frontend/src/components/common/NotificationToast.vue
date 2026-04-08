<template>
  <TransitionGroup
    name="notification-list"
    tag="div"
    class="fixed top-4 right-4 z-50 space-y-2 max-w-sm"
  >
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification-item"
      :class="getNotificationClasses(notification.type)"
    >
      <div class="flex items-start gap-3">
        <!-- Icon -->
        <div class="flex-shrink-0 mt-0.5">
          <component :is="getIcon(notification.type)" class="h-5 w-5" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-900 dark:text-white">
            {{ notification.title }}
          </p>
          <p v-if="notification.message" class="text-sm text-slate-600 dark:text-slate-300 mt-1">
            {{ notification.message }}
          </p>

          <!-- Action button -->
          <button
            v-if="notification.action"
            @click="handleAction(notification)"
            class="mt-2 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 underline"
          >
            {{ notification.action.label }}
          </button>
        </div>

        <!-- Close button -->
        <button
          @click="removeNotification(notification.id)"
          class="flex-shrink-0 ml-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Progress bar -->
      <div
        v-if="notification.duration > 0"
        class="mt-3 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
      >
        <div
          class="h-full bg-current rounded-full transition-all ease-linear"
          :style="{ width: `${progressPercent(notification)}%` }"
        />
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useToastStore } from '@/stores/toast'
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'

const toastStore = useToastStore()

const notifications = computed(() => toastStore.toasts)

const getNotificationClasses = (type) => {
  const baseClasses = 'p-4 rounded-xl shadow-lg border backdrop-blur-sm transform transition-all duration-300 ease-out'

  const typeClasses = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200',
    error: 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-200',
    warning: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-200',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-200',
    connection: 'bg-violet-50 border-violet-200 text-violet-800 dark:bg-violet-950/50 dark:border-violet-800 dark:text-violet-200',
    update: 'bg-brand-50 border-brand-200 text-brand-800 dark:bg-brand-950/50 dark:border-brand-800 dark:text-brand-200'
  }

  return `${baseClasses} ${typeClasses[type] || typeClasses.info}`
}

const getIcon = (type) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    connection: Info,
    update: CheckCircle
  }
  return icons[type] || Info
}

const progressPercent = (notification) => {
  if (!notification.duration || !notification.createdAt) return 100

  const elapsed = Date.now() - notification.createdAt
  const remaining = Math.max(0, notification.duration - elapsed)
  return (remaining / notification.duration) * 100
}

const removeNotification = (id) => {
  toastStore.removeToast(id)
}

const handleAction = (notification) => {
  if (notification.action && notification.action.handler) {
    notification.action.handler()
  }
  removeNotification(notification.id)
}

// Auto-remove notifications
let cleanupInterval

onMounted(() => {
  cleanupInterval = setInterval(() => {
    const now = Date.now()
    notifications.value.forEach(notification => {
      if (notification.duration > 0 && notification.createdAt) {
        const elapsed = now - notification.createdAt
        if (elapsed >= notification.duration) {
          removeNotification(notification.id)
        }
      }
    })
  }, 100)
})

onUnmounted(() => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval)
  }
})
</script>

<style scoped>
.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.3s ease;
}

.notification-list-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-list-move {
  transition: transform 0.3s ease;
}

.notification-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}
</style>