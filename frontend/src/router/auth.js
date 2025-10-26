import AuthLayout from '@/layouts/AuthLayout.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import VerifyEmail from '@/views/auth/VerifyEmail.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'

const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: Login,
      },
    ],
  },
  {
    path: '/register',
    name: 'register',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: Register,
      },
    ],
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: ForgotPassword,
      },
    ],
  },
  {
    path: '/:random/verify-email',
    name: 'verify-email',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: VerifyEmail,
      },
    ],
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    beforeEnter: (to, from, next) => {
      if (!to.query.token) {
        next('/forgot-password')
      } else {
        next()
      }
    }
  }

]

export default authRoutes
