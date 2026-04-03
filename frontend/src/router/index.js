import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('../views/core/Jobs.vue')
    },
    {
      path: '/candidates',
      name: 'candidates',
      component: () => import('../views/talent/Candidates.vue')
    },
    {
      path: '/candidates/:id',
      name: 'candidate-detail',
      component: () => import('../views/talent/CandidateDetail.vue')
    }
  ]
})

export default router
