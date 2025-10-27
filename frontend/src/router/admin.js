import AdminLayout from '@/layouts/AdminLayout.vue'
import Dashboard from '@/views/admin/Dashboard.vue'

const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' }, // ✅ added here
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, role: 'admin' }
      },
    ],
  },
]

export default adminRoutes
