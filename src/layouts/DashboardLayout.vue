<template>
  <div class="flex h-screen bg-[#F7F4F2]">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg flex flex-col">
      <!-- Logo Section -->
      <div class="px-6 py-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <img src="/src/assets/image/Logo 200x50.png" alt="Logo" class="w-200 h-50" />
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2">
        <router-link
          to="/dashboard"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-[#FCBA40] hover:text-white transition-colors group"
          :class="{ 'bg-[#FCBA40] text-white': $route.path === '/dashboard' }"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
          </svg>
          <span class="font-medium">Dashboard</span>
        </router-link>
        
        <router-link
          to="/knowledge-base"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-[#FCBA40] hover:text-white transition-colors group"
          :class="{ 'bg-[#FCBA40] text-white': $route.path === '/knowledge-base' }"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
          </svg>
          <span class="font-medium">Knowledge Base</span>
        </router-link>

        <router-link
          to="/ai-configuration"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-[#FCBA40] hover:text-white transition-colors group"
          :class="{ 'bg-[#FCBA40] text-white': $route.path === '/ai-configuration' }"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
          </svg>
          <span class="font-medium">AI Configuration</span>
        </router-link>

        <router-link
          to="/user-management"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-[#FCBA40] hover:text-white transition-colors group"
          :class="{ 'bg-[#FCBA40] text-white': $route.path === '/user-management' }"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
          </svg>
          <span class="font-medium">User Management</span>
        </router-link>

      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Header -->
      <header class="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">{{ pageTitle }}</h1>
        
        <!-- User Profile -->
        <div class="relative">
          <button @click="toggleProfileMenu" class="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <span class="text-gray-700 font-medium">Admin</span>
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </button>
          
          <!-- Dropdown Menu -->
          <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            <button @click="logout" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-[#FC5649] hover:text-white transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Dashboard Content -->
      <main class="flex-1 p-8 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()
const showProfileMenu = ref(false)

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/knowledge-base': 'Knowledge Base',
    '/ai-configuration': 'AI Configuration',
    '/user-management': 'User Management'
  }
  return titles[route.path] || 'Dashboard'
})

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

function logout() {
  localStorage.removeItem("authToken")
  router.push("/login")
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    showProfileMenu.value = false
  }
})
</script>