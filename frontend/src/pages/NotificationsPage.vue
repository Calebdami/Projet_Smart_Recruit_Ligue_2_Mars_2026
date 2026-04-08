<template>
  <div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
    <h1 class="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>

    <!-- Filters -->
    <div class="mb-6 flex items-center gap-4">
      <button class="rounded-full bg-brand-100 px-4 py-1 text-sm text-brand-800 dark:bg-brand-950/50 dark:text-brand-200" @click="filter = 'all'">
        Toutes ({{ notifications.length }})
      </button>
      <button class="rounded-full bg-slate-100 px-4 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400" @click="filter = 'unread'">
        Non lues ({{ unreadCount }})
      </button>
      <button class="ml-auto text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400" @click="markAllAsRead" v-if="unreadCount > 0">
        Tout marquer comme lu
      </button>
    </div>

    <!-- Notifications List -->
    <div class="space-y-3">
      <div v-for="notification in filteredNotifications" :key="notification.id" 
           :class="notification.is_read ? 'bg-white dark:bg-black' : 'bg-brand-50 dark:bg-brand-950/20'"
           class="flex items-start gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
        <div :class="getIconBg(notification.type)" class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
          <svg class="h-5 w-5" :class="getIconColor(notification.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="notification.type === 'application'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            <path v-else-if="notification.type === 'interview'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            <path v-else-if="notification.type === 'system'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-900 dark:text-white">{{ notification.title }}</p>
          <p class="text-sm text-slate-600 dark:text-slate-400">{{ notification.message }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ formatTime(notification.created_at) }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button v-if="!notification.is_read" class="text-sm text-brand-600 hover:underline dark:text-brand-400" @click="markAsRead(notification.id)">
            Marquer lu
          </button>
          <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" @click="deleteNotification(notification.id)">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <div v-if="filteredNotifications.length === 0" class="text-center py-12 text-slate-500">
        Aucune notification
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'

const notificationsStore = useNotificationsStore()
const { notifications, unreadCount } = storeToRefs(notificationsStore)

const filter = ref('all')

const filteredNotifications = computed(() => {
  if (filter.value === 'unread') return notifications.value.filter(n => !n.is_read)
  return notifications.value
})

const loadNotifications = async () => {
  await notificationsStore.fetchNotifications()
}

const markAsRead = async (id) => {
  await notificationsStore.markAsRead(id)
}

const markAllAsRead = async () => {
  await notificationsStore.markAllAsRead()
}

const deleteNotification = async (id) => {
  await notificationsStore.deleteNotification(id)
}

const getIconBg = (type) => {
  const classes = {
    application: 'bg-brand-100 dark:bg-brand-950/50',
    interview: 'bg-violet-100 dark:bg-violet-950/50',
    system: 'bg-amber-100 dark:bg-amber-950/50',
    default: 'bg-slate-100 dark:bg-slate-800'
  }
  return classes[type] || classes.default
}

const getIconColor = (type) => {
  const classes = {
    application: 'text-brand-600 dark:text-brand-400',
    interview: 'text-violet-600 dark:text-violet-400',
    system: 'text-amber-600 dark:text-amber-400',
    default: 'text-slate-600'
  }
  return classes[type] || classes.default
}

const formatTime = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return 'À l\'instant'
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`
  return d.toLocaleDateString('fr-FR')
}

onMounted(() => loadNotifications())
</script>