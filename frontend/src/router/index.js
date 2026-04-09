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
    path: '/candidates',
    name: 'Candidates',
    component: () => import('@/pages/CandidatesPage.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin', 'recruiter'], layout: 'MainLayout' }
  },
  {
    path: '/candidates/assign',
    name: 'CandidateAssignment',
    component: () => import('@/pages/CandidateAssignmentPage.vue'),
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
    path: '/terms',
    name: 'Terms',
    component: () => import('@/pages/TermsPage.vue'),
    meta: { layout: 'DefaultLayout' }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/pages/PrivacyPage.vue'),
    meta: { layout: 'DefaultLayout' }
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: () => import('@/pages/JobsListPage.vue'),
    meta: { requiresAuth: true, layout: 'MainLayout' }
  },
  {
    path: '/jobs/new',
    name: 'JobCreate',
    component: () => import('@/pages/JobCreatePage.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin', layout: 'MainLayout' }
  },
  {
    path: '/jobs/:id',
    name: 'JobDetail',
    component: () => import('@/pages/JobDetailPage.vue'),
    meta: { requiresAuth: true, layout: 'MainLayout' }
  },
  {
    path: '/jobs/:id/edit',
    name: 'JobEdit',
    component: () => import('@/pages/JobEditPage.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin', layout: 'MainLayout' }
  },
  {
    path: '/applications',
    name: 'Applications',
    component: () => import('@/pages/ApplicationsListPage.vue'),
    meta: { requiresAuth: true, requiresRole: ['admin', 'recruiter'], layout: 'MainLayout' }
  },
  {
    path: '/my-applications',
    name: 'MyApplications',
    component: () => import('@/pages/MyApplicationsPage.vue'),
    meta: { requiresAuth: true, requiresRole: 'candidate', layout: 'MainLayout' }
  },
  {
    path: '/applications/:id',
    name: 'ApplicationDetail',
    component: () => import('@/pages/ApplicationDetailPage.vue'),
    meta: { requiresAuth: true, layout: 'MainLayout' }
  },
  {
    path: '/candidates/:id',
    name: 'CandidateDetail',
    component: () => import('@/pages/CandidateDetailPage.vue'),
    meta: { requiresAuth: true, layout: 'MainLayout' }
  },
  {
    path: '/candidates/:id/cv',
    name: 'CandidateCV',
    component: () => import('@/pages/CandidateCVPage.vue'),
    meta: { requiresAuth: true, layout: 'MainLayout' }
  },
  {
    path: '/webinars',
    name: 'Webinars',
    component: () => import('@/pages/WebinarsListPage.vue'),
    meta: { requiresAuth: true, layout: 'MainLayout' }
  },
  {
    path: '/webinars/new',
    name: 'WebinarCreate',
    component: () => import('@/pages/WebinarCreatePage.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin', layout: 'MainLayout' }
  },
  {
    path: '/webinars/:id',
    name: 'WebinarDetail',
    component: () => import('@/pages/WebinarDetailPage.vue'),
    meta: { requiresAuth: true, layout: 'MainLayout' }
  },
  {
    path: '/automation',
    name: 'AutomationRules',
    component: () => import('@/pages/AutomationRulesPage.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin', layout: 'MainLayout' }
  },
  {
    path: '/emails/templates',
    name: 'EmailTemplates',
    component: () => import('@/pages/EmailTemplatesPage.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin', layout: 'MainLayout' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/pages/SettingsPage.vue'),
    meta: { requiresAuth: true, layout: 'MainLayout' }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/pages/NotificationsPage.vue'),
    meta: { requiresAuth: true, layout: 'MainLayout' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/AboutPage.vue'),
    meta: { layout: 'DefaultLayout' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/pages/ContactPage.vue'),
    meta: { layout: 'DefaultLayout' }
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('@/pages/HelpPage.vue'),
    meta: { layout: 'DefaultLayout' }
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
  if (to.meta.requiresRole) {
    const roles = Array.isArray(to.meta.requiresRole) ? to.meta.requiresRole : [to.meta.requiresRole]
    if (!roles.includes(userRole)) {
      next('/')
      return
    }
  }

  // Redirect authenticated users away from guest routes
  if (to.meta.guest && isAuthenticated) {
    next('/')
    return
  }

  next()
})

export default router
