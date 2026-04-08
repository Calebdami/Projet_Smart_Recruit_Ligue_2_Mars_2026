<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 via-white to-accent-50/20 transition-colors duration-300 dark:from-black dark:via-black dark:to-black mesh-bg">
    <nav
      class="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-black/85"
    >
      <!-- Mobile menu -->
      <transition name="dropdown">
        <div
          v-if="showMobileMenu"
          class="border-t border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden dark:border-slate-800 dark:bg-black/90"
        >
          <div class="flex flex-col gap-1">
            <router-link
              v-for="link in navLinks"
              v-show="link.show"
              :key="link.to"
              :to="link.to"
              class="rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200"
              :class="
                route.path === link.to
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              "
              @click="showMobileMenu = false"
            >
              {{ link.label }}
            </router-link>
          </div>
        </div>
      </transition>
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
const showMobileMenu = ref(false)

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
