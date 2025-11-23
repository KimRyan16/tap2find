<template>
  <div class="min-h-screen bg-white overflow-x-hidden md:overflow-x-visible">
    <!-- Mobile-only fixed header -->
    <div v-if="!isHideTopNav" class="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 overflow-visible" style="top: env(safe-area-inset-top, 0px)">
      <ProfessorNotificationsTopNav v-if="isNotifications" />
      <ProfessorTopNav v-else />
    </div>

    <div class="flex">
      <!-- Sidebar - Desktop/Tablet Only -->
      <aside v-if="!hideSidebar" class="hidden md:block md:w-56 lg:w-64 xl:w-72 fixed md:left-3 lg:left-4 xl:left-6 md:top-3 md:bottom-3 lg:top-4 lg:bottom-4 h-auto shadow rounded-xl z-40">
        <ProfessorSidebar />
      </aside>

      <!-- Main Content with Sidebar Spacing -->
      <main :class="['flex-1 min-w-0 px-4 sm:px-6 md:px-6', mainTopPadding, hideSidebar ? 'md:ml-0' : 'md:ml-[14.75rem] lg:ml-[17rem] xl:ml-[19.5rem]', 'pb-20 md:pb-0']">
        <!-- Desktop/tablet sticky header -->
        <div v-if="!isHideTopNav" class="hidden md:sticky md:block top-0 z-40 bg-white border-b border-gray-200" style="top: env(safe-area-inset-top, 0px)">
          <ProfessorNotificationsTopNav v-if="isNotifications" />
          <ProfessorTopNav v-else />
        </div>
        <router-view></router-view>
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    <nav v-if="!isHideBottomNav" class="md:hidden fixed left-0 right-0 z-[80] px-4" style="bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px)); padding-bottom: env(safe-area-inset-bottom, 0px);">
      <div class="mx-auto max-w-md">
        <div class="rounded-2xl bg-white border border-gray-200 shadow-lg">
          <ul class="flex items-center justify-between px-2 py-2 gap-1">
            <!-- Home -->
            <router-link to="/professor" class="flex-1 flex items-center justify-center min-w-0" @click="mobileMoreOpen = false">
              <div :class="isActive('/professor') ? 'bg-[#cbd5f1]/60 text-[#102A71]' : 'text-gray-500'" class="flex items-center gap-1 h-9 px-2 rounded-full transition-colors min-w-0">
                <iconify-icon :icon="isActive('/professor') ? 'fluent:home-12-filled' : 'fluent:home-12-regular'" class="text-sm" />
                <span v-if="isActive('/professor')" class="text-[10px] sm:text-[11px] font-medium leading-none">Home</span>
              </div>
            </router-link>

            <!-- Availability -->
            <router-link to="/professor/availability/tap" class="flex-1 flex items-center justify-center min-w-0" @click="mobileMoreOpen = false">
              <div :class="isActive('/professor/availability') ? 'bg-[#cbd5f1]/60 text-[#102A71]' : 'text-gray-500'" class="flex items-center gap-1 h-9 px-2 rounded-full transition-colors min-w-0">
                <iconify-icon :icon="isActive('/professor/availability') ? 'mdi:check-circle' : 'mdi:check-circle-outline'" class="text-sm" />
                <span v-if="isActive('/professor/availability')" class="text-[10px] sm:text-[11px] font-medium leading-none">Status</span>
              </div>
            </router-link>

            <!-- Concerns -->
            <router-link to="/professor/concerns" class="flex-1 flex items-center justify-center min-w-0" @click="mobileMoreOpen = false">
              <div :class="isActive('/professor/concerns') ? 'bg-[#cbd5f1]/60 text-[#102A71]' : 'text-gray-500'" class="flex items-center gap-1 h-9 px-2 rounded-full transition-colors min-w-0">
                <iconify-icon :icon="isActive('/professor/concerns') ? 'mingcute:inbox-fill' : 'mingcute:inbox-line'" class="text-sm" />
                <span v-if="isActive('/professor/concerns')" class="text-[10px] sm:text-[11px] font-medium leading-none">Concerns</span>
              </div>
            </router-link>

            <!-- More (collapsible menu) -->
            <button type="button" @click.stop="mobileMoreOpen = !mobileMoreOpen" class="flex-1 flex items-center justify-center min-w-0">
              <div class="flex items-center gap-1 h-9 px-2 rounded-full transition-colors min-w-0 text-gray-500">
                <iconify-icon :icon="mobileMoreOpen ? 'mdi:menu-open' : 'mdi:menu'" class="text-sm" />
                <span class="text-[10px] sm:text-[11px] font-medium leading-none">More</span>
              </div>
            </button>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Mobile More Panel -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
      <div v-if="mobileMoreOpen" class="md:hidden fixed inset-0 z-[70] bg-black/30 backdrop-blur-[2px]" @click.self="mobileMoreOpen = false">
        <div class="absolute left-0 right-0 px-4" style="bottom: calc(4.25rem + env(safe-area-inset-bottom, 0px));">
          <div class="mx-auto max-w-md rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden">
            <div class="divide-y divide-gray-100">
              <router-link to="/professor/notifications" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" @click.native="mobileMoreOpen = false">
                <iconify-icon icon="lucide:bell" class="text-lg text-gray-700" />
                <span class="text-sm font-medium">Notifications</span>
              </router-link>
              <router-link to="/professor/schedule" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" @click.native="mobileMoreOpen = false">
                <iconify-icon :icon="isActive('/professor/schedule') ? 'fluent:calendar-12-filled' : 'fluent:calendar-12-regular'" class="text-lg text-gray-700" />
                <span class="text-sm font-medium">Teaching Schedule</span>
              </router-link>
              <router-link to="/professor/settings" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" @click.native="mobileMoreOpen = false">
                <iconify-icon icon="lucide:settings" class="text-lg text-gray-700" />
                <span class="text-sm font-medium">Settings</span>
              </router-link>
              <router-link to="/professor/support" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" @click.native="mobileMoreOpen = false">
                <iconify-icon icon="lucide:info" class="text-lg text-gray-700" />
                <span class="text-sm font-medium">Support & About</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
 </template>

<script setup>
import ProfessorSidebar from '@/views/professor/ProfessorSidebar.vue'
import ProfessorTopNav from '@/components/ProfessorTopNav.vue'
import ProfessorNotificationsTopNav from '@/components/ProfessorNotificationsTopNav.vue'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// Hide sidebar on availability page only
const hideSidebar = computed(() => route.path.startsWith('/professor/availability'))
// Determine if we are on notifications route
const isNotifications = computed(() => route.path.startsWith('/professor/notifications'))
// Hide top nav on availability, settings, and support routes (notifications shows its own header)
const isHideTopNav = computed(() =>
  route.path.startsWith('/professor/availability') ||
  route.path.startsWith('/professor/settings') ||
  route.path.startsWith('/professor/support')
)
// Hide bottom nav only on availability flow
const isHideBottomNav = computed(() => route.path.startsWith('/professor/availability'))
// Adjust main padding based on whether header is shown
const mainTopPadding = computed(() => (isHideTopNav.value ? 'pt-4 md:pt-0' : 'pt-16 md:pt-0'))

// Helper to highlight active bottom nav item
const isActive = (path) => {
  if (path === '/professor') return route.path === '/professor'
  return route.path.startsWith(path)
}

// Mobile collapsible menu state
const mobileMoreOpen = ref(false)
const morePanelRef = ref(null)
const onDocClick = (e) => {
  if (!mobileMoreOpen.value) return
  const el = morePanelRef.value
  if (el && !el.contains(e.target)) mobileMoreOpen.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>
