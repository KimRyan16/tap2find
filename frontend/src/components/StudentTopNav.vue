<template>
  <div class="relative -mx-4 md:-mx-6 px-4 md:px-6 py-1.5 flex flex-row items-start justify-between flex-nowrap rounded-lg mx-0 mt-6 gap-2 sm:gap-3 lg:gap-32 min-h-[56px] sm:min-h-[72px]">
    <!-- Navigation Menu Info -->
    <div class="flex-1 min-w-0">
      <h1 class="text-xs sm:text-xl md:text-3xl lg:text-4xl font-semibold text-gray-900">{{ currentPageTitle }}</h1>
      <p class="text-[10px] sm:text-sm md:text-base text-gray-500 break-words">{{ currentPageDescription }}</p>
    </div>

    <!-- Right Side - Notifications and Profile -->
    <div class="flex items-center space-x-1 ml-2 sm:ml-auto shrink-0">
      <!-- Notifications -->
      <div class="static sm:relative">
        <button
          @click="toggleNotifications"
          class="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 text-2xl text-gray-600 hover:text-gray-600 relative transition-colors"
        >
          <iconify-icon
            :icon="showNotifications ? 'ion:notifications' : 'ion:notifications-outline'"
            class="h-5 w-5"
          />
          <span
            v-if="notificationCount > 0"
            class="absolute -top-1 -right-1 h-5 w-5 bg-[#F5C400] text-white text-xs rounded-full flex items-center justify-center"
          >
            {{ notificationCount }}
          </span>
        </button>

        <!-- 🔽 Notifications Dropdown -->
        <Transition name="dropdown-center">
          <div
            v-if="showNotifications"
            class="fixed left-1/2 top-16 -translate-x-1/2 w-[90vw] sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-[420px] sm:translate-x-0 bg-white rounded-lg shadow-lg border border-gray-200 z-[70]"
          >
            <!-- Header -->
            <div class="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center border-b border-gray-100">
              <h3 class="text-sm sm:text-xl font-bold text-gray-900">Notifications</h3>
              <button
                @click.stop="clearAllNotifications"
                :disabled="notificationsLoading || clearingAll"
                class="text-xs sm:text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="clearingAll" class="inline-flex items-center">
                  <span class="w-3.5 h-3.5 border-2 border-gray-400/40 border-t-gray-600 rounded-full animate-spin"></span>
                </span>
                <span>{{ clearingAll ? 'Marking...' : 'Mark all as read' }}</span>
              </button>
            </div>

            <!-- Notifications List -->
            <div class="max-h-96 overflow-y-auto px-4 sm:px-6 py-2">
              <!-- Skeleton while loading -->
              <div v-if="notificationsLoading" class="space-y-4 animate-pulse">
                <div v-for="n in 3" :key="n" class="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                  <div class="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-3 w-40 bg-gray-200 rounded"></div>
                    <div class="h-3 w-56 bg-gray-100 rounded"></div>
                    <div class="h-2 w-24 bg-gray-100 rounded"></div>
                  </div>
                  <div class="w-5 h-5 bg-gray-100 rounded-full flex-shrink-0"></div>
                </div>
              </div>

              <template v-else-if="notifications && notifications.length">
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
                          class="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
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
                      class="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
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

                <!-- EARLIER -->
                <div v-if="groupedNotificationsLimited.earlier.length">
                  <p class="text-xs sm:text-sm text-gray-500 font-semibold mt-4 mb-1">Earlier</p>
                  <ul>
                    <li
                      v-for="n in groupedNotificationsLimited.earlier"
                      :key="n._id"
                      class="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
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
              </template>

              <!-- Empty State -->
              <div v-else-if="!notifications.length" class="flex flex-col items-center justify-center w-full text-center py-10 text-gray-500">
                <iconify-icon icon="mingcute:notification-off-line" class="block mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-2" />
                <p class="text-xs sm:text-sm">No notifications available.</p>
              </div>
            </div>

            <!-- Footer -->
            <div
              v-if="notifications.length >= 5"
              class="px-6 py-3 border-t border-gray-100 text-right bg-white rounded-b-lg"
            >
              <router-link to="/student/notifications" class="text-sm text-[#102A71] hover:underline">
                View all
              </router-link>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Profile -->
      <div class="relative">
        <button
          @click="toggleProfileMenu"
          class="flex items-center space-x-0 md:space-x-2 p-2 rounded-lg transition-colors"
        >
          <!-- Profile Picture -->
          <div class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
            <img v-if="user.avatarUrl" :src="user.avatarUrl" alt="Profile" class="w-full h-full object-cover" />
            <img v-else src="/profile.svg" alt="Profile placeholder" class="w-full h-full object-cover" />
          </div>
          
          <!-- Profile Info -->
          <div class="hidden md:flex flex-col items-start">
            <span class="text-sm font-semibold text-gray-900">{{ user.firstName }} {{ user.lastName }}</span>
            <span class="text-xs text-gray-500">{{ user.emailAddress }}</span>
          </div>
          
          <!-- Dropdown Icon -->
          <iconify-icon icon="lucide:chevron-down" class="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 -ml-1" />
        </button>

        <!-- Profile Dropdown Menu -->
        <Transition name="dropdown">
          <div
            v-if="showProfileMenu"
            class="absolute right-2 sm:right-0 mt-2 w-56 sm:w-full bg-white rounded-lg shadow-lg border border-gray-200 z-[60]"
          >
            <div class="py-1">
              <router-link
                to="/student/profile"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                @click="showProfileMenu = false"
              >
                <iconify-icon icon="lucide:user" class="mr-2 h-4 w-4" />
                View Profile
              </router-link>
              <div class="border-t border-gray-100"></div>
              <button
                @click="showSignOutModal = true"
                class="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
              >
                <iconify-icon icon="lucide:log-out" class="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>

  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
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

const router = useRouter()
const route = useRoute()

const showProfileMenu = ref(false)
const showNotifications = ref(false)
const showSignOutModal = ref(false)
const notificationsLoading = ref(false)
const clearingAll = ref(false)
const pollInterval = ref(null) // Added for polling

const user = ref({
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: ''
})

// --- Use global composable store ---
const { notifications, count, addNotification, markAsRead, clearAll } = useNotifications()

// --- Fetch notifications from backend ---
const fetchNotifications = async () => {
  try {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) return console.error('❌ No user found in localStorage')

    const userData = JSON.parse(storedUser)
    const userId = userData._id || userData.id
    const userRole = userData.role // Get user role

    // Fetch ALL notifications (read and unread) with userId and role
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

// Initial data load with loading state
const initializeNotifications = async () => {
  try {
    notificationsLoading.value = true
    await fetchNotifications()
  } finally {
    notificationsLoading.value = false
  }
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

// --- Notification count for badge (unread only) ---
const notificationCount = computed(() => notifications.value.filter(n => !n.read).length)

// --- Any unread? controls empty state ---
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

const clearAllNotifications = async () => {
  try {
    if (clearingAll.value) return
    clearingAll.value = true
    // Keep dropdown open during action
    showNotifications.value = true
    const storedUser = localStorage.getItem('user')
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
    localStorage.removeItem('student')
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
const isDashboard = computed(() => route.path.includes('/dashboard'))

const currentPageTitle = ref('Dashboard')
const currentPageDescription = ref('Welcome to your student dashboard')

const updatePageInfo = () => {
  const path = route.path
  if (path.includes('/dashboard')) {
    currentPageTitle.value = `Welcome back, ${user.value.firstName}!`
    currentPageDescription.value = 'Manage your professor inquiries and track availability'
  } else if (path.includes('/locate-professor')) {
    currentPageTitle.value = 'Locate Professor'
    currentPageDescription.value = 'Find and connect with professors'
  } else if (path.includes('/messages')) {
    currentPageTitle.value = 'Inquiries'
    currentPageDescription.value = 'Communicate with professors and manage your inquiries'
  } else if (path.includes('/notifications')) {
    currentPageTitle.value = 'Notifications'
    currentPageDescription.value = 'View all your notifications'
  } else if (path.includes('/profile')) {
    currentPageTitle.value = 'Profile'
    currentPageDescription.value = 'Manage your account information'
  } else if (path.includes('/settings')) {
    currentPageTitle.value = 'Settings'
    currentPageDescription.value = 'Manage your account preferences, notifications, and security'
  }
}

// --- Initials for Avatar ---
const initials = computed(() => {
  const first = user.value.firstName?.charAt(0).toUpperCase() || ''
  const last = user.value.lastName?.charAt(0).toUpperCase() || ''
  return first + last
})

// --- Watch for Route Change ---
watch(() => route.path, updatePageInfo)

// --- Lifecycle ---
onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  const storedUser = localStorage.getItem('user')
  if (storedUser) user.value = JSON.parse(storedUser)
  updatePageInfo()
  
  // Initialize notifications and start polling
  await initializeNotifications()
  startPolling()
  // Listen for profile updates to refresh avatar and details in real time
  window.addEventListener('profile:updated', () => {
    try {
      const u = localStorage.getItem('user')
      if (u) user.value = JSON.parse(u)
    } catch {}
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  // Clean up polling interval when component is destroyed
  stopPolling()
  window.removeEventListener('profile:updated', () => {})
})
</script>

<style scoped>
.dropdown-center-enter-active,
.dropdown-center-leave-active {
  transition: opacity 0.2s ease;
}
.dropdown-center-enter-from,
.dropdown-center-leave-to {
  opacity: 0;
}
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