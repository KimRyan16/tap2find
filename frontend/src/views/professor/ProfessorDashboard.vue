<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 py-4 md:p-4">
    <div class="px-0 md:px-6 pt-8 min-h-0">
      <div class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl bg-gray-100 p-4 md:p-5 ">
           <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :class="statusDotClass"></div>
              <span class="text-sm font-medium" :class="statusTextClass">
                {{ statusDisplayText }}
              </span>
            </div>
          </div>
          <!-- Removed change status dropdown -->
        </div>

        <!-- Statistics Cards (align with ManageStudentConcerns) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <!-- Skeletons -->
          <template v-if="loading">
            <div class="rounded-xl shadow p-4 md:p-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div class="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div class="rounded-xl shadow p-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                  <div class="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div class="rounded-xl shadow p-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div class="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
          <div class="rounded-xl shadow p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 grid place-items-center">
                <Icon icon="material-symbols:today" class="w-5 h-5" />
              </div>
              <div>
                <div class="text-sm text-gray-600">Total Concerns</div>
                <div class="text-xl sm:text-2xl font-bold">{{ statistics.total }}</div>
              </div>
            </div>
          </div>
          <div class="rounded-xl shadow p-4 md:p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 grid place-items-center">
                <Icon icon="formkit:week" class="w-5 h-5" />
              </div>
              <div>
                <div class="text-sm text-gray-600">Pending</div>
                <div class="text-xl sm:text-2xl font-bold">{{ statistics.pending }}</div>
              </div>
            </div>
          </div>
          <div class="rounded-xl shadow p-4 md:p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-green-100 text-green-600 grid place-items-center">
                <Icon icon="pajamas:task-done" class="w-5 h-5" />
              </div>
              <div>
                <div class="text-sm text-gray-600">Resolved</div>
                <div class="text-xl sm:text-2xl font-bold">{{ statistics.resolved }}</div>
              </div>
            </div>
          </div>
          </template>
        </div>

        <!-- Recent Student Concerns -->
        <div class="rounded-2xl shadow">
          <div class="p-4 md:p-5">
            <div class="text-lg sm:text-xl font-semibold">Recent Student Concerns</div>
            <div class="text-xs sm:text-sm text-gray-500">
              <span v-if="loading">Loading concerns...</span>
              <span v-else>You have {{ recentConcerns.length }} recent concerns</span>
            </div>
          </div>
          <div class="mt-1 md:mt-3">
            <!-- Skeleton list -->
            <div v-if="loading" class="divide-y divide-gray-200">
              <div v-for="n in 4" :key="`sk-rc-`+n" class="flex items-center justify-between gap-3 px-4 md:px-5 py-3">
                <div class="flex items-start gap-3 flex-1">
                  <div class="w-9 h-9 rounded-full bg-gray-200 animate-pulse"></div>
                  <div class="flex-1">
                    <div class="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div class="h-3 bg-gray-200 rounded w-40 mt-2 animate-pulse"></div>
                    <div class="h-3 bg-gray-200 rounded w-24 mt-2 animate-pulse"></div>
                  </div>
                  <div class="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <template v-else>
              <div
                v-for="(item, idx) in recentConcerns"
                :key="item.id"
                class="relative flex items-center justify-between gap-3 px-4 md:px-5 py-3 border-t border-gray-200">
                <div class="flex items-start gap-3 flex-1">
                  <div class="w-9 h-9 rounded-full overflow-hidden bg-orange-200 text-orange-700 grid place-items-center font-bold">
                    <img v-if="item.avatarUrl" :src="item.avatarUrl" alt="avatar" class="w-full h-full object-cover" />
                    <span v-else>{{ item.initials }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm sm:text-base font-semibold">{{ item.name }}</div>
                    <div class="text-xs sm:text-sm text-gray-500">{{ item.subject }}</div>
                    <div class="text-[11px] sm:text-xs text-gray-400 mt-1">{{ formatDate(item.createdAt) }}</div>
                  </div>
                  <div :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusClass(item.status)]">
                    {{ getStatusText(item.status) }}
                  </div>
                </div>
              </div>
              <div v-if="recentConcerns.length === 0" class="px-4 md:px-5 py-8 text-center text-gray-500 text-sm">
                No recent concerns found
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import api from '@/utils/api'

const openMenuId = ref(null)
const concerns = ref([])
const allConcerns = ref([])
const recentConcerns = ref([])
const loading = ref(false)
const pollInterval = ref(null) // Added for polling

const user = ref({
  id: '',
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: '',
  status: ''
})

const statistics = ref({
  total: 0,
  pending: 0,
  resolved: 0,
  today: 0,
  thisWeek: 0,
})

// Status computed properties
const statusTextClass = computed(() => {
  const currentStatus = user.value.status
  if (currentStatus === 'available') return 'text-green-700'
  if (currentStatus === 'busy') return 'text-orange-700'
  return 'text-red-700'
})

const statusDotClass = computed(() => {
  const currentStatus = user.value.status
  if (currentStatus === 'available') return 'bg-green-500'
  if (currentStatus === 'busy') return 'bg-orange-500'
  return 'bg-red-500'
})

const statusDisplayText = computed(() => {
  const currentStatus = user.value.status
  if (currentStatus === 'available') return 'Available'
  if (currentStatus === 'busy') return 'Busy'
  if (currentStatus === 'not-available') return 'Not Available'
  return 'Unknown'
})

// Fetch current user status from backend
const fetchCurrentUserStatus = async () => {
  try {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      console.error('No user found in localStorage')
      return
    }

    const parsedUser = JSON.parse(storedUser)
    const response = await api.get(`/professors/${parsedUser.id}/status`)
    
    if (response.data.success) {
      // Update the user status with real-time data
      user.value.status = response.data.data.status
      
      // Also update localStorage with the latest status
      const updatedUser = { ...parsedUser, status: response.data.data.status }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      console.log('✅ Updated user status:', response.data.data.status)
    }
  } catch (error) {
    console.error('Error fetching user status:', error)
  }
}

// Fetch all concerns and compute statistics (align with ManageStudentConcerns approach)
const fetchAllConcernsAndComputeStats = async () => {
  try {
    const professorId = user.value.id
    if (!professorId) {
      console.error('No professorId found for concerns')
      return
    }

    const response = await api.get('/professors/concerns', {
      params: { professorId, page: 1, limit: 500 }
    })

    if (response.data.success) {
      allConcerns.value = (response.data.data.inquiries || []).map(inquiry => ({
        id: inquiry.id || inquiry._id,
        name: inquiry.name,
        email: inquiry.email,
        initials: inquiry.initials,
        subject: inquiry.subject,
        message: inquiry.message,
        status: inquiry.status || 'pending',
        createdAt: inquiry.createdAt,
        updatedAt: inquiry.updatedAt,
        yearLevel: inquiry.yearLevel || 'Not specified',
        section: inquiry.section || '',
        studentId: inquiry.studentId
      }))
      computeStatisticsFromConcerns()
    }
  } catch (error) {
    console.error('Error fetching concerns for stats:', error)
    console.error('Error details:', error.response?.data)
  }
}

const isSameDay = (d) => {
  const x = new Date(d)
  const now = new Date()
  return x.getFullYear() === now.getFullYear() && x.getMonth() === now.getMonth() && x.getDate() === now.getDate()
}

const isInThisWeek = (d) => {
  const date = new Date(d)
  const now = new Date()
  // set to start of week (Mon)
  const day = now.getDay() || 7
  const first = new Date(now)
  first.setDate(now.getDate() - day + 1)
  first.setHours(0,0,0,0)
  const last = new Date(first)
  last.setDate(first.getDate() + 6)
  last.setHours(23,59,59,999)
  return date >= first && date <= last
}

const computeStatisticsFromConcerns = () => {
  const list = allConcerns.value || []
  const total = list.length
  const pending = list.filter(c => c.status === 'pending').length
  const resolved = list.filter(c => c.status === 'resolved').length
  const today = list.filter(c => c.createdAt && isSameDay(c.createdAt)).length
  const thisWeek = list.filter(c => c.createdAt && isInThisWeek(c.createdAt)).length
  statistics.value = { total, pending, resolved, today, thisWeek }
}

// Fetch recent concerns/inquiries
const fetchRecentConcerns = async () => {
  try {
    const professorId = user.value.id
    if (!professorId) {
      console.error('No professorId found for recent concerns')
      return
    }

    console.log('Fetching recent concerns for professor:', professorId)
    
    const response = await api.get('/professors/concerns/recent', {
      params: { professorId }
    })
    
    console.log('Recent concerns response:', response.data)
    
    if (response.data.success) {
      recentConcerns.value = response.data.data.map(concern => ({
        id: concern.id || concern._id,
        name: concern.name,
        subject: concern.subject,
        message: concern.message,
        initials: concern.initials,
        email: concern.email,
        avatarUrl: concern.avatarUrl || null,
        status: concern.status || 'pending',
        createdAt: concern.createdAt
      }))
      console.log('Mapped recent concerns:', recentConcerns.value)
    }
  } catch (error) {
    console.error('Error fetching recent concerns:', error)
    console.error('Error details:', error.response?.data)
  }
}

// ==============================
// 🔹 Polling Functions (NEW)
// ==============================
const fetchDashboardData = async () => {
  // Fetch all data that needs to be updated in real-time
  await Promise.all([
    fetchCurrentUserStatus(),
    fetchAllConcernsAndComputeStats(),
    fetchRecentConcerns()
  ])
}

const startPolling = () => {
  // Clear any existing interval
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
  
  // Start new polling interval (2000ms = 2 seconds)
  pollInterval.value = setInterval(fetchDashboardData, 2000)
  console.log('🔄 Started polling dashboard data every 2 seconds')
}

const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
    console.log('🛑 Stopped polling dashboard data')
  }
}

// Initial data load with loading state
const initializeData = async () => {
  try {
    loading.value = true
    await fetchDashboardData()
  } finally {
    loading.value = false
  }
}

// Real-time status polling (existing function - kept for backward compatibility)
let statusPollingInterval = null
const startStatusPolling = () => {
  // Poll every 5 seconds for status updates
  statusPollingInterval = setInterval(() => {
    fetchCurrentUserStatus()
  }, 5000)
}

// Helper functions for display text
const getTodayComparisonText = () => {
  if (statistics.value.today === 0) return 'No concerns today'
  return `${statistics.value.today} concern${statistics.value.today !== 1 ? 's' : ''} today`
}

const getWeekPendingText = () => {
  const pending = statistics.value.thisWeek - statistics.value.resolved
  if (pending > 0) {
    return `${pending} pending`
  }
  return 'All caught up!'
}

const getResolutionRate = () => {
  if (statistics.value.thisWeek === 0) return 0
  return Math.round((statistics.value.resolved / statistics.value.thisWeek) * 100)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'resolved':
      return 'bg-green-100 text-green-800'
    case 'accepted':
      return 'bg-green-100 text-green-800'
    case 'replied':
      return 'bg-blue-100 text-blue-800'
    case 'declined':
      return 'bg-red-100 text-red-800'
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'resolved':
      return 'Resolved'
    case 'accepted':
      return 'Accepted'
    case 'replied':
      return 'Replied'
    case 'declined':
      return 'Declined'
    case 'in-progress':
      return 'In Progress'
    default:
      return 'Pending'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date'
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function onReply(item) {
  openMenuId.value = null
}

function onDelete(item) {
  openMenuId.value = null
}

onMounted(async () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    console.log('Dashboard - User loaded:', user.value)
    
    // Initialize data and start polling
    await initializeData()
    
    // Start polling after initial load is complete
    startPolling()
    
    // Keep the existing status polling for backward compatibility
    startStatusPolling()
  } else {
    console.error('Dashboard - No user found in localStorage')
  }
})

// Clean up polling when component unmounts
onUnmounted(() => {
  if (statusPollingInterval) {
    clearInterval(statusPollingInterval)
  }
  // Clean up the new polling interval
  stopPolling()
})
</script>