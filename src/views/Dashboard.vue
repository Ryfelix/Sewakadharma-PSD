<template>
  <div class="min-h-screen bg-[#F7F4F2] p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p class="text-gray-600">Monitor your chatbot performance and analytics</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC5649] mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center py-20">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-red-200">
          <p class="text-red-600">Error: {{ error }}</p>
          <button 
            @click="fetchData" 
            class="mt-4 px-4 py-2 bg-[#FC5649] text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Dashboard Content -->
      <template v-else>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            :value="overview.total_chat_sessions"
            icon="users-icon"
            bg-color="bg-red-50"
            icon-color="text-[#FC5649]"
            :trend="`${overview.today_sessions} today`"
          />
          
          <StatsCard
            title="Total Messages"
            :value="overview.total_user_messages"
            icon="message-icon"
            bg-color="bg-yellow-50"
            icon-color="text-[#FCBA40]"
            :trend="`${overview.today_user_messages} today`"
          />
          
          <StatsCard
            title="Total Documents"
            :value="overview.total_documents"
            icon="file-icon"
            bg-color="bg-blue-50"
            icon-color="text-blue-500"
          />
          
          <StatsCard
            title="Active Sessions"
            :value="overview.today_sessions"
            icon="calendar-icon"
            bg-color="bg-green-50"
            icon-color="text-green-500"
          />
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChartCard
            title="Monthly Sessions"
            icon="trending-icon"
            icon-color="text-[#FC5649]"
            :data="monthlyData"
            data-key="sessions"
            line-color="#FC5649"
            label="Sessions"
          />

          <LineChartCard
            title="Monthly Messages"
            icon="message-icon"
            icon-color="text-[#FCBA40]"
            :data="monthlyData"
            data-key="messages"
            line-color="#FCBA40"
            label="Messages"
          />
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryCard
            title="Today's Activity"
            :value="overview.today_sessions"
            description="Active Sessions Today"
            variant="red"
          />

          <SummaryCard
            title="Messages Today"
            :value="overview.today_user_messages"
            description="User Messages Sent"
            variant="yellow"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import LineChartCard from '@/components/dashboard/LineChartCard.vue'
import SummaryCard from '@/components/dashboard/SummaryCard.vue'

const API_BASE_URL = 'https://rag-chatbot-be.azurewebsites.net'

const overview = ref({
  total_documents: 0,
  total_chat_sessions: 0,
  total_user_messages: 0,
  today_sessions: 0,
  today_user_messages: 0
})

const monthlyData = ref([])
const loading = ref(true)
const error = ref(null)

const fetchOverview = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/overview`)
    if (!response.ok) throw new Error('Failed to fetch overview data')
    const data = await response.json()
    overview.value = data
  } catch (err) {
    error.value = err.message
    throw err
  }
}

const fetchMonthlyAnalytics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/monthly-analytics`)
    if (!response.ok) throw new Error('Failed to fetch monthly analytics')
    const data = await response.json()
    
    monthlyData.value = data.items.map(item => ({
      month: item.month,
      sessions: item.sessions,
      messages: item.messages
    }))
  } catch (err) {
    error.value = err.message
    throw err
  }
}

const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    await Promise.all([
      fetchOverview(),
      fetchMonthlyAnalytics()
    ])
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>