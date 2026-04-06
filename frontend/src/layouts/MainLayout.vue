<template>
  <div class="flex min-h-screen bg-slate-100/80 transition-colors duration-300 dark:bg-black">
    <TheSidebar />

    <div class="flex min-h-screen flex-1 flex-col pl-0 lg:pl-72">
      <header
        class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-black/90"
      >
        <div class="px-4 py-3 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between gap-4">
            <div class="min-w-0 flex-1">
              <h1 class="truncate text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {{ pageTitle}}
              </h1>
              <p class="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
                <span class="inline-flex items-center gap-1.5 capitalize">
                  <span class="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse-soft" />
                  {{ user?.role }}
                </span>
                <span class="hidden sm:inline"> · {{ statusLine }}</span>
              </p>
            </div>

            <div class="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            

              <div class="relative">
                <div
                  class="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 py-1.5 pl-1.5 pr-2 transition-all duration-300 hover:border-brand-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-slate-600 dark:hover:bg-slate-800 sm:gap-3 sm:pr-3"
                  @click="toggleProfileMenu"
                >
                  <div class="relative">
                    <img
                      v-if="user?.avatar_url"
                      :src="user.avatar_url"
                      :alt="user.first_name"
                      class="h-9 w-9 rounded-lg object-cover ring-2 ring-white dark:ring-slate-800"
                    >
                    <div
                      v-else
                      class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 text-sm font-bold text-white shadow-md"
                    >
                      {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
                    </div>
                    <div
                      class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900"
                    />
                  </div>
                  <div class="hidden text-left sm:block">
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">
                      {{ user?.first_name ?? 'User' }}
                    </p>
                    <p class="text-xs capitalize text-slate-500 dark:text-slate-400">{{ user?.role ?? 'Member' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import { useUI } from '@/composables/useUI'
import TheSidebar from '@/components/common/TheSidebar.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { logout } = useAuth()
const ui = useUI()

const user = computed(() => authStore.user)
const showProfileMenu = ref(false)
const statusLine = 'Plateforme de recrutement'

const pageTitle = computed(() => {
  const titles = {
    '/': 'Tableau de bord',
    '/users': 'Utilisateurs',
    '/audit': "Journal d'audit",
    '/analytics': 'Analytique',
    '/profile': 'Profil',
  }
  return titles[route.path] || 'SmartRecruit'
})

watch(
  () => route.path,
  () => {
    showProfileMenu.value = false
  }
)

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const handleLogout = async () => {
  try {
    const confirmed = await ui.confirmLogout()
    if (confirmed) {
      ui.setConfirmLoading(true)
      await logout()
      ui.showSuccess('Déconnexion', 'Vous êtes déconnecté.')
      router.push('/login')
    }
  } catch (error) {
    console.error('Logout error:', error)
    ui.showError('Erreur', 'La déconnexion a échoué.')
  } finally {
    ui.setConfirmLoading(false)
  }
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
