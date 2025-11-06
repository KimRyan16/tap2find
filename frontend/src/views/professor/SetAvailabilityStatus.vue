<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Step header with dot indicators (single, changes per step) -->
      <div class="mt-10 mb-6 text-center">
        <div class="text-sm text-gray-300  mb-1">{{ currentTitle }}</div>
        <div class="flex items-center justify-center gap-2">
          <span :class="dotClass(0)" />
          <span :class="dotClass(1)" />
          <span :class="dotClass(2)" />
        </div>
      </div>

      <!-- Routed content -->
      <router-view />
    </div>
    

  </div>
  
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const steps = [
  { name: 'Tap Card', route: { name: 'professor-availability-tap' } },
  { name: 'Set Status', route: { name: 'professor-availability-status' } },
  { name: 'Activity Panel', route: { name: 'professor-availability-activity' } },
]

const currentStep = computed(() => steps.findIndex(s => s.route.name === route.name))

const currentTitle = computed(() => steps[currentStep.value]?.name || '')

const next = () => {
  if (currentStep.value < steps.length - 1) {
    router.push(steps[currentStep.value + 1].route)
  }
}
const prev = () => {
  if (currentStep.value > 0) {
    router.push(steps[currentStep.value - 1].route)
  }
}
const go = (i) => {
  if (i >= 0 && i < steps.length) {
    router.push(steps[i].route)
  }
}

const dotClass = (index) => {
  return [
    'inline-block h-2 rounded-full transition-all duration-300',
    currentStep.value === index ? 'bg-[#102A71] w-6' : 'bg-gray-200 w-2'
  ].join(' ')
}
</script>
