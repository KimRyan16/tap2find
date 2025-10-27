import StudentLayout from '@/layouts/StudentLayout.vue'
import Home from '@/views/student/Home.vue'

const studentRoutes = [
  {
    path: '/student',
    component: StudentLayout,
    meta: { requiresAuth: true, role: 'student' }, // ✅ added here
    children: [
      {
        path: '',
        name: 'student-home',
        component: Home,
        meta: { requiresAuth: true, role: 'student' }
      },
    ],
  },
]

export default studentRoutes
