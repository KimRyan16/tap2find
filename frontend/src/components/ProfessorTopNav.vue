<template>
  <div class="relative -mx-4 md:-mx-6 px-4 md:px-6 py-1.5 flex flex-row items-start justify-between flex-nowrap rounded-lg mx-0 mt-6 gap-2 sm:gap-3 lg:gap-32 min-h-[56px] sm:min-h-[72px]">
    <div class="flex-1 min-w-0">
      <h1 class="text-xs sm:text-xl md:text-3xl lg:text-4xl font-semibold text-gray-900">{{ currentPageTitle }}</h1>
      <p class="text-[10px] sm:text-sm md:text-base text-gray-500 break-words">{{ currentPageDescription }}</p>
    </div>

    <div v-if="!hideActions" class="flex items-center space-x-1 ml-2 sm:ml-auto shrink-0">
      <div class="relative">
        <button @click="toggleNotifications" class="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 text-2xl text-gray-600 hover:text-gray-600 relative transition-colors">
          <iconify-icon :icon="showNotifications ? 'ion:notifications' : 'ion:notifications-outline'" class="h-5 w-5" />
          <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 h-5 w-5 bg-[#F5C400] text-white text-xs rounded-full flex items-center justify-center">{{ notificationCount }}</span>
        </button>

        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div v-if="showNotifications" class="fixed left-1/2 top-16 -translate-x-1/2 w-[90vw] sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-[420px] sm:translate-x-0 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <!-- Header -->
            <div class="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center border-b border-gray-100">
              <h3 class="text-sm sm:text-xl font-bold text-gray-900">Notifications</h3>
              <button
                @click.stop="clearAll"
                :disabled="clearingAll"
                :aria-busy="clearingAll ? 'true' : 'false'"
                class="text-xs sm:text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!clearingAll">Mark all as read</span>
                <span v-else>Marking...</span>
              </button>
            </div>

            <!-- Notifications List -->
            <div class="max-h-96 overflow-y-auto px-4 sm:px-6 py-2">
              <template v-if="notifications && notifications.length">
                <!-- TODAY -->
                <div v-if="groupedNotificationsLimited.today.length">
                  <p class="text-xs sm:text-sm text-gray-500 font-semibold mt-2 mb-1">Today</p>
                  <ul>
                    <li
                      v-for="n in groupedNotificationsLimited.today"
                      :key="n._id"
                      class="flex items-start gap-2 sm:gap-3 py-2 sm:py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <div
                          v-if="n.isGeneral"
                          class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                          <iconify-icon icon="flowbite:laptop-code-solid" class="text-lg text-gray-700" />
                        </div>
                        <img
                          v-else
                          :src="n.avatar || '/profile.svg'"
                          alt="avatar"
                          class="w-10 h-10 rounded-full object-cover"
                        />
                      </div>

                      <div class="flex-1">
                        <p class="text-[11px] sm:text-base text-gray-900 font-medium">{{ n.title }}</p>
                        <p class="text-[10px] sm:text-sm text-gray-600">{{ n.message }}</p>
                        <p class="text-[9px] sm:text-xs text-gray-500 mt-1">{{ formatDate(n.createdAt) }}</p>
                      </div>

                      <template v-if="!n.read">
                        <button
                          @click.stop="markAsRead(n._id)"
                          class="text-gray-400 hover:text-gray-600"
                        >
                          <iconify-icon icon="mdi:check-circle-outline" />
                        </button>
                      </template>
                      <template v-else>
                        <span class="text-emerald-500">
                          <iconify-icon icon="mdi:check-circle" />
                        </span>
                      </template>
                    </li>
                  </ul>
                </div>

                <!-- YESTERDAY -->
                <div v-if="groupedNotificationsLimited.yesterday.length">
                  <p class="text-xs sm:text-sm text-gray-500 font-semibold mt-4 mb-1">Yesterday</p>
                  <ul>
                    <li
                      v-for="n in groupedNotificationsLimited.yesterday"
                      :key="n._id"
                      class="flex items-start gap-2 sm:gap-3 py-2 sm:py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <div
                          v-if="n.isGeneral"
                          class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                          <iconify-icon icon="flowbite:laptop-code-solid" class="text-lg text-gray-700" />
                        </div>
                        <img
                          v-else
                          :src="n.avatar || '/profile.svg'"
                          alt="avatar"
                          class="w-10 h-10 rounded-full object-cover"
                        />
                      </div>

                      <div class="flex-1">
                        <p class="text-[11px] sm:text-base text-gray-900 font-medium">{{ n.title }}</p>
                        <p class="text-[10px] sm:text-sm text-gray-600">{{ n.message }}</p>
                        <p class="text-[9px] sm:text-xs text-gray-500 mt-1">{{ formatDate(n.createdAt) }}</p>
                      </div>

                      <template v-if="!n.read">
                        <button
                          @click.stop="markAsRead(n._id)"
                          class="text-gray-400 hover:text-gray-600"
                        >
                          <iconify-icon icon="mdi:check-circle-outline" />
                        </button>
                      </template>
                      <template v-else>
                        <span class="text-emerald-500">
                          <iconify-icon icon="mdi:check-circle" />
                        </span>
                      </template>
                    </li>
                  </ul>
                </div>

                <!-- EARLIER -->
                <div v-if="groupedNotificationsLimited.earlier.length">
                  <p class="text-xs sm:text-sm text-gray-500 font-semibold mt-4 mb-1">Earlier</p>
                  <ul>
                    <li
                      v-for="n in groupedNotificationsLimited.earlier"
                      :key="n._id"
                      class="flex items-start gap-2 sm:gap-3 py-2 sm:py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <div
                          v-if="n.isGeneral"
                          class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                          <iconify-icon icon="flowbite:laptop-code-solid" class="text-lg text-gray-700" />
                        </div>
                        <img
                          v-else
                          :src="n.avatar || '/profile.svg'"
                          alt="avatar"
                          class="w-10 h-10 rounded-full object-cover"
                        />
                      </div>

                      <div class="flex-1">
                        <p class="text-[11px] sm:text-base text-gray-900 font-medium">{{ n.title }}</p>
                        <p class="text-[10px] sm:text-sm text-gray-600">{{ n.message }}</p>
                        <p class="text-[9px] sm:text-xs text-gray-500 mt-1">{{ formatDate(n.createdAt) }}</p>
                      </div>

                      <button
                        v-if="!n.read"
                        @click.stop="markAsRead(n._id)"
                        class="text-gray-400 hover:text-gray-600"
                      >
                        <iconify-icon icon="mdi:check-circle-outline" />
                      </button>
                    </li>
                  </ul>
                </div>
              </template>

              <!-- Empty State -->
              <div v-else class="flex flex-col items-center justify-center w-full text-center py-10 text-gray-500">
                <iconify-icon icon="mingcute:notification-off-line" class="block mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-2" />
                <p class="text-xs sm:text-sm">No notifications available.</p>
              </div>
            </div>

            <!-- Footer -->
            <div
              v-if="notifications.length >= 5"
              class="px-6 py-3 border-t border-gray-100 text-right bg-white rounded-b-lg"
            >
              <router-link to="/professor/notifications" class="text-sm text-[#102A71] hover:underline">
                View all
              </router-link>
            </div>
          </div>
        </transition>
      </div>

      <div class="relative">
        <button @click="toggleProfileMenu" class="flex items-center space-x-0 md:space-x-2 p-2 rounded-lg transition-colors">
          <div class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
            <img v-if="user.avatarUrl" :src="user.avatarUrl" alt="Profile" class="w-full h-full object-cover" />
            <img v-else src="/profile.svg" alt="Profile placeholder" class="w-full h-full object-cover" />
          </div>
          <div class="hidden md:flex flex-col items-start">
            <span class="text-sm font-semibold text-gray-900">Prof. {{ user.firstName }} {{ user.lastName }}</span>
            <span class="text-xs text-gray-500">{{ user.emailAddress }}</span>
          </div>
          <iconify-icon icon="lucide:chevron-down" class="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 -ml-1" />
        </button>

        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div v-if="showProfileMenu" class="absolute right-2 sm:right-0 mt-2 w-56 sm:w-full bg-white rounded-lg shadow-lg border border-gray-200 z-[60]">
            <div class="py-1">
              <router-link to="/professor/profile" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" @click="showProfileMenu = false">
                <iconify-icon icon="lucide:user" class="mr-2 h-4 w-4" />
                View Profile
              </router-link>
              <div class="border-t border-gray-100"></div>
              <button @click="showSignOutModal = true" class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors">
                <iconify-icon icon="lucide:log-out" class="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>

  <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="showSignOutModal" class="fixed inset-0 z-[9999]">
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="relative w-full h-full flex items-center justify-center p-4">
        <div class="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Sign out</h3>
          <p class="text-sm text-gray-600 mb-5">Are you sure you want to sign out?</p>
          <div class="flex gap-3 justify-center">
            <button @click="showSignOutModal = false" class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
            <button @click="confirmSignOut" class="px-4 py-2 rounded-lg bg-[#102A71] text-white hover:bg-[#102A71]/90">Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import api from '@/utils/api'
import dayjs from 'dayjs'

const props = defineProps({
  hideActions: { type: Boolean, default: false }
})

const fetchProfessorAvatar = async () => {
  try {
    const storedUser =
      localStorage.getItem('professor') ||
      localStorage.getItem('user') ||
      localStorage.getItem('currentUser')
    if (!storedUser) return
    const parsed = JSON.parse(storedUser)
    const id = parsed.id || parsed._id
    if (!id) return
    const { data } = await api.get(`/professors/${id}`)
    if (data?.success && data.professor) {
      // Always sync latest details so top nav reflects profile updates
      user.value.avatarUrl = data.professor.avatarUrl || '/profile.svg'
      user.value.firstName = data.professor.firstName || ''
      user.value.lastName = data.professor.lastName || ''
      user.value.emailAddress = data.professor.emailAddress || ''
    }
  } catch (e) {}
}

const router = useRouter()
const route = useRoute()

const showProfileMenu = ref(false)
const showNotifications = ref(false)
const showSignOutModal = ref(false)
const clearingAll = ref(false)
const pollInterval = ref(null) // Added for polling

const user = ref({
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: '',
  status: '',
  avatarUrl: '/profile.svg'
})

// --- Use global composable store ---
const { notifications, count, addNotification, markAsRead, clearAll: clearLocalNotifications } = useNotifications()

// --- Fetch notifications from backend ---
const fetchNotifications = async () => {
  try {
    const storedUser = localStorage.getItem('user') || 
                      localStorage.getItem('professor') || 
                      localStorage.getItem('currentUser')
    
    if (!storedUser) {
      console.error('❌ No user found in localStorage')
      return
    }

    const userData = JSON.parse(storedUser)
    const userId = userData._id || userData.id
    const userRole = userData.role // Get user role from stored data

    if (!userId) {
      console.error('❌ No user ID found in user data')
      return
    }

    if (!userRole) {
      console.error('❌ No user role found in user data')
      return
    }

    // Fetch ALL notifications (read and unread) with userId and userRole
    const { data } = await api.get(`/notification/get-all-notifications?userId=${userId}&userRole=${userRole}`)
    
    if (data.success) {
      notifications.value = data.data
      console.log(`🔄 Polled ${data.data.length} notifications for ${userRole}`)
    } else {
      console.warn('⚠️ Failed to fetch notifications:', data.message)
    }
  } catch (error) {
    console.error('❌ Error fetching notifications:', error)
  }
}

// ==============================
// 🔹 Polling Functions (NEW)
// ==============================
const startPolling = () => {
  // Clear any existing interval
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
  
  // Start new polling interval (2000ms = 2 seconds)
  pollInterval.value = setInterval(fetchNotifications, 2000)
  console.log('🔄 Started polling notifications every 2 seconds')
}

const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
    console.log('🛑 Stopped polling notifications')
  }
}

// Initial notifications load
const initializeNotifications = async () => {
  await fetchNotifications()
}

// --- Utility: format date nicely ---
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMinutes = Math.floor(diffMs / 60000)
  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

// --- Group by Today / Yesterday / Earlier ---
const groupedNotifications = computed(() => {
  const today = dayjs().startOf('day')
  const yesterday = dayjs().subtract(1, 'day').startOf('day')
  const groups = { today: [], yesterday: [], earlier: [] }

  notifications.value.forEach(n => {
    // Show all notifications; we'll style read vs unread
    const created = dayjs(n.createdAt)
    if (created.isAfter(today)) groups.today.push(n)
    else if (created.isAfter(yesterday)) groups.yesterday.push(n)
    else groups.earlier.push(n)
  })

  for (const key in groups) {
    groups[key].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  return groups
})

// Limit to the 5 most recent items across all groups while preserving section headers
const groupedNotificationsLimited = computed(() => {
  const limit = 5
  const result = { today: [], yesterday: [], earlier: [] }
  let remaining = limit
  const pushSome = (arr, dest) => {
    if (remaining <= 0) return
    const take = Math.min(arr.length, remaining)
    dest.push(...arr.slice(0, take))
    remaining -= take
  }
  pushSome(groupedNotifications.value.today, result.today)
  pushSome(groupedNotifications.value.yesterday, result.yesterday)
  pushSome(groupedNotifications.value.earlier, result.earlier)
  return result
})

// --- Notification count for badge ---
const notificationCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// --- Has unread? Controls dropdown content vs empty state ---
const hasUnread = computed(() => notifications.value.some(n => !n.read))

// --- UI Toggles ---
const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
  showNotifications.value = false
}

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value
  showProfileMenu.value = false
  if (showNotifications.value) await initializeNotifications()
}

const clearAll = async () => {
  try {
    if (clearingAll.value) return
    clearingAll.value = true
    // Keep dropdown open during action
    showNotifications.value = true
    const storedUser =
      localStorage.getItem('user') ||
      localStorage.getItem('professor') ||
      localStorage.getItem('currentUser')
    if (!storedUser) return console.error('❌ No user found in localStorage')

    const userData = JSON.parse(storedUser)
    const userId = userData._id || userData.id
    const userRole = userData.role

    await api.put('/notification/mark-all-read', { userId, userRole })

    // Locally mark all as read so badge goes to 0 and dropdown empties
    notifications.value = notifications.value.map(n => ({ ...n, read: true }))
  } catch (error) {
    console.error('❌ Error clearing notifications:', error)
  } finally {
    clearingAll.value = false
    // Ensure dropdown remains open after clearing
    showNotifications.value = true
  }
}

const logout = () => {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')
    localStorage.removeItem('professor')
    localStorage.removeItem('currentUser')
  } catch {}
  router.replace('/auth/login')
}

const confirmSignOut = () => {
  showSignOutModal.value = false
  logout()
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showProfileMenu.value = false
    showNotifications.value = false
  }
}

// --- Page Info Handling ---
const isDashboard = computed(() => route.path === '/professor')

const currentPageTitle = ref('Dashboard')
const currentPageDescription = ref('Welcome to your professor dashboard')

const updatePageInfo = () => {
  const path = route.path
  if (path === '/professor') {
    currentPageTitle.value = `Welcome back, Prof. ${user.value.firstName || 'Professor'}!`
    currentPageDescription.value = 'Manage inquiries, availability, and schedule'
  } else if (path.includes('/availability')) {
    currentPageTitle.value = 'Set Availability Status'
    currentPageDescription.value = 'Update your current availability for students'
  } else if (path.includes('/concerns')) {
    currentPageTitle.value = 'Manage Student Concerns'
    currentPageDescription.value = 'Review and respond to student concerns and inquiries'
  } else if (path.includes('/schedule')) {
    currentPageTitle.value = 'Upload Teaching Schedule'
    currentPageDescription.value = 'Upload a new schedule or edit your existing one'
  } else if (path.includes('/profile')) {
    currentPageTitle.value = 'Profile'
    currentPageDescription.value = 'Manage your profile information and preferences'
  } else if (path.includes('/notifications')) {
    currentPageTitle.value = 'Notifications'
    currentPageDescription.value = 'View all your notifications'
  }
}

// Watch for route changes, update page info and refresh user details
watch(
  () => route.path,
  async () => {
    updatePageInfo()
    await fetchProfessorAvatar()
  }
)

// Watch for user data changes and update page info when user loads
watch(user, () => {
  updatePageInfo()
}, { deep: true })

const initials = computed(() => {
  const first = user.value.firstName?.charAt(0).toUpperCase() || ''
  const last = user.value.lastName?.charAt(0).toUpperCase() || ''
  return first + last
})

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  // React to profile updates from the profile page
  window.addEventListener('profile:updated', fetchProfessorAvatar)
  
  // Load user from localStorage FIRST
  const storedUser =
    localStorage.getItem('professor') ||
    localStorage.getItem('user') ||
    localStorage.getItem('currentUser')
  console.log('Stored user:', storedUser) // Debug log
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    console.log('User data loaded:', user.value) // Debug log
  }
  
  // THEN call updatePageInfo
  updatePageInfo()
  
  await fetchProfessorAvatar()
  // Fetch initial notifications and start polling
  await initializeNotifications()
  startPolling()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('profile:updated', fetchProfessorAvatar)
  // Clean up polling interval when component is destroyed
  stopPolling()
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>