<template>
  <div class="-mx-4 md:-mx-6 px-4 md:px-6 py-1.5 flex flex-row justify-between items-start md:items-center rounded-lg mx-0 mt-6 gap-3 relative">
    <div class="flex-1">
      <h1 class="text-xs sm:text-xl md:text-3xl lg:text-4xl font-semibold text-gray-900">Notification</h1>
      <p class="text-[10px] sm:text-sm md:text-base text-gray-500">
        You have <span class="text-[#F5C400]">{{ totalCount }} notification{{ totalCount !== 1 ? 's' : '' }}</span> {{ filterLabel }}.
      </p>
      <!-- Mobile actions row -->
      <div class="mt-2 flex items-center gap-1 md:hidden overflow-x-auto whitespace-nowrap">
        <button class="px-2.5 h-8 text-xs leading-none whitespace-nowrap rounded-lg border hover:bg-gray-50 inline-flex items-center justify-center shrink-0"
                @click="onToggleSelect">{{ selectMode ? 'Cancel' : 'Select' }}</button>
        <button v-if="selectMode"
                class="px-2.5 h-8 text-xs leading-none whitespace-nowrap rounded-lg border text-red-600 hover:bg-red-50 inline-flex items-center justify-center shrink-0"
                @click="onDeleteSelected">Delete Selected</button>
        <button v-if="selectMode"
                class="px-2.5 h-8 text-xs leading-none whitespace-nowrap rounded-lg border text-red-600 hover:bg-red-50 inline-flex items-center justify-center shrink-0"
                @click="onDeleteAll">Delete All</button>
      </div>
    </div>

    <!-- Right controls -->
    <div class="flex items-center gap-2 self-start md:self-auto relative">
      <div class="hidden md:flex items-center gap-2">
        <button class="px-3 py-2 text-sm rounded-lg border hover:bg-gray-50"
                @click="onToggleSelect">{{ selectMode ? 'Cancel' : 'Select' }}</button>
        <button v-if="selectMode"
                class="px-3 py-2 text-sm rounded-lg border text-red-600 hover:bg-red-50"
                @click="onDeleteSelected">Delete Selected</button>
        <button v-if="selectMode"
                class="px-3 py-2 text-sm rounded-lg border text-red-600 hover:bg-red-50"
                @click="onDeleteAll">Delete All</button>
      </div>

      <!-- Filter Toolbar -->
      <div class="md:relative absolute right-0 top-0 z-10" ref="menuRef">
        <button class="p-2 rounded-full hover:bg-gray-100" aria-label="Filter" @click="toggleMenu">
          <iconify-icon icon="mage:filter" class="text-xl sm:text-2xl" />
        </button>
        <transition name="fade">
          <div v-if="menuOpen" class="absolute right-0 mt-2 w-[70vw] max-w-[176px] rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden z-20">
            <button @click="applyFilter(null)" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">All</button>
            <button @click="applyFilter('today')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Today</button>
            <button @click="applyFilter('week')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">This Week</button>
            <button @click="applyFilter('month')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">This Month</button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

const { notifications } = useNotifications()
const route = useRoute()
const router = useRouter()

const menuOpen = ref(false)
const menuRef = ref(null)
const selectMode = ref(false)

const toggleMenu = () => { menuOpen.value = !menuOpen.value }

const applyFilter = (val) => {
  const next = { ...route.query }
  if (val === null) delete next.filter
  else next.filter = val
  router.replace({ query: next })
  menuOpen.value = false
}

// Dispatch actions so the view can listen (same pattern as student)
const onToggleSelect = () => { selectMode.value = !selectMode.value; window.dispatchEvent(new Event('notif:toggleSelect')) }
const onDeleteSelected = () => window.dispatchEvent(new Event('notif:deleteSelected'))
const onDeleteAll = () => window.dispatchEvent(new Event('notif:deleteAll'))

const onClickOutside = (e) => {
  if (!menuRef.value) return
  if (!menuRef.value.contains(e.target)) menuOpen.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

// Compute counts/labels from shared notifications + route filter
const isToday = (date) => {
  const d = new Date(date)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}
const isWithinLastDays = (date, days) => {
  const d = new Date(date).getTime()
  const now = Date.now()
  return now - d <= days * 24 * 60 * 60 * 1000
}
const selectedFilter = computed(() => route.query.filter ?? null)
const filteredList = computed(() => {
  let list = notifications.value || []
  if (selectedFilter.value === 'today') return list.filter(n => n.createdAt && isToday(n.createdAt))
  if (selectedFilter.value === 'week') return list.filter(n => n.createdAt && isWithinLastDays(n.createdAt, 7))
  if (selectedFilter.value === 'month') return list.filter(n => n.createdAt && isWithinLastDays(n.createdAt, 30))
  return list
})
const totalCount = computed(() => filteredList.value.length)
const filterLabel = computed(() => {
  if (selectedFilter.value === 'today') return 'today'
  if (selectedFilter.value === 'week') return 'this week'
  if (selectedFilter.value === 'month') return 'this month'
  return 'in total'
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
