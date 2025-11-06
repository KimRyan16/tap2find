<template>
  <section class="w-full p-6">
    <div class="max-w-xl mx-auto text-center min-h-[calc(100vh-220px)] flex flex-col items-center">
      <!-- Main content (takes available height) -->
      <div class="flex-1 w-full flex flex-col items-center justify-center">
        <div class="flex justify-center mb-6">
          <dotlottie-player
            src="https://lottie.host/145a722f-bdf7-43ce-919c-b4de459ce755/n0M7kxGG4l.lottie"
            autoplay
            loop
            style="width: 300px; height: 300px"
          />
        </div>

        <!-- Big status title -->
        <h2 class="text-3xl font-semibold tracking-wide text-[#001740] mb-4">{{ statusLabel }}</h2>

        <!-- Question -->
        <div class="text-sm text-gray-600 mb-2">Want to change your status?</div>

        <!-- Segmented control -->
        <div class="inline-flex rounded-xl overflow-hidden border border-gray-300 shadow-xs">
          <button
            class="px-5 py-2 text-xs font-semibold tracking-wide"
            :class="status === 'available' ? 'bg-[#102A71] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'"
            @click="set('available')"
          >
            AVAILABLE
          </button>
          <button
            class="px-5 py-2 text-xs font-semibold tracking-wide border-l border-gray-300"
            :class="status === 'busy' ? 'bg-[#102A71] text-white' : 'bg-gray-100 text-gray-400'"
            @click="set('busy')"
          >
            BUSY
          </button>
          <button
            class="px-5 py-2 text-xs font-semibold tracking-wide border-l border-gray-300"
            :class="status === 'not_available' ? 'bg-[#102A71] text-white' : 'bg-gray-100 text-gray-400'"
            @click="set('not_available')"
          >
            NOT AVAILABLE
          </button>
        </div>
      </div>

      <!-- Footer info row pinned to bottom area -->
      <div class="w-full flex items-center justify-between text-[11px] text-gray-400 mt-auto pt-6">
        <div>Last Update : {{ lastUpdate }}</div>
        <div>Source: RFID</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const status = ref('available')
const set = (val) => { status.value = val }

const statusLabel = computed(() => {
  return status.value === 'available' ? 'AVAILABLE' : status.value === 'busy' ? 'BUSY' : 'NOT AVAILABLE'
})

const formatDate = (d) => {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(-2)
  return `${mm}/${dd}/${yy}`
}
const lastUpdate = ref(formatDate(new Date()))

onMounted(() => {
  if (!customElements.get('dotlottie-player')) {
    const s = document.createElement('script')
    s.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.js'
    s.type = 'module'
    document.head.appendChild(s)
  }
})
</script>
