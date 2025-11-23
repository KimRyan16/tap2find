<template>
  <div class="bg-white min-h-screen pb-16 md:pb-8 py-3 md:p-4">
    <div class="px-0 md:px-6 pt-6 md:pt-8 max-w-4xl mx-auto flex flex-col min-h-0">
      <!-- Step header with dot indicators and Step X/3 label -->
      <div class="mt-1 md:mt-6 mb-2 md:mb-4">
        <div class="flex items-center justify-between">
          <button @click="router.back()" class="inline-flex items-center p-2 hover:text-gray-400 text-gray-700">
            <iconify-icon icon="famicons:chevron-back-outline" class="text-xl sm:text-2xl" />
          </button>
          <div class="flex-1 flex flex-col items-center px-2">
            <div class="flex items-center gap-2">
              <span v-for="(s,i) in steps" :key="s.name"
                    class="inline-block h-2 rounded-full transition-all duration-200"
                    :class="i === currentStepIndex ? 'w-6 bg-[#102A71]' : 'w-2 bg-gray-300'" />
            </div>
            <div class="text-xs sm:text-sm text-gray-600 mt-1">{{ stepLabel }}</div>
          </div>
          <button
            v-if="!isLastStep"
            @click="next"
            class="text-xs sm:text-sm font-medium text-gray-900 hover:underline"
          >
            Next
          </button>
          <button
            v-else
            @click="done"
            class="text-xs sm:text-sm font-semibold text-gray-900 hover:underline"
          >
            Done
          </button>
        </div>
      </div>

      <!-- Routed content -->
      <div class="flex-1 flex items-center justify-center">
        <router-view />
      </div>

      
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

const currentStepIndex = computed(() => {
  const idx = steps.findIndex(s => s.route.name === route.name)
  return idx === -1 ? 0 : idx
})

const stepLabel = computed(() => `Step ${currentStepIndex.value + 1}/${steps.length}`)

const currentStep = computed(() => steps.findIndex(s => s.route.name === route.name))
const totalSteps = steps.length
const currentStepDisplay = computed(() => (currentStep.value >= 0 ? currentStep.value + 1 : 1))
const currentTitle = computed(() => steps[currentStep.value]?.name || '')
const isLastStep = computed(() => currentStep.value >= totalSteps - 1)
const progressWidth = computed(() => `${Math.max(0, Math.min(100, Math.round(((currentStepDisplay.value) / totalSteps) * 100)))}%`)

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
const done = () => {
  router.push({ name: 'professor-dashboard' })
}
 
</script>
