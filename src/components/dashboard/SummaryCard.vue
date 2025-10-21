<template>
  <div :class="`rounded-xl shadow-sm p-6 text-white ${gradientClass}`">
    <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
    <div class="space-y-2">
      <p class="text-3xl font-bold">{{ formatNumber(value) }}</p>
      <p :class="descriptionClass">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: { type: Number, default: 0 },
  description: String,
  variant: { type: String, default: 'red' }
})

const gradientClass = computed(() => 
  props.variant === 'red' 
    ? 'bg-gradient-to-br from-[#FC5649] to-red-600'
    : 'bg-gradient-to-br from-[#FCBA40] to-yellow-600'
)

const descriptionClass = computed(() =>
  props.variant === 'red' ? 'text-red-100' : 'text-yellow-100'
)

const formatNumber = (num) => num.toLocaleString()
</script>