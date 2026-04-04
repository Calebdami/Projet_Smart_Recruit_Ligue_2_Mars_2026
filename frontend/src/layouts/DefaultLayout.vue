<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 via-white to-accent-50/20 transition-colors duration-300 dark:from-black dark:via-black dark:to-black mesh-bg">
    <nav
      class="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-black/85"
    >
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <router-link to="/" class="group flex items-center gap-2.5">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow"
          >
            <svg class="h-5 w-5 text-white" fill="blue" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span
            class="text-lg font-bold text-slate-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400"
          >
            SmartRecruit
          </span>
        </router-link>

        <div class="flex items-center gap-2 sm:gap-4">
          <div class="hidden items-center gap-1 sm:flex">
            <router-link
              v-for="link in navLinks"
              v-show="link.show"
              :key="link.to"
              :to="link.to"
              class="rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
              :class="
                route.path === link.to
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              "
            >
              {{ link.label }}
            </router-link>
          </div>
          <ThemeToggle />

          <div v-if="user" class="relative">
            <button
              type="button"
              class="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              @click="toggleProfileMenu"
            >
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 text-xs font-bold text-black"
              >
                {{ initials }}
              </div>
              <svg
                class="h-4 w-4 text-slate-400 transition-transform"
                :class="{ 'rotate-180': showProfileMenu }"
                fill=""
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition name="dropdown">
              <div
                v-show="showProfileMenu"
                class="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <div class="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <div class="font-semibold text-slate-900 dark:text-white">{{ displayName }}</div>
                  <div class="truncate text-sm text-slate-500 dark:text-slate-400">{{ user?.email }}</div>
                </div>
                <router-link
                  to="/profile"
                  class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  @click="showProfileMenu = false"
                >
                  Profil
                </router-link>
                <button
                  type="button"
                  class="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:border-slate-800 dark:text-rose-400 dark:hover:bg-rose-950/30"
                  @click="handleLogout"
                >
                  Déconnexion
                </button>
              </div>
            </transition>
          </div>

          <div v-else class="flex items-center gap-2">
            <router-link
              to="/login"
              class="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
            >
              Connexion
            </router-link>
            <router-link to="/register" class="btn-primary !py-2 !text-sm"> S'inscrire </router-link>
          </div>
        </div>
      </div>
    </nav>

    <div class="min-h-[calc(100vh-4rem)]">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import { useUI } from '@/composables/useUI'
import { usePermissions } from '@/composables/usePermissions'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { logout } = useAuth()
const ui = useUI()
const { hasPermission } = usePermissions()

const user = computed(() => authStore.user)
const showProfileMenu = ref(false)

const initials = computed(() => {
  const u = user.value
  if (!u) return '?'
  const a = (u.first_name || u.firstName || '').charAt(0)
  const b = (u.last_name || u.lastName || '').charAt(0)
  return (a + b).toUpperCase() || '?'
})

const displayName = computed(() => {
  const u = user.value
  if (!u) return ''
  if (u.first_name || u.last_name) return `${u.first_name || ''} ${u.last_name || ''}`.trim()
  if (u.firstName || u.lastName) return `${u.firstName || ''} ${u.lastName || ''}`.trim()
  return u.email || 'Utilisateur'
})

const navLinks = computed(() => [
  { to: '/', label: 'Accueil', show: true },
  { to: '/users', label: 'Utilisateurs', show: hasPermission('view_users') },
  { to: '/audit', label: 'Audit', show: hasPermission('view_audit_logs') },
])

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const handleLogout = async () => {
  try {
    const confirmed = await ui.confirmLogout()
    if (confirmed) {
      ui.setConfirmLoading(true)
      await logout()
      ui.showSuccess('Déconnexion', 'À bientôt.')
      router.push('/login')
    }
  } catch (e) {
    console.error(e)
  } finally {
    ui.setConfirmLoading(false)
    showProfileMenu.value = false
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
