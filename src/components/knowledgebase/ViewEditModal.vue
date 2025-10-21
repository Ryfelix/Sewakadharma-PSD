<!-- src/components/knowledgebase/ViewEditModal.vue -->
<template>
  <Transition name="modal">
    <div 
      v-if="show" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
      @click="handleBackdropClick"
    >
      <div 
        class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" 
        @click.stop
      >
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">View/Edit Document Content</h3>
            <p class="text-sm text-gray-500 mt-1">{{ document.filename || 'No filename' }}</p>
          </div>
          <button 
            @click="close" 
            class="text-gray-400 hover:text-gray-600 transition-colors"
            title="Close"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-6 flex-1 overflow-y-auto">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              v-model="localContent"
              rows="15"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none resize-none font-mono text-sm"
              placeholder="Document content will appear here..."
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Service Tag</label>
            <select 
              v-model="localServiceTag"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none"
            >
              <option value="">No tag</option>
              <option v-for="tag in serviceTags" :key="tag" :value="tag">{{ tag }}</option>
            </select>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-xl border-t">
          <button 
            @click="close" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            :disabled="updating"
          >
            Cancel
          </button>
          <button 
            @click="handleUpdate" 
            class="px-4 py-2 text-sm font-medium text-white bg-[#FC5649] rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="updating"
          >
            <span v-if="!updating">Save Changes</span>
            <div v-else class="flex items-center space-x-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  document: {
    type: Object,
    default: () => ({})
  },
  serviceTags: {
    type: Array,
    default: () => []
  },
  updating: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'update'])

const localContent = ref('')
const localServiceTag = ref('')

const close = () => {
  emit('close')
}

const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    close()
  }
}

const handleUpdate = () => {
  if (!props.updating) {
    emit('update', props.document.id, localContent.value, localServiceTag.value)
  }
}

watch(() => props.show, (newVal) => {
  if (newVal && props.document) {
    localContent.value = props.document.content || ''
    localServiceTag.value = props.document.service_tag || ''
    console.log('ViewEditModal opened with document:', props.document)
  }
}, { immediate: true })

watch(() => props.document, (newDoc) => {
  if (props.show && newDoc) {
    localContent.value = newDoc.content || ''
    localServiceTag.value = newDoc.service_tag || ''
    console.log('Document updated in ViewEditModal:', newDoc)
  }
}, { deep: true })
</script>

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
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