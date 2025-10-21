<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">API Key</h3>
    <div class="relative">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        placeholder="Enter your API key"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FCBA40] focus:border-transparent outline-none bg-gray-50"
        :class="{ 'border-red-500': error }"
      />
      <div v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>