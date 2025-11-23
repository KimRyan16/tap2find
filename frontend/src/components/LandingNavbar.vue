<template>
  <nav class="bg-[#001740] fixed top-0 left-0 right-0 z-50">
    <div class="max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <img src="/t2fLogogogo.svg" alt="Tap2Find" class="h-10 w-auto" />
            <span class="text-3xl font-bold text-white">Tap<span class="text-yellow-500">2</span>Find</span>
          </router-link>
        </div>
        <div class="hidden md:flex items-center space-x-8 font-medium">
          <router-link
            to="/"
            class="text-white hover:text-gray-200 border-b-2 border-transparent pb-0.5 transition-all duration-200"
            :class="{ 'border-yellow-400': route.path === '/' }"
          >
            Home
          </router-link>
          <router-link
            to="/about"
            class="text-white hover:text-gray-200 border-b-2 border-transparent pb-0.5 transition-all duration-200"
            :class="{ 'border-yellow-400': route.path.startsWith('/about') }"
          >
            About
          </router-link>
          <router-link
            to="/features"
            class="text-white hover:text-gray-200 border-b-2 border-transparent pb-0.5 transition-all duration-200"
            :class="{ 'border-yellow-400': route.path.startsWith('/features') }"
          >
            Features
          </router-link>
          <router-link
            to="/contact"
            class="text-white hover:text-gray-200 border-b-2 border-transparent pb-0.5 transition-all duration-200"
            :class="{ 'border-yellow-400': route.path.startsWith('/contact') }"
          >
            Contact
          </router-link>
        </div>
        <div class="hidden md:flex items-center space-x-3">
          <router-link to="/auth/login" class="px-4 py-2  text-white hover:text-gray-200 text-base font-medium">Login</router-link>
          <router-link to="/auth/register" class="px-4 py-3 rounded-full bg-[#0a2a6a] hover:bg-gray-600 text-white font-semibold">Get Started</router-link>
        </div>
        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-white/90 hover:text-white">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="block px-3 py-2 text-gblack hover:text-gray-900 border-b-2 border-transparent transition-all duration-200"
          :class="{ 'border-yellow-400': route.path === '/' }"
          @click="mobileMenuOpen = false"
        >
          Home
        </router-link>
        <router-link
          to="/features"
          class="block px-3 py-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-all duration-200"
          :class="{ 'border-yellow-400': route.path.startsWith('/features') }"
          @click="mobileMenuOpen = false"
        >
          Features
        </router-link>
        <router-link
          to="/about"
          class="block px-3 py-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-all duration-200"
          :class="{ 'border-yellow-400': route.path.startsWith('/about') }"
          @click="mobileMenuOpen = false"
        >
          About
        </router-link>
        <router-link
          to="/contact"
          class="block px-3 py-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-all duration-200"
          :class="{ 'border-yellow-400': route.path.startsWith('/contact') }"
          @click="mobileMenuOpen = false"
        >
          Contact
        </router-link>
        <router-link to="/auth/login" class="block px-3 py-2 text-gray-600 hover:text-gray-900" @click="mobileMenuOpen = false">Login</router-link>
        <router-link to="/auth/register" class="block px-3 py-2 bg-blue-600  text-white rounded-md" @click="mobileMenuOpen = false">Get Started</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const mobileMenuOpen = ref(false)
const route = useRoute()
</script>
