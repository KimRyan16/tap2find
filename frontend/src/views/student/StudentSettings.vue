<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <div class="px-4 md:px-6 pt-8">
      <div class="mb-4">
        <button @click="goBack" class="inline-flex items-center gap-2 text-sm font-medium text-gray-700 ">
          <iconify-icon icon="ion:chevron-back" class="text-base" />
          <span>Back</span>
        </button>
      </div>
      <h1 class="text-4xl font-semibold text-gray-900 ">Settings</h1>
      <p class="text-base text-gray-500 mb-6">Manage your account preferences, notifications, and security.</p>

    <!-- Skeleton Loading -->
    <div v-if="isLoading" class="space-y-6 animate-pulse">
      <section class="bg-white shadow rounded-xl p-5">
        <div class="h-5 w-40 bg-gray-200 rounded mb-4"></div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="h-10 bg-gray-100 rounded sm:col-span-2"></div>
          <div class="h-10 bg-gray-100 rounded"></div>
          <div class="h-10 bg-gray-100 rounded"></div>
        </div>
      </section>
      <section class="bg-white shadow rounded-xl p-5">
        <div class="h-5 w-48 bg-gray-200 rounded mb-4"></div>
        <div class="h-10 bg-gray-100 rounded mb-3"></div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="h-16 bg-gray-100 rounded"></div>
          <div class="h-16 bg-gray-100 rounded"></div>
        </div>
      </section>
      <section class="bg-white shadow rounded-xl p-5">
        <div class="h-5 w-52 bg-gray-200 rounded mb-4"></div>
        <div class="h-10 bg-gray-100 rounded mb-2"></div>
        <div class="h-10 bg-gray-100 rounded mb-2"></div>
      </section>
    </div>

    <!-- Main Content -->
    <div v-else>

    <!-- Change Password -->
    <section class="bg-white shadow rounded-xl p-5 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label class="block text-sm text-gray-600 mb-1">Current Password</label>
          <input v-model="password.current" type="password" class="w-full border rounded-lg px-3 py-2 focus:outline-none " />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">New Password</label>
          <input v-model="password.new" type="password" class="w-full border rounded-lg px-3 py-2 focus:outline-none " />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Confirm New Password</label>
          <input v-model="password.confirm" type="password" class="w-full border rounded-lg px-3 py-2 focus:outline-none " />
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          @click="savePassword"
          :disabled="savingPassword"
          class="px-4 py-2 rounded-lg bg-[#102A71] text-white hover:bg-[#102A71]/90 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span v-if="savingPassword" class="inline-flex items-center">
            <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
          </span>
          <span>{{ savingPassword ? 'Updating...' : 'Update Password' }}</span>
        </button>
      </div>
    </section>

    <!-- Notifications -->
    <section class="bg-white shadow rounded-xl p-5 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Received Notification</h2>
      <div class="flex items-center justify-between mb-4">
        <div>
          <div class="text-sm font-medium text-gray-900">Notifications</div>
          <div class="text-xs text-gray-500">Turn on/off all notifications</div>
        </div>
        <label class="inline-flex items-center cursor-pointer">
          <input type="checkbox" class="sr-only peer" v-model="notify.enabled" />
          <div class="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-[#102A71] transition-colors relative">
            <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform" :class="notify.enabled ? 'translate-x-5' : ''"></div>
          </div>
        </label>
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="border rounded-lg p-4" :class="notify.enabled ? 'opacity-100' : 'opacity-50'">
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-medium text-gray-900">Email</div>
            <input type="checkbox" v-model="notify.channels.email" :disabled="!notify.enabled" />
          </div>
          <div class="text-xs text-gray-500">Receive updates via email</div>
        </div>
        <div class="border rounded-lg p-4" :class="notify.enabled ? 'opacity-100' : 'opacity-50'">
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-medium text-gray-900">SMS</div>
            <input type="checkbox" v-model="notify.channels.sms" :disabled="!notify.enabled" />
          </div>
          <div class="text-xs text-gray-500">Receive updates via SMS</div>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          @click="saveNotifications"
          :disabled="savingNotifications"
          class="px-4 py-2 rounded-lg bg-[#102A71] text-white hover:bg-[#102A71]/90 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span v-if="savingNotifications" class="inline-flex items-center">
            <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
          </span>
          <span>{{ savingNotifications ? 'Saving...' : 'Save Preferences' }}</span>
        </button>
      </div>
    </section>

    <!-- Login & Security -->
    <section class="bg-white shadow rounded-xl p-5">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Login & Security</h2>
      <div class="space-y-5">
        

        <!-- Active sessions -->
        <div class="border rounded-xl">
          <div class="bg-gray-100 px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-900">
            <span>Active Sessions / Devices</span>
            <button class="text-xs text-[#102A71] hover:underline disabled:opacity-60" @click="refreshSessions" :disabled="refreshing">
              {{ refreshing ? 'Refreshing...' : 'Refresh' }}
            </button>
          </div>
          <ul>
            <li
              v-for="(s, i) in sessions"
              :key="s.id || i"
              class="flex items-start justify-between px-4 py-4 border-t"
            >
              <div class="flex flex-col gap-0.5">
                <div class="flex items-center gap-2 text-sm">
                  <span class="text-gray-900 font-medium">{{ s.device || 'Unknown Browser' }}</span>
                  <span v-if="s.isCurrent" class="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">Current</span>
                </div>
                <div class="text-xs text-gray-500">
                  <span>{{ s.location || 'Localhost' }}</span>
                  <span v-if="s.ipAddress"> • {{ s.ipAddress }}</span>
                </div>
                <div class="text-xs text-gray-500">Last active: {{ formatRelativeTime(s.lastActive) }}</div>
              </div>
              <div class="text-right">
                <div v-if="s.isCurrent" class="text-[11px] text-gray-400">Current session</div>
                <button
                  v-else
                  class="text-xs text-red-600 hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                  @click="signOutSession(i)"
                  :disabled="signingOutIndex === i || signingOutAll"
                >
                  {{ signingOutIndex === i ? 'Signing out...' : 'Sign out' }}
                </button>
              </div>
            </li>
          </ul>
        </div>

        <div class="flex justify-end">
          <button
            class="px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-200 mr-2 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            @click="signOutAll"
            :disabled="signingOutAll"
          >
            <span v-if="signingOutAll" class="inline-flex items-center">
              <span class="w-4 h-4 border-2 border-red-400/40 border-t-red-500 rounded-full animate-spin"></span>
            </span>
            <span>{{ signingOutAll ? 'Signing out...' : 'Sign out of all devices' }}</span>
          </button>
        </div>
      </div>
    </section>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.back()
}

// Toast helper (bottom-right, white card, icon + title, progress line)
const showToast = (message, type = 'success', duration = 2800) => {
  let container = document.getElementById('t2f-toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 't2f-toast-container'
    container.style.position = 'fixed'
    container.style.bottom = '16px'
    container.style.right = '16px'
    container.style.zIndex = '9999'
    container.style.display = 'flex'
    container.style.flexDirection = 'column-reverse'
    container.style.gap = '10px'
    document.body.appendChild(container)
  }

  const colors = type === 'success'
    ? { border: '#34D399', text: '#065F46', iconBg: '#ECFDF5', iconFg: '#10B981', bar: '#6EE7B7' }
    : { border: '#F87171', text: '#7F1D1D', iconBg: '#FEF2F2', iconFg: '#EF4444', bar: '#FCA5A5' }

  const toast = document.createElement('div')
  toast.style.minWidth = '280px'
  toast.style.maxWidth = '460px'
  toast.style.background = '#FFFFFF'
  toast.style.border = `1.5px solid ${colors.border}`
  toast.style.borderRadius = '14px'
  toast.style.boxShadow = '0 12px 20px -6px rgba(0,0,0,0.12), 0 6px 10px -4px rgba(0,0,0,0.06)'
  toast.style.overflow = 'hidden'
  toast.style.opacity = '0'
  toast.style.transform = 'translateY(12px)'
  toast.style.transition = 'opacity 220ms ease, transform 220ms ease'

  const row = document.createElement('div')
  row.style.display = 'flex'
  row.style.alignItems = 'center'
  row.style.gap = '12px'
  row.style.padding = '12px 16px'

  const iconWrap = document.createElement('div')
  iconWrap.style.width = '26px'
  iconWrap.style.height = '26px'
  iconWrap.style.borderRadius = '50%'
  iconWrap.style.background = colors.iconBg
  iconWrap.style.display = 'flex'
  iconWrap.style.alignItems = 'center'
  iconWrap.style.justifyContent = 'center'
  iconWrap.style.flex = '0 0 auto'

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  icon.setAttribute('viewBox', '0 0 24 24')
  icon.setAttribute('width', '16')
  icon.setAttribute('height', '16')
  icon.innerHTML = type === 'success'
    ? `<path d="M9 12.75 11.25 15 15 9.75" fill="none" stroke="${colors.iconFg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M12 8v4m0 4h.01" fill="none" stroke="${colors.iconFg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" fill="none" stroke="${colors.iconFg}" stroke-width="1.5" opacity="0.25"/>`
  iconWrap.appendChild(icon)

  const textBlock = document.createElement('div')
  textBlock.style.display = 'flex'
  textBlock.style.flexDirection = 'column'
  textBlock.style.gap = '2px'

  const title = document.createElement('div')
  title.textContent = type === 'success' ? 'SUCCESS' : 'ERROR'
  title.style.fontSize = '12px'
  title.style.fontWeight = '800'
  title.style.letterSpacing = '0.04em'
  title.style.color = colors.text

  const body = document.createElement('div')
  body.textContent = message
  body.style.fontSize = '14px'
  body.style.fontWeight = '600'
  body.style.color = '#111827'

  textBlock.appendChild(title)
  textBlock.appendChild(body)

  row.appendChild(iconWrap)
  row.appendChild(textBlock)

  const barWrap = document.createElement('div')
  barWrap.style.height = '2px'
  barWrap.style.background = 'transparent'
  barWrap.style.width = '100%'
  const bar = document.createElement('div')
  bar.style.height = '100%'
  bar.style.width = '100%'
  bar.style.background = colors.bar
  bar.style.transition = `width ${duration}ms linear`
  barWrap.appendChild(bar)

  toast.appendChild(row)
  toast.appendChild(barWrap)
  container.appendChild(toast)

  requestAnimationFrame(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateY(0)'
    requestAnimationFrame(() => (bar.style.width = '0%'))
  })

  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(8px)'
    setTimeout(() => {
      toast.remove()
      if (!container.childElementCount) container.remove()
    }, 240)
  }, duration)
}

// Change Password
const password = ref({ current: '', new: '', confirm: '' })
const passwordMessage = ref('')
const passwordOk = ref(false)
const savingPassword = ref(false)
const savePassword = async () => {
  if (savingPassword.value) return
  passwordOk.value = false
  passwordMessage.value = ''
  if (!password.value.current || !password.value.new || !password.value.confirm) {
    showToast('Please complete all password fields.', 'error')
    return
  }
  if (password.value.new !== password.value.confirm) {
    showToast('New password and Confirm password do not match.', 'error')
    return
  }
  if (password.value.new.length < 8) {
    showToast('New password must be at least 8 characters.', 'error')
    return
  }
  const token = localStorage.getItem('token') || localStorage.getItem('t2f_token')
  if (!token) {
    showToast('Not authenticated. Please log in again.', 'error')
    return
  }
  savingPassword.value = true
  try {
    const res = await fetch('http://localhost:3000/api/auth/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword: password.value.current,
        newPassword: password.value.new,
        confirmPassword: password.value.confirm,
      })
    })
    const data = await res.json()
    if (!res.ok || data.success === false) {
      throw new Error(data.message || 'Failed to update password')
    }
    passwordOk.value = true
    passwordMessage.value = ''
    password.value = { current: '', new: '', confirm: '' }
    showToast('Password updated successfully', 'success')
  } catch (err) {
    passwordOk.value = false
    if (err?.message) {
      showToast(err.message, 'error')
    } else {
      showToast('Failed to update password', 'error')
    }
  } finally {
    savingPassword.value = false
  }
}

// Notifications
const notify = ref({ enabled: true, channels: { email: true, sms: false } })
const savingNotifications = ref(false)

async function loadPreferences() {
  try {
    const userId = getCurrentUserId()
    if (!userId) return
    const res = await fetch(`http://localhost:3000/api/user-settings/${userId}/notifications`, {
      headers: { ...authHeaders() }
    })
    const data = await res.json()
    if (res.ok && data?.success) {
      const prefs = data.data?.preferences
      if (prefs && typeof prefs === 'object') {
        notify.value = {
          enabled: !!prefs.enabled,
          channels: {
            email: !!(prefs.channels?.email),
            sms: !!(prefs.channels?.sms)
          }
        }
      }
    }
  } catch {}
}

const saveNotifications = async () => {
  if (savingNotifications.value) return
  savingNotifications.value = true
  try {
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Missing user')
    const res = await fetch(`http://localhost:3000/api/user-settings/${userId}/notifications`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ preferences: notify.value })
    })
    const data = await res.json()
    if (!res.ok || data.success === false) throw new Error(data.message || 'Failed to save preferences')
    showToast('Notification preferences saved', 'success')
  } catch (e) {
    showToast(e?.message || 'Failed to save preferences', 'error')
  } finally {
    savingNotifications.value = false
  }
}

// Login & Security
const sessions = ref([])
const isLoading = ref(true)
const signingOutIndex = ref(null)
const signingOutAll = ref(false)
const refreshing = ref(false)

function getCurrentUserId() {
  try {
    const raw = localStorage.getItem('user') || localStorage.getItem('student') || localStorage.getItem('currentUser')
    if (!raw) return null
    const obj = JSON.parse(raw)
    return obj._id || obj.id || null
  } catch { return null }
}

function authHeaders() {
  const token = localStorage.getItem('token') || localStorage.getItem('t2f_token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const sid = localStorage.getItem('t2f_session_id')
  if (sid) headers['x-session-id'] = sid
  return headers
}

// (2FA removed)

function formatRelativeTime(input) {
  try {
    const ts = new Date(input)
    const now = new Date()
    const diff = Math.max(0, (now - ts) / 1000)
    if (diff < 60) return 'Just now'
    const mins = Math.floor(diff / 60)
    if (mins < 60) return `${mins} minute${mins===1?'':'s'} ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} hour${hrs===1?'':'s'} ago`
    const days = Math.floor(hrs / 24)
    return `${days} day${days===1?'':'s'} ago`
  } catch { return String(input || '') }
}

async function loadSessions() {
  try {
    const userId = getCurrentUserId()
    const url = userId ? `http://localhost:3000/api/user-settings/${userId}/sessions` : null
    if (!url) throw new Error('Missing user')
    const res = await fetch(url, { headers: { ...authHeaders() } })
    const data = await res.json()
    if (res.ok && data?.success) {
      const list = data.data?.sessions || []
      sessions.value = list.map(s => ({
        id: s.id || s._id,
        device: s.device || 'Unknown Browser',
        location: s.location || 'Local Network',
        ipAddress: s.ipAddress || '',
        lastActive: s.lastActive || s.createdAt || '',
        isCurrent: !!s.isCurrent
      }))
    }
  } catch {} finally {
    isLoading.value = false
  }
}

async function refreshSessions() {
  if (refreshing.value) return
  refreshing.value = true
  try { await loadSessions() } finally { refreshing.value = false }
}

async function signOutSession(index) {
  const sess = sessions.value[index]
  if (!sess?.id) return
  try {
    signingOutIndex.value = index
    const userId = getCurrentUserId()
    const res = await fetch(`http://localhost:3000/api/user-settings/${userId}/sessions/${sess.id}`, {
      method: 'DELETE',
      headers: { ...authHeaders() }
    })
    const data = await res.json()
    if (!res.ok || data.success === false) throw new Error(data.message || 'Failed to sign out session')
    sessions.value.splice(index, 1)
    if (sess.isCurrent) {
      try {
        localStorage.removeItem('t2f_token')
        localStorage.removeItem('t2f_user')
      } catch {}
      router.push('/login')
    }
    showToast('Session signed out', 'success')
  } catch (e) {
    alert(e.message)
  } finally {
    signingOutIndex.value = null
  }
}

async function signOutAll() {
  try {
    if (signingOutAll.value) return
    signingOutAll.value = true
    const userId = getCurrentUserId()
    const res = await fetch(`http://localhost:3000/api/user-settings/${userId}/sessions`, {
      method: 'DELETE',
      headers: { ...authHeaders() }
    })
    const data = await res.json()
    if (!res.ok || data.success === false) throw new Error(data.message || 'Failed to sign out all devices')
    sessions.value = []
    // Also sign out this device
    try {
      localStorage.removeItem('t2f_token')
      localStorage.removeItem('t2f_user')
    } catch {}
    router.push('/login')
    showToast('Signed out of all devices', 'success')
  } catch (e) {
    alert(e.message)
  } finally {
    signingOutAll.value = false
  }
}

onMounted(() => {
  loadSessions()
  loadPreferences()
})
</script>
