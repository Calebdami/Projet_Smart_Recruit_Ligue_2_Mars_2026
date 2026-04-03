import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true, layout: 'MainLayout' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { guest: true, layout: 'AuthLayout' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/RegisterPage.vue'),
    meta: { guest: true, layout: 'AuthLayout' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/ProfilePage.vue'),
    meta: { requiresAuth: true, layout: 'MainLayout' }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/pages/UsersPage.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin', layout: 'MainLayout' }
  },
  {
    path: '/audit',
    name: 'AuditTrail',
    component: () => import('@/pages/AuditPage.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin', layout: 'MainLayout' }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/pages/AnalyticsPage.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin', layout: 'MainLayout' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { layout: 'DefaultLayout' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.user?.role

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Check if route requires specific role
  if (to.meta.requiresRole && userRole !== to.meta.requiresRole) {
    next('/')
    return
  }

  // Redirect authenticated users away from guest routes
  if (to.meta.guest && isAuthenticated) {
    next('/')
    return
  }

  next()
})

export default router
