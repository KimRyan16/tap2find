<template>
  <div class="bg-white min-h-screen">
    <!-- Header band -->
    <section class="bg-[#001740] text-white min-h-[40vh] flex items-center">
      <div class="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <p class="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-white/80">Contact</p>
        <h1 class="text-4xl sm:text-5xl font-extrabold">Get in Touch with TAP2FIND</h1>
        <p class="mt-1 text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
          We’re here to answer questions, gather feedback, and help you get the most out of TAP2FIND.
        </p>
      </div>
    </section>

    <!-- Contact card -->
    <section class="relative">
      <div class="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div
          class="-mt-14 sm:-mt-16 rounded-xl border border-gray-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.16)] overflow-hidden"
        >
          <div class="grid gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-2 p-6 sm:p-8 lg:p-10">
            <!-- Left: Contact Info -->
            <div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">Contact Information</h2>
              <p class="mt-2 text-gray-600 max-w-prose">
                Our team is here to help you with technical issues, feature suggestions, or general inquiries about how
                TAP2FIND works.
              </p>

              <ul class="mt-6 space-y-4">
                <li class="flex items-start gap-4">
                  <span
                    class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600"
                  >
                    <Icon icon="mingcute:location-line" class="w-5 h-5" />
                  </span>
                  <div>
                    <div class="font-semibold text-gray-900">Address</div>
                    <div class="text-gray-600">College of Computer Studies – Mindoro State University</div>
                  </div>
                </li>
                <li class="flex items-start gap-4">
                  <span
                    class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
                  >
                    <Icon icon="ic:outline-email" class="w-5 h-5" />
                  </span>
                  <div>
                    <div class="font-semibold text-gray-900">Email us</div>
                    <div class="text-gray-600">tap2findccs@gmail.com</div>
                  </div>
                </li>
                <li class="flex items-start gap-4">
                  <span
                    class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600"
                  >
                    <Icon icon="mi:call" class="w-5 h-5" />
                  </span>
                  <div>
                    <div class="font-semibold text-gray-900">Contact us</div>
                    <div class="text-gray-600">+63 995 2225 880</div>
                  </div>
                </li>
                <li class="flex items-start gap-4">
                  <span
                    class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"
                  >
                    <Icon icon="fluent-mdl2:date-time-12" class="w-5 h-5" />
                  </span>
                  <div>
                    <div class="font-semibold text-gray-900">Office Hours</div>
                    <div class="text-gray-600">Monday–Friday | 8:00 AM–5:00 PM</div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Right: Form -->
            <div class="bg-gray-50 rounded-xl p-5 sm:p-6">
              <h3 class="text-2xl font-extrabold text-gray-900">Send us a message</h3>
              <form class="mt-4 space-y-4" @submit.prevent="submit" novalidate>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      v-model="form.name"
                      :disabled="loading"
                      class="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#001740]"
                      :class="errors.name ? 'border-red-500' : 'border-gray-300'"
                    />
                    <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      v-model="form.email"
                      :disabled="loading"
                      class="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#001740]"
                      :class="errors.email ? 'border-red-500' : 'border-gray-300'"
                    />
                    <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    v-model="form.subject"
                    :disabled="loading"
                    class="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#001740]"
                    :class="errors.subject ? 'border-red-500' : 'border-gray-300'"
                  />
                  <p v-if="errors.subject" class="text-xs text-red-600 mt-1">{{ errors.subject }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    rows="5"
                    v-model="form.message"
                    :disabled="loading"
                    class="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#001740]"
                    :class="errors.message ? 'border-red-500' : 'border-gray-300'"
                  ></textarea>
                  <p v-if="errors.message" class="text-xs text-red-600 mt-1">{{ errors.message }}</p>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-500">Our team gets back to you within 24-48 hours.</p>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="inline-flex items-center rounded-full bg-[#F5C400] hover:bg-[#e0b100] text-[#001740] font-semibold px-6 py-3 shadow disabled:opacity-60 disabled:cursor-not-allowed relative"
                  >
                    <span :class="loading ? 'opacity-0' : ''">Send message</span>
                    <svg v-if="loading" class="animate-spin h-5 w-5 absolute" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </button>
                </div>
              </form>
              <!-- Toast -->
              <transition name="fade">
                <div v-if="toast.visible" class="fixed bottom-6 right-6 bg-white border rounded-xl shadow-lg p-4 w-80">
                  <div class="flex items-start gap-3">
                    <div :class="toast.type === 'success' ? 'text-emerald-600' : 'text-red-600'">
                      <svg v-if="toast.type==='success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-semibold" :class="toast.type==='success' ? 'text-emerald-700' : 'text-red-700'">{{ toast.title }}</p>
                      <p class="text-xs text-gray-600 mt-0.5">{{ toast.message }}</p>
                      <div class="h-1 bg-gray-200 rounded mt-3 overflow-hidden">
                        <div class="h-full" :class="toast.type==='success' ? 'bg-emerald-500' : 'bg-red-500'" :style="{ width: toast.progress + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feedback CTA -->
    <section class="mt-16 mb-20">
      <div class="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div
          class="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center rounded-2xl bg-gray-50  px-6 sm:px-10 py-10 sm:py-12 shadow-sm"
        >
          <!-- Left: Text + button -->
          <div class="flex flex-col justify-between h-full">
            <div>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Help Us Improve TAP2FIND
              </h3>
              <p class="mt-3 text-sm sm:text-base text-gray-600 max-w-lg">
                Share your experience using TAP2FIND—what works well, what’s confusing, and what features you’d like to
                see next. Your feedback directly shapes the future of the system.
              </p>
            </div>
            <div class="mt-6">
              <button
                type="button"
                class="inline-flex items-center rounded-full bg-[#001740] hover:bg-[#102A71] text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Submit Feedback
              </button>
            </div>
          </div>
          <!-- Right: Lottie illustration -->
          <div class="flex items-center justify-center">
            <div class="w-full max-w-xs h-56 sm:h-64">
              <iframe
                src="https://lottie.host/embed/0b807f32-4e9c-4db6-8f86-a714867bc0d9/8tVDvfTx4i.lottie"
                class="w-full h-full rounded-2xl"
                frameborder="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import api from '@/utils/api'

const loading = ref(false)
const form = ref({ name: '', email: '', subject: '', message: '' })
const errors = ref({ name: '', email: '', subject: '', message: '' })
const toast = ref({ visible: false, type: 'success', title: '', message: '', progress: 0 })

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

function showToast(type, title, message) {
  toast.value = { visible: true, type, title, message, progress: 0 }
  setTimeout(() => { toast.value.progress = 100 }, 20)
  setTimeout(() => { toast.value.visible = false; toast.value.progress = 0 }, 3000)
}

function validate() {
  errors.value = { name: '', email: '', subject: '', message: '' }
  if (!form.value.name) errors.value.name = 'Full name is required.'
  if (!form.value.email) errors.value.email = 'Email is required.'
  else if (!emailRegex.test(form.value.email)) errors.value.email = 'Please enter a valid email.'
  if (!form.value.subject) errors.value.subject = 'Subject is required.'
  if (!form.value.message) errors.value.message = 'Message is required.'
  return !(errors.value.name || errors.value.email || errors.value.subject || errors.value.message)
}

async function submit() {
  if (loading.value) return
  if (!validate()) return
  loading.value = true
  try {
    await api.post('/contact/send', {
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message,
    })
    showToast('success', 'Message sent', 'Thanks! We will get back to you within 24–48 hours.')
    form.value = { name: '', email: '', subject: '', message: '' }
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to send message. Please try again later.'
    showToast('error', 'Send failed', msg)
  } finally {
    loading.value = false
  }
}
</script>