<template>
  <div class="min-h-screen bg-white">
    <!-- Top Navigation Bar -->
    <nav class="bg-white shadow-lg border-b-4 border-blue-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo & Brand -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">S</span>
              </div>
              <div class="ml-3">
                <h1 class="text-xl font-bold text-gray-800">Student Portal</h1>
                <p class="text-xs text-gray-500">Tap2Find</p>
              </div>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link 
              to="/student" 
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              :class="{ 'text-blue-600 border-b-2 border-blue-600': $route.path === '/student' }"
            >
              Home
            </router-link>
            <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">My Classes</a>
            <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Assignments</a>
            <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Grades</a>
            <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Messages</a>
          </div>

          <!-- User Profile & Actions -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.5 19.5L9 15l3 3 6-6" />
              </svg>
              <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Profile Dropdown -->
            <div class="relative">
              <button @click="profileOpen = !profileOpen" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">{{ userInitials }}</span>
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-sm font-medium text-gray-700">{{ user.firstName }} {{ user.lastName }}</p>
                  <p class="text-xs text-gray-500">CS-2024</p>
                </div>
                <svg class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div v-if="profileOpen" class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</p>
                  <p class="text-xs text-gray-500">{{ user.emailAddress }}</p>
                </div>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile Settings</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Academic Records</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Help & Support</a>
                 <button
                    @click="confirmLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 rounded-md"
                  >
                    Logout
                  </button>

                  <!-- Custom confirmation modal [ Modify as needed ] -->
                  <div
                    v-if="showConfirm"
                    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                  >
                    <div class="bg-white rounded-lg shadow-lg p-6 w-80">
                      <h2 class="text-lg font-semibold mb-2">Confirm Logout</h2>
                      <p class="text-gray-600 mb-4">
                        Are you sure you want to log out, 
                        <span class="font-medium">{{ user.firstName }}</span>?
                      </p>

                      <div class="flex justify-end gap-3">
                        <button
                          @click="showConfirm = false"
                          class="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          @click="handleLogout"
                          class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link 
            to="/student" 
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
            @click="mobileMenuOpen = false"
          >
            Home
          </router-link>
          <a href="#" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">My Classes</a>
          <a href="#" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">Assignments</a>
          <a href="#" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">Grades</a>
          <a href="#" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">Messages</a>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-1">
      <router-view></router-view>
    </main>

    <!-- Quick Actions Floating Button -->
    <div class="fixed bottom-6 right-6 z-40">
      <button class="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Button -->
    <button 
      @click="mobileMenuOpen = !mobileMenuOpen"
      class="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg"
    >
      <svg class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showConfirm = ref(false)

// 🧩 Reactive user state
const user = ref({
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: ''
})

const mobileMenuOpen = ref(false)
const profileOpen = ref(false)

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    profileOpen.value = false
  }
}

const confirmLogout = () => {
  showConfirm.value = true
}

// Handle logout
const handleLogout = () => {
  // ✅ Clear session data
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('user')

  showConfirm.value = false

  // Redirect to login page
  router.push('/login')
}

const userInitials = computed(() => {
  const first = user.value.firstName?.charAt(0) || ''
  const last = user.value.lastName?.charAt(0) || ''
  return (first + last).toUpperCase()
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
   const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
