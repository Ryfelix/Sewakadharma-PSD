<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Users -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Total Users</p>
            <p class="text-3xl font-bold text-[#FC5649] mt-1">2</p>
          </div>
          <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-[#FC5649]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Conversations -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Total Conversations</p>
            <p class="text-3xl font-bold text-[#FC5649] mt-1">27</p>
          </div>
          <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-[#FC5649]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Documents -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Total Documents</p>
            <p class="text-3xl font-bold text-[#FC5649] mt-1">7</p>
          </div>
          <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-[#FC5649]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="space-y-6">
      <!-- Line Chart - Full Width -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Monthly Active Users</h3>
        <div class="relative w-full" style="height: 280px;">
          <canvas ref="lineChart" class="absolute inset-0 w-full h-full"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import Chart from "chart.js/auto"

const lineChart = ref(null)

onMounted(() => {
  // Initialize Line Chart
  const lineCtx = lineChart.value.getContext("2d")
  new Chart(lineCtx, {
    type: "line",
    data: {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
      datasets: [{
        label: "Users",
        data: [0, 0, 0, 2, 0, 0],
        borderColor: "#FC5649",
        backgroundColor: "rgba(252, 86, 73, 0.1)",
        tension: 0.4,
        pointBackgroundColor: "#FC5649",
        pointBorderColor: "#FC5649",
        pointRadius: 6,
        pointHoverRadius: 8,
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
            font: {
              family: 'Poppins',
              size: 12
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#9CA3AF',
            font: {
              family: 'Poppins'
            }
          }
        },
        y: {
          grid: {
            color: '#F3F4F6'
          },
          ticks: {
            color: '#9CA3AF',
            font: {
              family: 'Poppins'
            }
          }
        }
      },
      layout: {
        padding: {
          top: 10,
          bottom: 20
        }
      }
    }
  })
})
</script>