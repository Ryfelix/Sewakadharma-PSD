<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Primary Prompt</h3>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Kamu adalah chatbot customer service perusahaan Boleh Dicoba Digital, jawab dengan bahasa formal, singkat, ramah."
      rows="6"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FCBA40] focus:border-transparent outline-none resize-none"
      :class="{ 'border-red-500': error }"
    ></textarea>
    <div v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</div>
    <div class="text-sm text-gray-500 mt-2">
      Instruksi utama yang akan menentukan perilaku chatbot
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