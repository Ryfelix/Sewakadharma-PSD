<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <component :is="iconComponent" :class="`w-5 h-5 mr-2 ${iconColor}`" />
      {{ title }}
    </h3>
    <div class="relative w-full" style="height: 280px;">
      <canvas ref="chartCanvas" class="absolute inset-0 w-full h-full"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'
import TrendingIcon from '@/components/icons/TrendingIcon.vue'
import MessageIcon from '@/components/icons/MessageIcon.vue'

const props = defineProps({
  title: String,
  icon: String,
  iconColor: { type: String, default: 'text-gray-500' },
  data: { type: Array, default: () => [] },
  dataKey: String,
  lineColor: { type: String, default: '#FC5649' },
  label: { type: String, default: 'Data' }
})

const iconMap = {
  'trending-icon': TrendingIcon,
  'message-icon': MessageIcon
}

const iconComponent = computed(() => iconMap[props.icon])
const chartCanvas = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartCanvas.value || props.data.length === 0) return

  if (chartInstance) chartInstance.destroy()

  const ctx = chartCanvas.value.getContext('2d')
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.data.map(item => item.month),
      datasets: [{
        label: props.label,
        data: props.data.map(item => item[props.dataKey]),
        borderColor: props.lineColor,
        backgroundColor: `${props.lineColor}20`,
        tension: 0.4,
        pointBackgroundColor: props.lineColor,
        pointBorderColor: props.lineColor,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            color: '#6B7280',
            font: { family: 'Poppins', size: 12 },
            padding: 15
          }
        },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#1F2937',
          bodyColor: '#6B7280',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          padding: 12,
          font: { family: 'Poppins' }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: '#9CA3AF',
            font: { family: 'Poppins', size: 11 }
          }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#F3F4F6', drawBorder: false },
          ticks: {
            color: '#9CA3AF',
            font: { family: 'Poppins', size: 11 }
          }
        }
      }
    }
  })
}

onMounted(() => initChart())
watch(() => props.data, () => initChart(), { deep: true })
</script>