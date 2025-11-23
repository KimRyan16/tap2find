<template>
  <section class="w-full p-4 md:p-6 flex items-center justify-center">
    <div class="max-w-md mx-auto text-center min-h-0 flex flex-col items-center justify-center pt-1">
      <!-- Animation (auto-loop) -->
      <div class="mt-12 flex justify-center mt-0 mb-12">
        <div class="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
          <iframe
            src="https://lottie.host/embed/7bc710c0-79e1-4538-9d1f-b891dd3c725b/PtEJ86BmeO.lottie"
            title="Tap Animation"
            class="w-full h-full"
            allow="autoplay"
            frameborder="0"
          ></iframe>
        </div>
      </div>

      <!-- Text -->
      <h1 class="text-3xl sm:text-3xl font-semibold text-[#102A71] mt-8 mb-16 sm:mb-4">Good day, Prof!</h1>
      <p class="text-xl sm:text-xl font-semibold ">Tap to start your day.</p>
      <p class="text-sm sm:text-base text-gray-500">
        Please tap your RFID to set your status to <span class="font-medium" :class="statusColorClass">{{ displayStatus }}</span> so students can find you.
      </p>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import api from '@/utils/api.js'

const user = ref({
  id: '',
  firstName: '',
  lastName: '',
  role: '',
  emailAddress: '',
  status: 'available'
})

// Use computed properties instead of computed function
const statusColorClass = computed(() => {
  const status = user.value.status?.toLowerCase()
  if (status === 'available') return 'text-green-600'
  if (status === 'busy') return 'text-yellow-600' // Changed to yellow-600 for better visibility
  return 'text-red-600' // Changed to red-600 for better visibility
})

const displayStatus = computed(() => {
  const status = user.value.status?.toLowerCase()
  if (status === 'available') return 'Available'
  if (status === 'busy') return 'Busy'
  if (status === 'not available') return 'Not Available'
  return 'Not Available' // Default fallback
})

const fetchCurrentUserStatus = async () => {
  try {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      console.error('No user found in localStorage')
      return
    }

    const parsedUser = JSON.parse(storedUser)
    // Initialize user data from localStorage first
    user.value = { ...parsedUser }

    // Then fetch the latest status from API (best-effort)
    try {
      const response = await api.get(`/professors/${parsedUser.id}/status`)
      if (response?.data?.success && response?.data?.data?.status) {
        user.value.status = response.data.data.status
        const updatedUser = { ...parsedUser, status: response.data.data.status }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        console.log('✅ Updated user status:', response.data.data.status)
      }
    } catch (innerErr) {
      // Silent fallback: keep local status
      console.warn('Status API unavailable, using local status')
    }
  } catch (error) {
    console.error('Error fetching user status:', error)
  }
}

onMounted(() => {
  // Load initial user data from localStorage immediately
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }

  // Fetch latest status
  fetchCurrentUserStatus()
})
</script>