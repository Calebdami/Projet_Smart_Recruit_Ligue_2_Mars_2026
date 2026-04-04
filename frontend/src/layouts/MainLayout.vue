<template>
  <div class="flex min-h-screen bg-slate-100/80 transition-colors duration-300 dark:bg-slate-950">
    <TheSidebar />

    <div class="flex min-h-screen flex-1 flex-col pl-0 lg:pl-72">
      <header
        class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/90"
      >
        <div class="px-4 py-3 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between gap-4">
            <div class="min-w-0 flex-1">
              <h1 class="truncate text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {{ pageTitle }}
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
              <ThemeToggle />

              <button
                type="button"
                class="relative rounded-xl p-2.5 text-slate-500 transition-all duration-300 hover:bg-slate-100 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-brand-400"
                aria-label="Notifications"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span
                  class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"
                />
              </button>

              <div class="relative">
                <button
                  type="button"
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
                  <svg
                    class="h-4 w-4 text-slate-400 transition-transform duration-300"
                    :class="{ 'rotate-180': showProfileMenu }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <transition name="dropdown">
                  <div
                    v-show="showProfileMenu"
                    class="absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft-lg dark:border-slate-700 dark:bg-slate-900"
                    role="menu"
                  >
                    <div
                      class="border-b border-slate-100 bg-gradient-to-br from-brand-50/80 to-accent-50/50 px-4 py-4 dark:border-slate-800 dark:from-slate-800 dark:to-slate-900"
                    >
                      <p class="text-sm font-semibold text-slate-900 dark:text-white">
                        {{ user?.first_name }} {{ user?.last_name }}
                      </p>
                      <p class="mt-1 truncate text-xs text-slate-600 dark:text-slate-400">{{ user?.email }}</p>
                    </div>

                    <router-link
                      to="/profile"
                      class="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      role="menuitem"
                      @click="showProfileMenu = false"
                    >
                      <svg class="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Mon profil
                    </router-link>

                    <button
                      type="button"
                      class="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:border-slate-800 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      role="menuitem"
                      @click="handleLogout"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </transition>
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
