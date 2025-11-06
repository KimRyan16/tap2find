<template>
  <section class="w-full p-6">
    <div class="max-w-md mx-auto text-center min-h-[calc(100vh-220px)] flex flex-col items-center justify-center">
      <h1 class="text-3xl font-semibold text-[#102A71] -mt-24 mb-12">Good day, Prof</h1>
      <div class="flex justify-center mb-16">
        <div class="w-72 h-72 rounded-full bg-gray-50 overflow-hidden flex items-center justify-center">
          <dotlottie-player
            src="https://lottie.host/aac6b5be-196d-46ce-bc48-4f63d61721c7/XL5CWAG6Ai.lottie"
            autoplay
            loop
            style="width: 290px; height: 290px"
          />
        </div>
      </div>
      <div class="text-2xl font-medium mb-2">Tap to start your day.</div>
      <p class=" text-sm text-gray-500">
        Please tap your RFID to set your status to Available so students can find you.
      </p>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (!customElements.get('dotlottie-player')) {
    const s = document.createElement('script')
    s.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.js'
    s.type = 'module'
    document.head.appendChild(s)
  }
})
</script>

