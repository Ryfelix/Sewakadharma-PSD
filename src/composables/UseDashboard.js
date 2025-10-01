// composables/useDashboard.js
import { ref, computed } from 'vue'
import ApiService from '@/services/api'

export function useDashboard() {
  // State
  const isLoading = ref(false)
  const error = ref(null)
  const dashboardData = ref({
    total_documents: 0,
    total_chat_sessions: 0,
    total_user_messages: 0,
    today_sessions: 0,
    today_user_messages: 0
  })
  const monthlyAnalytics = ref([])

  // Computed
  const dailyAverageSessions = computed(() => {
    const days = 30 // Assuming 30 days average
    return Math.round(dashboardData.value.total_chat_sessions / days)
  })

  const dailyAverageMessages = computed(() => {
    const days = 30
    return Math.round(dashboardData.value.total_user_messages / days)
  })

  const messagesPerSession = computed(() => {
    if (dashboardData.value.total_chat_sessions === 0) return 0
    return Math.round(dashboardData.value.total_user_messages / dashboardData.value.total_chat_sessions)
  })

  // Methods
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const loadDashboardOverview = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await ApiService.getDashboardOverview()
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load dashboard data')
      }

      dashboardData.value = response.data
      
    } catch (err) {
      error.value = err.message
      console.error('Dashboard Overview Error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const loadMonthlyAnalytics = async () => {
    try {
      const response = await ApiService.getMonthlyAnalytics()
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load analytics data')
      }

      monthlyAnalytics.value = response.data.items || []
      
    } catch (err) {
      error.value = err.message
      console.error('Monthly Analytics Error:', err)
    }
  }

  const loadMonthlyDailySessions = async (month) => {
    try {
      const response = await ApiService.getMonthlyDailySessions(month)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load daily sessions data')
      }

      return response.data
      
    } catch (err) {
      error.value = err.message
      console.error('Monthly Daily Sessions Error:', err)
      return null
    }
  }

  const loadAllDashboardData = async () => {
    try {
      isLoading.value = true
      error.value = null

      await Promise.all([
        loadDashboardOverview(),
        loadMonthlyAnalytics()
      ])
      
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const retry = () => {
    loadAllDashboardData()
  }

  return {
    // State
    isLoading,
    error,
    dashboardData,
    monthlyAnalytics,
    
    // Computed
    dailyAverageMessages,
    dailyAverageSessions,
    messagesPerSession,
    
    // Methods
    formatNumber,
    loadDashboardOverview,
    loadMonthlyAnalytics,
    loadMonthlyDailySessions,
    loadAllDashboardData,
    retry
  }
}