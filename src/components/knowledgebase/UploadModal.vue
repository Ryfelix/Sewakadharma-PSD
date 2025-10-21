<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="close">
    <div class="upload-modal bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4" @click.stop>
      <div class="p-6 border-b border-gray-200">
        <h3 class="modal-title text-lg font-semibold text-gray-900">Upload Document</h3>
      </div>
      
      <div class="p-6">
        <!-- Service Tag Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Service Tag</label>
          <select 
            v-model="uploadServiceTag"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none"
          >
            <option value="">Select a service tag</option>
            <option v-for="tag in serviceTags" :key="tag" :value="tag">{{ tag }}</option>
            <option value="custom">Add Custom Tag...</option>
          </select>
        </div>

        <!-- Custom Tag Input -->
        <div v-if="uploadServiceTag === 'custom'" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Custom Service Tag</label>
          <input
            v-model="customServiceTag"
            type="text"
            placeholder="Enter custom service tag"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none"
          />
        </div>

        <!-- File Upload Area -->
        <div 
          class="upload-area border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#FC5649] transition-colors cursor-pointer"
          @drop="handleFileDrop" 
          @dragover.prevent
          @dragenter.prevent
          @click="triggerFileInput"
        >
          <svg class="upload-icon mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="upload-text text-gray-600 mb-2">
            Drop your files here or 
            <span class="upload-link text-[#FC5649] hover:text-red-700 cursor-pointer font-medium">Click to upload</span>
          </p>
          <p class="upload-hint text-xs text-gray-400">.pdf, .txt, .docx files supported</p>
        </div>
        
        <input 
          ref="fileInput" 
          type="file" 
          multiple 
          accept=".pdf,.txt,.docx"
          @change="handleFileSelect"
          class="hidden"
        />
        
        <!-- Selected Files Preview -->
        <div v-if="selectedFiles.length > 0" class="mt-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Selected Files:</h4>
          <div class="space-y-2">
            <div v-for="file in selectedFiles" :key="file.name" class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-gray-700">{{ file.name }}</span>
              </div>
              <button @click="removeFile(file)" class="text-gray-400 hover:text-red-500">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-actions flex justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-xl">
        <button 
          @click="close" 
          class="cancel-btn px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="handleUpload" 
          class="save-btn px-4 py-2 text-sm font-medium text-white bg-[#FC5649] rounded-lg hover:bg-red-600 transition-colors"
          :disabled="selectedFiles.length === 0 || uploading"
          :class="{ 'opacity-50 cursor-not-allowed': selectedFiles.length === 0 || uploading }"
        >
          <span v-if="!uploading">Upload</span>
          <div v-else class="flex items-center space-x-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Uploading...</span>
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
  uploading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'upload'])

const fileInput = ref(null)
const selectedFiles = ref([])
const uploadServiceTag = ref('')
const customServiceTag = ref('')

const close = () => {
  selectedFiles.value = []
  uploadServiceTag.value = ''
  customServiceTag.value = ''
  emit('close')
}

const handleFileSelect = (e) => {
  selectedFiles.value = Array.from(e.target.files)
}

const handleFileDrop = (e) => {
  e.preventDefault()
  selectedFiles.value = Array.from(e.dataTransfer.files)
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const removeFile = (file) => {
  selectedFiles.value = selectedFiles.value.filter(f => f !== file)
}

const handleUpload = () => {
  const serviceTag = uploadServiceTag.value === 'custom' 
    ? customServiceTag.value 
    : uploadServiceTag.value
  
  emit('upload', selectedFiles.value, serviceTag)
}

watch(() => props.show, (newVal) => {
  if (!newVal) {
    selectedFiles.value = []
    uploadServiceTag.value = ''
    customServiceTag.value = ''
  }
})
</script>

<style scoped>
.upload-modal {
  max-height: 90vh;
  overflow-y: auto;
}

.upload-area:hover {
  background-color: #fef2f2;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>