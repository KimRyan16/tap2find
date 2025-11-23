<template>
  <div class="auth-page bg-white">
    <div aria-live="polite" class="fixed top-4 right-4 z-[9999] space-y-3">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="w-80 md:w-96 bg-white rounded-2xl shadow-lg border p-4 pr-5"
        :class="t.type === 'success' ? 'border-green-300' : 'border-red-300'"
      >
        <div v-if="t.barPosition==='top'" class="mb-3 h-1 rounded-full bg-gray-100 overflow-hidden">
          <div
            class="h-full"
            :class="t.type==='success' ? 'bg-green-500' : 'bg-red-500'"
            :style="{ animation: `toast-shrink ${t.duration}ms linear forwards` }"
          ></div>
        </div>
        <div class="flex items-start gap-3">
          <div
            class="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border"
            :class="t.type === 'success' ? 'border-green-400 text-green-600' : 'border-red-400 text-red-600'"
          >
            <svg v-if="t.type==='success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
              <path fill-rule="evenodd" d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0zm14.03-2.28a.75.75 0 10-1.06-1.06l-5.22 5.22-1.72-1.72a.75.75 0 10-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.75-5.75z" clip-rule="evenodd"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
              <path fill-rule="evenodd" d="M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM10.94 8.47a.75.75 0 011.06 0L12 8.47l.53-.53a.75.75 0 111.06 1.06L13.06 9.53l.53.53a.75.75 0 11-1.06 1.06L12 10.59l-.53.53a.75.75 0 11-1.06-1.06l.53-.53-.53-.53a.75.75 0 010-1.06z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="flex-1">
            <div class="text-xs font-semibold tracking-wide" :class="t.type==='success' ? 'text-green-700' : 'text-red-700'">
              {{ t.type === 'success' ? 'SUCCESS' : 'ERROR' }}
            </div>
            <div class="text-sm text-gray-700">
              {{ t.message }}
            </div>
          </div>
        </div>
        <div v-if="t.barPosition!=='top'" class="mt-3 h-1 rounded-full bg-gray-100 overflow-hidden">
          <div
            class="h-full"
            :class="t.type==='success' ? 'bg-green-500' : 'bg-red-500'"
            :style="{ animation: `toast-shrink ${t.duration}ms linear forwards` }"
          ></div>
        </div>
      </div>
    </div>
    <!-- Auth Card -->
    <div class="py-8 px-6 relative">
      <button @click="goBack" class="absolute top-2 left-2 p-2 text-gray-600">
        <iconify-icon icon="material-symbols:arrow-back-ios-rounded" class="w-5 h-5" />
      </button>
      <!-- Header -->
      <div class="text-center mb-8">
        <iframe
          src="https://lottie.host/embed/3aaed7c4-84f2-4923-bde8-ae95a2502fa6/zET5kXzx2P.lottie"
          class="w-40 h-40 md:w-48 md:h-48 mx-auto mb-2"
          style="border:0;"
          title="Verify email animation"
        ></iframe>
        <h1 class="text-3xl font-semibold text-gray-800">Verify Your Email</h1>
        <p class="text-gray-400">Enter the OTP sent to your email</p>
      </div>

      <!-- OTP Form -->
      <form @submit.prevent="verifyOTP" class="space-y-6">
        <!-- OTP Input Fields -->
        <div class="text-center mb-6">
          <p class="text-gray-600 mb-4">
            We've sent a 6-digit code to <strong>{{ email }}</strong>
          </p>
          
          <!-- OTP Input Container -->
          <div class="flex justify-center space-x-3 mb-6">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              :ref="el => otpInputs[index] = el"
              v-model="otpDigits[index]"
              type="text"
              maxlength="1"
              :disabled="isVerifying"
              class="w-12 h-12 text-center text-xl font-semibold bg-gray-50 rounded-md text-[#102A71] focus:border-[#102A71] focus:ring-1 focus:ring-[#102A71] focus:ring-opacity-100 transition-colors"
              :class="isVerifying ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''"
              @input="handleOTPInput(index, $event)"
              @keydown="handleKeyDown(index, $event)"
              @paste="handlePaste"
            />
          </div>
        </div>

        <!-- Timer -->
        <div class="text-center mb-6">
          <p class="text-sm text-gray-500">
            Code expires in: <span class="font-medium text-red-600">{{ formatTime(timeLeft) }}</span>
          </p>
        </div>

        <!-- Verify Button -->
        <button
          type="submit"
          :disabled="!isOTPComplete || isVerifying"
          class="w-full bg-[#F5C400] text-white py-3 px-4 rounded-full hover:bg-[#e8bc09] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
        >
          <span :class="isVerifying ? 'opacity-0' : ''">Verify OTP</span>
          <div v-if="isVerifying" class="absolute inset-0 flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </button>
      </form>

      <!-- Resend Section -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500 mb-4">
          Didn't receive the code?
        </p>
        
        <button
          @click="resendOTP"
          :disabled="isResending || timeLeft > 0 || isVerifying"
          class="text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative"
        >
          <span :class="isResending ? 'opacity-0' : ''">
            {{ timeLeft > 0 ? `Resend OTP (${formatTime(timeLeft)})` : 'Resend OTP' }}
          </span>
          <div v-if="isResending" class="absolute inset-0 flex items-center justify-center">
            <svg class="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </button>
        
        <div class="mt-4">
          <button
            @click="goToLogin"
            :disabled="isVerifying || isResending"
            class="text-gray-500 hover:text-gray-700 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/utils/api'

const router = useRouter()
const route = useRoute()

// Get email from route params or use default
const email = ref(route.query.email || 'your-email@example.com')

// OTP related state
const otpDigits = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const isVerifying = ref(false)
const isResending = ref(false)
const timeLeft = ref(300) // 5 minutes in seconds
let timer = null

// Toast state and helper
const toasts = ref([])
const defaultBarPosition = ref('bottom')
const setToastBarPosition = (pos) => {
  defaultBarPosition.value = pos === 'top' ? 'top' : 'bottom'
}
const showToast = (message, type = 'success', options = {}) => {
  let duration = 3000
  let barPosition = defaultBarPosition.value
  if (typeof options === 'number') {
    duration = options
  } else if (options && typeof options === 'object') {
    duration = options.duration ?? duration
    barPosition = options.barPosition ?? barPosition
  }
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type, duration, barPosition })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

// Computed properties
const isOTPComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '')
})

const otpCode = computed(() => {
  return otpDigits.value.join('')
})

// Timer functions
const startTimer = () => {
  timeLeft.value = 300 // Reset to 5 minutes
  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// OTP input handling
const handleOTPInput = (index, event) => {
  if (isVerifying.value) return
  
  const value = event.target.value
  
  // Only allow numbers
  if (!/^\d*$/.test(value)) {
    event.target.value = otpDigits.value[index]
    return
  }
  
  otpDigits.value[index] = value
  
  // Auto-focus next input
  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const handleKeyDown = (index, event) => {
  if (isVerifying.value) return
  
  // Handle backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
}

const handlePaste = (event) => {
  if (isVerifying.value) {
    event.preventDefault()
    return
  }
  
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  
  for (let i = 0; i < pastedData.length && i < 6; i++) {
    otpDigits.value[i] = pastedData[i]
  }
  
  // Focus the next empty input or the last one
  const nextEmptyIndex = otpDigits.value.findIndex(digit => digit === '')
  const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5
  otpInputs.value[focusIndex]?.focus()
}

// Verification function
const verifyOTP = async () => {
  if (!isOTPComplete.value || isVerifying.value) return;
  
  isVerifying.value = true;
  
  try {
    const payload = {
      emailAddress: email.value,
      otp: otpCode.value
    };

    const response = await api.post('/auth/verify-otp', payload);
    showToast(response.data.message || 'Email verified successfully!', 'success');
    setTimeout(() => {
      router.push('/auth/login');
    }, 1200);

  } catch (error) {
    console.error('Error verifying OTP:', error);
    const msg = error.response?.data?.message || 'Invalid or expired OTP. Please try again.';
    showToast(msg, 'error');
    otpDigits.value = ['', '', '', '', '', ''];
    otpInputs.value[0]?.focus();
  } finally {
    isVerifying.value = false;
  }
};

const resendOTP = async () => {
  if (timeLeft.value > 0 || isResending.value || isVerifying.value) return;
  
  isResending.value = true;
  
  try {
    const payload = { emailAddress: email.value };
    const response = await api.post('/auth/resend-otp', payload);
    
    showToast(response.data.message || 'New OTP sent successfully!', 'success');
    
    otpDigits.value = ['', '', '', '', '', ''];
    startTimer(); // restart countdown
  } catch (error) {
    console.error('Error resending OTP:', error);
    showToast(error.response?.data?.message || 'Failed to resend OTP. Please try again.', 'error');
  } finally {
    isResending.value = false;
  }
};

const goToLogin = () => {
  if (isVerifying.value || isResending.value) return
  router.push('/auth/login')
}

const goBack = () => {
  router.back()
}

// Lifecycle hooks
onMounted(() => {
  startTimer()
  // Focus first input
  setTimeout(() => {
    otpInputs.value[0]?.focus()
  }, 100)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
@keyframes toast-shrink {
  from { width: 100%; }
  to { width: 0%; }
}
</style>