<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-gray-500 text-sm font-medium mb-1">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-800 mb-2">
          {{ formatNumber(value) }}
        </p>
        <div v-if="trend" class="flex items-center text-sm text-green-600">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
          <span>{{ trend }}</span>
        </div>
      </div>
      <div :class="`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`">
        <component :is="iconComponent" :class="`w-8 h-8 ${iconColor}`" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import UsersIcon from '@/components/icons/UsersIcon.vue'
import MessageIcon from '@/components/icons/MessageIcon.vue'
import FileIcon from '@/components/icons/FileIcon.vue'
import CalendarIcon from '@/components/icons/CalendarIcon.vue'

const props = defineProps({
  title: String,
  value: { type: Number, default: 0 },
  icon: String,
  bgColor: { type: String, default: 'bg-gray-50' },
  iconColor: { type: String, default: 'text-gray-500' },
  trend: { type: String, default: '' }
})

const iconMap = {
  'users-icon': UsersIcon,
  'message-icon': MessageIcon,
  'file-icon': FileIcon,
  'calendar-icon': CalendarIcon
}

const iconComponent = computed(() => iconMap[props.icon])
const formatNumber = (num) => num.toLocaleString()
</script>