import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Users, FileText, MessageSquare } from 'lucide-vue-next'
import Chart from 'chart.js/auto'
import KnowledgeBase from './KnowledgeBase.vue'

export default {
  name: 'Dashboard',
  components: { Users, FileText, MessageSquare, KnowledgeBase },
  setup() {
    const router = useRouter()

    // state
    const logo = ref('/src/assets/image/Logo 100x100.png')
    const showLogoPlaceholder = ref(false)
    const currentRoute = ref('dashboard')
    const showProfileMenu = ref(false)

    const dashboardStats = reactive({
      totalUsers: 1213,
      totalConversations: 27342,
      totalDocuments: 25
    })

    // chart
    let lineChart = null
    let pieChart = null

    const pageTitle = computed(() => {
      const titles = {
        'dashboard': 'Dashboard',
        'knowledge-base': 'Knowledge Management'
      }
      return titles[currentRoute.value] || 'Dashboard'
    })

    const setActiveRoute = (route) => {
      currentRoute.value = route
      showProfileMenu.value = false
    }

    const toggleProfileMenu = () => {
      showProfileMenu.value = !showProfileMenu.value
    }

    const handleLogout = () => {
      localStorage.removeItem('authToken')
      router.push('/login')
    }

    const initializeCharts = async () => {
      await nextTick()

      const lineCtx = document.querySelector('canvas[ref="lineChart"]')
      if (lineCtx && !lineChart) {
        lineChart = new Chart(lineCtx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun'],
            datasets: [{
              label: 'Users',
              data: [100, 90, 95, 130, 170, 120],
              borderColor: '#FC5649',
              backgroundColor: 'transparent',
              tension: 0.4,
              pointBackgroundColor: '#FC5649',
              pointBorderColor: '#FC5649',
              pointRadius: 6
            }]
          }
        })
      }

      const pieCtx = document.querySelector('canvas[ref="pieChart"]')
      if (pieCtx && !pieChart) {
        pieChart = new Chart(pieCtx, {
          type: 'doughnut',
          data: {
            labels: ['Web Dev', 'SEO', 'Creative', 'Ads'],
            datasets: [{
              data: [2058, 1000, 750, 300],
              backgroundColor: ['#6B46C1', '#10B981', '#FCBA40', '#FC5649']
            }]
          }
        })
      }
    }

    const handleRouteChange = () => {
      const path = router.currentRoute.value.path
      if (path.includes('knowledge-base')) currentRoute.value = 'knowledge-base'
      else currentRoute.value = 'dashboard'
    }

    onMounted(() => {
      handleRouteChange()
      if (currentRoute.value === 'dashboard') {
        setTimeout(initializeCharts, 100)
      }

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.admin-profile')) showProfileMenu.value = false
      })
    })

    return {
      logo,
      showLogoPlaceholder,
      currentRoute,
      pageTitle,
      showProfileMenu,
      dashboardStats,
      setActiveRoute,
      toggleProfileMenu,
      handleLogout
    }
  }
}
