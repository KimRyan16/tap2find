import ProfessorLayout from '@/layouts/ProfessorLayout.vue'
import Dashboard from '@/views/professor/Dashboard.vue'

const professorRoutes = [
  {
    path: '/professor',
    component: ProfessorLayout,
    meta: { requiresAuth: true, role: 'professor' }, // ✅ added here
    children: [
      {
        path: '',
        name: 'professor-dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, role: 'professor' },
      },
    ],
  },
]

export default professorRoutes
