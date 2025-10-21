import { createRouter, createWebHistory } from 'vue-router'

// Pages
import Login from '@/pages/login/Login.vue'
import Dashboard from '@/pages/dashboard/Dashboard.vue'
import KnowledgeBase from '@/views/KnowledgeBase.vue'
import AIConfiguration from '@/views/AIConfiguration.vue'
import UserManagement from '@/views/UserManagement.vue'

// Layout
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true, title: 'Login - Admin Panel' }
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: 'Dashboard - Admin Panel' }
      },
      {
        path: 'knowledge-base',
        name: 'KnowledgeBase',
        component: KnowledgeBase,
        meta: { title: 'Knowledge Base - Admin Panel' }
      },
      {
        path: 'ai-configuration',
        name: 'AIConfiguration',
        component: AIConfiguration,
        meta: { title: 'AI Configuration - Admin Panel' }
      },
      {
        path: 'user-management',
        name: 'UserManagement', 
        component: UserManagement,
        meta: { title: 'User Management - Admin Panel' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// Guard
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Admin Panel'
  const token = localStorage.getItem('authToken')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' })
  } else if (to.meta.requiresGuest && token) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router