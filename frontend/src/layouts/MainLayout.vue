<template>
  <div class="flex min-h-screen bg-slate-100/80 transition-colors duration-300 dark:bg-black">
    <TheSidebar />

    <div class="flex min-h-screen flex-1 flex-col pl-0 lg:pl-72">
      <header
        class="sticky top-0 z-[100] border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-black/95"
      >
        <div class="px-3 py-2.5 sm:px-6 sm:py-3 lg:pl-4 lg:pr-8">
          <div class="flex items-center justify-between gap-3 sm:gap-4">
            <!-- Mobile menu button -->
            <button
              type="button"
              class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 active:scale-95"
              @click="toggleSidebar"
            >
              <span class="sr-only">Open sidebar</span>
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <!-- Page Title & Logo (mobile) -->
            <div class="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <div class="flex lg:hidden shrink-0">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-[10px] font-bold text-white shadow-md sm:h-9 sm:w-9 sm:rounded-xl sm:text-xs">
                  SR
                </div>
              </div>
              <div class="min-w-0">
                <h1 class="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl lg:text-2xl">
                  {{ pageTitle }}
                </h1>
                <div class="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                  <span class="inline-flex items-center gap-1 capitalize font-medium">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
                    {{ user?.role }}
                  </span>
                  <span class="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
                  <span class="hidden md:inline">{{ statusLine }}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-shrink-0 items-center gap-2 sm:gap-3">
              <!-- Profile Dropdown -->
              <div class="relative">
                <button
                  type="button"
                  class="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 py-1 pl-1 pr-1.5 transition-all duration-300 hover:border-brand-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-slate-600 dark:hover:bg-slate-800 sm:gap-2.5 sm:py-1.5 sm:pl-1.5 sm:pr-3"
                  @click="toggleProfileMenu"
                >
                  <div class="relative flex-shrink-0">
                    <img
                      v-if="user?.avatar_url"
                      :src="user.avatar_url"
                      :alt="user.first_name"
                      class="h-7 w-7 rounded-lg object-cover ring-2 ring-white dark:ring-slate-800 sm:h-9 sm:w-9"
                    >
                    <div
                      v-else
                      class="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 text-[10px] font-bold text-white shadow-md sm:h-9 sm:w-9 sm:text-xs"
                    >
                      {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
                    </div>
                    <div
                      class="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900 sm:h-2.5 sm:w-2.5"
                    />
                  </div>
                  <div class="hidden text-left sm:block">
                    <p class="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {{ user?.first_name ?? 'User' }}
                    </p>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{ user?.role ?? 'Member' }}</p>
                  </div>
                  <svg
                    class="h-3.5 w-3.5 text-slate-400 transition-transform sm:h-4 sm:w-4"
                    :class="{ 'rotate-180': showProfileMenu }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Profile Menu Dropdown -->
                <transition name="dropdown">
                  <div
                    v-if="showProfileMenu"
                    class="absolute right-0 z-[110] mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div class="p-1">
                      <router-link
                        to="/profile"
                        class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <svg class="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mon profil
                      </router-link>
                      <button
                        type="button"
                        class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                        @click="handleLogout"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1">
        <div class="px-4 py-6 sm:px-6 lg:pl-4 lg:pr-8 lg:py-8">
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
const { toggleSidebar, ...ui } = useUI()

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
