<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="close">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4" @click.stop>
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Add Text Knowledge</h3>
      </div>
      
      <div class="p-6">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            v-model="textData.title"
            type="text"
            placeholder="Enter title"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FCBA40] focus:border-transparent outline-none"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            v-model="textData.content"
            rows="8"
            placeholder="Enter content"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FCBA40] focus:border-transparent outline-none resize-none"
          ></textarea>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Service Tag</label>
          <select 
            v-model="textData.service_tag"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FCBA40] focus:border-transparent outline-none"
          >
            <option value="">Select a service tag</option>
            <option v-for="tag in serviceTags" :key="tag" :value="tag">{{ tag }}</option>
            <option value="custom">Add Custom Tag...</option>
          </select>
        </div>
        <div v-if="textData.service_tag === 'custom'" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Custom Service Tag</label>
          <input
            v-model="customTextTag"
            type="text"
            placeholder="Enter custom service tag"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FCBA40] focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-xl">
        <button 
          @click="close" 
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit" 
          class="px-4 py-2 text-sm font-medium text-white bg-[#FCBA40] rounded-lg hover:bg-yellow-500 transition-colors"
          :disabled="!textData.title || !textData.content || submitting"
          :class="{ 'opacity-50 cursor-not-allowed': !textData.title || !textData.content || submitting }"
        >
          <span v-if="!submitting">Submit</span>
          <div v-else class="flex items-center space-x-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Submitting...</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  serviceTags: {
    type: Array,
    default: () => []
  },
  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const textData = ref({
  title: '',
  content: '',
  service_tag: ''
})
const customTextTag = ref('')

const close = () => {
  textData.value = {
    title: '',
    content: '',
    service_tag: ''
  }
  customTextTag.value = ''
  emit('close')
}

const handleSubmit = () => {
  const serviceTag = textData.value.service_tag === 'custom' 
    ? customTextTag.value 
    : textData.value.service_tag
  
  emit('submit', textData.value, serviceTag)
}

watch(() => props.show, (newVal) => {
  if (!newVal) {
    textData.value = {
      title: '',
      content: '',
      service_tag: ''
    }
    customTextTag.value = ''
  }
})
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>