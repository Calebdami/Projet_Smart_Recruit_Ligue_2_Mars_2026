<template>
  <div v-if="isSidebarOpen" class="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm transition-opacity lg:hidden" @click="closeSidebar" aria-hidden="true" />

  <aside
    :class="[
      'fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r shadow-2xl transition-transform duration-300 lg:translate-x-0',
      'border-slate-200 bg-white text-slate-900',
      'dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-black dark:via-black dark:to-black dark:text-white',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="border-b border-slate-200 px-5 py-7 dark:border-slate-800/80">
      <router-link to="/" class="group flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold shadow-lg transition-transform duration-300 group-hover:scale-105"
        >
          SR
        </div>
        <div class="min-w-0">
          <span
            class="block truncate text-lg font-bold tracking-tight text-slate-900 group-hover:text-brand-600 dark:bg-gradient-to-r dark:from-white dark:to-slate-300 dark:bg-clip-text dark:text-transparent transition-colors"
          >
            SmartRecruit
          </span>
          <span class="text-[10px] font-semibold uppercase tracking-widest text-accent-400/90">Talent Suite</span>
        </div>
      </router-link>
    </div>

    <nav class="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-5">
      <div v-for="(item, index) in menuItems" :key="index">
        <router-link
          v-if="item.to && (!item.adminOnly || user?.role === 'admin') && (!item.allowedRoles || item.allowedRoles.includes(user?.role)) && $can(item.permission)"
          :to="item.to"
          :class="[
            'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300',
            isActive(item.to, item.exact)
              ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-500/30 dark:bg-gradient-to-r dark:from-brand-600/25 dark:to-accent-600/10 dark:text-white dark:shadow-inner'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white',
          ]"
        >
          <span
            v-if="isActive(item.to, item.exact)"
            class="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-400 to-accent-400"
          />
          <span
            :class="[
              'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-300',
              isActive(item.to, item.exact)
                ? 'bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300'
                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700 dark:bg-slate-800/50 dark:text-slate-500 dark:group-hover:bg-slate-700/80 dark:group-hover:text-slate-200',
            ]"
          >
            <component :is="item.icon" class="h-5 w-5" />
          </span>
          <span class="flex-1 truncate">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            :class="item.badgeColor || 'bg-brand-500/25 text-brand-200'"
          >
            {{ item.badge }}
          </span>
        </router-link>

        <div v-if="item.divider" class="my-4 border-t border-slate-800/80" />
      </div>
    </nav>

    <div class="relative border-t border-slate-800/80 p-4">
      <div class="mb-3 flex items-center justify-between px-1">
        <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Apparence</span>
        <ThemeToggle />
      </div>

      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-800/80"
        @click="toggleUserMenu"
      >
        <div class="relative flex-shrink-0">
          <img
            v-if="user?.avatar_url"
            :src="user.avatar_url"
            :alt="user.first_name"
            class="h-10 w-10 rounded-xl object-cover ring-2 ring-brand-500/40"
          >
          <div
            v-else
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 text-sm font-bold"
          >
            {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
          </div>
          <div
            class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-500"
          />
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold">{{ user?.first_name }}</p>
          <p class="truncate text-xs capitalize text-slate-500">{{ user?.role }}</p>
        </div>
        <svg
          :class="['h-4 w-4 flex-shrink-0 text-slate-500 transition-transform', userMenuOpen ? 'rotate-180' : '']"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <transition name="slide-up">
        <div
          v-if="userMenuOpen"
          class="absolute inset-x-4 bottom-full mb-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-800/95 shadow-xl backdrop-blur-md"
        >
          <router-link
            to="/profile"
            class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-700/80 hover:text-white"
            @click="userMenuOpen = false"
          >
            <svg class="h-4 w-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            class="flex w-full items-center gap-2 border-t border-slate-700/80 px-4 py-2.5 text-sm text-rose-400 transition-colors hover:bg-rose-500/10"
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
  </aside>

  <div class="hidden w-72 flex-shrink-0 lg:block" aria-hidden="true" />
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useUI } from '@/composables/useUI'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { logout } = useAuth()
const { isSidebarOpen, closeSidebar } = useUI()
const ui = useUI()
const userMenuOpen = ref(false)

const user = computed(() => authStore.user)

const icon = (d) =>
  h(
    'svg',
    { fill: 'currentColor', viewBox: '0 0 20 20', class: 'h-full w-full' },
    [h('path', { d })]
  )

const HomeIcon = () =>
  icon(
    'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z'
  )

const UsersIcon = () =>
  icon(
    'M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 12a6 6 0 00-11.86 0v3h12v-3zM17 16a2 2 0 11-4 0 2 2 0 014 0z'
  )

const UserGroupIcon = () =>
  icon(
    'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z'
  )

const BriefcaseIcon = () =>
  icon(
    'M4 4a2 2 0 012-2h6a1 1 0 01.707.293l2.828 2.829A1 1 0 0115 4h1a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z'
  )

const ChartIcon = () =>
  icon('M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 3a1 1 0 011-1h2a1 1 0 011 1v13a1 1 0 01-1 1h-2a1 1 0 01-1-1V3z')

const DocumentIcon = () =>
  icon(
    'M4 4a2 2 0 012-2h6a1 1 0 01.707.293l2.828 2.829A1 1 0 0115 4h1a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z'
  )

const menuItems = [
  { label: 'Tableau de bord', to: '/', icon: HomeIcon, permission: 'view_own_profile' },
  { label: 'Mes Candidatures', to: '/my-applications', icon: DocumentIcon, permission: 'create_applications', allowedRoles: ['candidate'] },
  { label: 'Utilisateurs', to: '/users', icon: UsersIcon, permission: 'view_users' },
  { label: 'Candidats', to: '/candidates', icon: UsersIcon, permission: 'view_candidates', exact: true },
  { label: 'Assignation', to: '/candidates/assign', icon: UserGroupIcon, permission: 'view_candidates', adminOnly: true },
  { label: 'Offres', to: '/jobs', icon: BriefcaseIcon, permission: 'view_jobs' },
  { divider: true },
  { label: 'Analytique', to: '/analytics', icon: ChartIcon, permission: 'view_analytics', adminOnly: true },
  { label: 'Audit', to: '/audit', icon: DocumentIcon, permission: 'view_audit_logs' },
]

const isActive = (path, exact = false) => {
  if (exact) {
    return route.path === path
  }

  return route.path === path || route.path.startsWith(path + '/')
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const handleLogout = async () => {
  userMenuOpen.value = false
  try {
    const confirmed = await ui.confirmLogout()
    if (confirmed) {
      ui.setConfirmLoading(true)
      await logout()
    }
  } catch (e) {
    console.error(e)
  } finally {
    ui.setConfirmLoading(false)
  }
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(71, 85, 105, 0.45);
  border-radius: 4px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
