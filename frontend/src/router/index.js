import { createRouter, createWebHistory } from 'vue-router'
import landingRoutes from '@/router/landing.js'
import authRoutes from '@/router/auth.js'
import adminRoutes from '@/router/admin.js'
import professorRoutes from '@/router/professor.js'
import studentRoutes from '@/router/student.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Landing routes
    ...landingRoutes,
    // Auth routes
    ...authRoutes,
    // Admin routes
    ...adminRoutes,
    // Professor routes
    ...professorRoutes,
    // Student routes
    ...studentRoutes,
  ],
  // Ensure each navigation starts at the top unless using back/forward
  scrollBehavior(to, from, savedPosition) {
    // Browser back/forward or popstate restores previous position
    if (savedPosition) return savedPosition
    // Navigate to an anchor on the page
    if (to.hash) return { el: to.hash, top: 0, behavior: 'smooth' }
    // Default: scroll to top-left
    return { left: 0, top: 0 }
  },
})

// ✅ Navigation Guard (Middleware)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')

  const clearSession = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')
    localStorage.removeItem('admin')
    localStorage.removeItem('professor')
    localStorage.removeItem('student')
    localStorage.removeItem('currentUser')
  }

  // If navigating to any auth page, clear session to prevent forward navigation from restoring a logged-in state
  if (to.path.startsWith('/auth')) {
    clearSession()
    return next()
  }

  // Check if the route needs authentication
  const requiresAuth = to.matched.some(record => record.meta?.requiresAuth)

  // 🧩 If route requires login but no token
  if (requiresAuth && !token) {
    clearSession()
    return next('/auth/login')
  }

  // 👮 If route has role restrictions
  const requiredRoles = to.matched
    .filter(record => record.meta?.role)
    .map(record => record.meta.role)

  // ⚙️ Allow login process to complete first before redirect
  // If the route has a required role but we don't yet have one, skip check temporarily
  if (requiredRoles.length > 0) {
    if (!userRole) {
      // Let first-time navigation after login finish
      return next()
    }

    // If user role does not match required role
    if (!requiredRoles.includes(userRole)) {
      clearSession()
      return next('/unauthorized')
    }
  }

  // Allow visiting /login and /register even if already authenticated

  return next()
})

// Handle back/forward cache restores: if a protected page is restored from BFCache
// and there is no token, force redirect to login.
window.addEventListener('pageshow', () => {
  const token = localStorage.getItem('token')
  if (token) return
  const current = router.currentRoute.value
  const requiresAuth = current.matched.some(record => record.meta?.requiresAuth)
  if (requiresAuth) {
    router.replace('/auth/login')
  }
})

export default router
