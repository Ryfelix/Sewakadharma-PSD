<!-- src/views/KnowledgeBase.vue -->
<template>
  <div class="knowledge-base-content">
    <!-- Header Section -->
    <div class="kb-header mb-6">
      <div class="flex items-center justify-between">
        <!-- Left side: Filters, Document button, and selection info -->
        <div class="flex items-center space-x-4">
          <!-- Service Tag Filter -->
          <div class="relative">
            <select 
              v-model="selectedServiceTag" 
              @change="fetchDocuments"
              class="filter-select appearance-none flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 pr-8"
            >
              <option value="">All Services</option>
              <option v-for="tag in serviceTags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
            <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <button 
            @click="showUploadModal = true"
            class="add-document-btn flex items-center space-x-2 px-4 py-2 bg-[#FC5649] text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium">Document</span>
          </button>
          
          <button 
            @click="showTextModal = true"
            class="add-text-btn flex items-center space-x-2 px-4 py-2 bg-[#FCBA40] text-white rounded-lg hover:bg-yellow-500 transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium">Add Text</span>
          </button>
        </div>
        
        <!-- Right side: Search -->
        <div class="search-container relative">
          <svg class="search-icon absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input 
            type="text" 
            placeholder="Search documents..." 
            class="search-input pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none"
            v-model="searchQuery"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FC5649]"></div>
      <span class="ml-2 text-gray-600">Loading documents...</span>
    </div>

    <!-- Documents Table -->
    <DocumentsTable 
      v-else
      :documents="paginatedDocuments"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      :deleting-document="deletingDocument"
      :search-query="searchQuery"
      @view="handleViewDocument"
      @edit="handleEditDocument"
      @delete="deleteDocument"
      @sort="sortBy"
    />

    <!-- Pagination -->
    <div class="pagination flex items-center justify-center space-x-4 mt-6" v-if="totalPages > 1">
      <button 
        class="pagination-btn px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
        :disabled="currentPage === 1" 
        @click="currentPage--"
      >
        Previous
      </button>
      <span class="pagination-info text-sm text-gray-600">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button 
        class="pagination-btn px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
        :disabled="currentPage === totalPages" 
        @click="currentPage++"
      >
        Next
      </button>
    </div>

    <!-- Modals -->
    <UploadModal 
      :show="showUploadModal"
      :service-tags="serviceTags"
      :uploading="uploading"
      @close="showUploadModal = false"
      @upload="handleUploadDocuments"
    />

    <AddTextModal 
      :show="showTextModal"
      :service-tags="serviceTags"
      :submitting="submittingText"
      @close="showTextModal = false"
      @submit="handleSubmitText"
    />

    <EditTagModal 
      :show="showEditModal"
      :document="editingDocument"
      :service-tags="serviceTags"
      :updating="updatingDocument"
      @close="showEditModal = false"
      @update="handleUpdateTag"
    />

    <ViewEditModal 
      :show="showViewEditModal"
      :document="viewingDocument"
      :service-tags="serviceTags"
      :updating="updatingContent"
      @close="showViewEditModal = false"
      @update="handleUpdateContent"
    />

    <!-- Success/Error Messages -->
    <div v-if="message.show" class="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg" :class="{
      'bg-green-50 border border-green-200 text-green-700': message.type === 'success',
      'bg-red-50 border border-red-200 text-red-700': message.type === 'error'
    }">
      <div class="flex items-center space-x-2">
        <svg v-if="message.type === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm font-medium">{{ message.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useKnowledgeBase } from '@/composables/useKnowledgeBase'
import DocumentsTable from '@/components/knowledgebase/DocumentsTable.vue'
import UploadModal from '@/components/knowledgebase/UploadModal.vue'
import AddTextModal from '@/components/knowledgebase/AddTextModal.vue'
import EditTagModal from '@/components/knowledgebase/EditTagModal.vue'
import ViewEditModal from '@/components/knowledgebase/ViewEditModal.vue'

const {
  serviceTags,
  selectedServiceTag,
  searchQuery,
  currentPage,
  itemsPerPage,
  loading,
  deletingDocument,
  message,
  paginatedDocuments,
  totalPages,
  fetchDocuments,
  uploadDocuments,
  submitTextKnowledge,
  deleteDocument,
  updateDocumentTag,
  updateDocumentContent,
  sortBy,
  showMessage
} = useKnowledgeBase()

// Modal states
const showUploadModal = ref(false)
const uploading = ref(false)

const showTextModal = ref(false)
const submittingText = ref(false)

const showEditModal = ref(false)
const editingDocument = ref({})
const updatingDocument = ref(false)

const showViewEditModal = ref(false)
const viewingDocument = ref({})
const updatingContent = ref(false)

// Handlers
const handleUploadDocuments = async (files, serviceTag) => {
  uploading.value = true
  const success = await uploadDocuments(files, serviceTag)
  uploading.value = false
  if (success) {
    showUploadModal.value = false
  }
}

const handleSubmitText = async (textData, serviceTag) => {
  submittingText.value = true
  const success = await submitTextKnowledge(textData, serviceTag)
  submittingText.value = false
  if (success) {
    showTextModal.value = false
  }
}

const handleEditDocument = (doc) => {
  editingDocument.value = { ...doc }
  showEditModal.value = true
}

const handleUpdateTag = async (filename, serviceTag) => {
  updatingDocument.value = true
  const success = await updateDocumentTag(filename, serviceTag)
  updatingDocument.value = false
  if (success) {
    showEditModal.value = false
    // Force refresh current page
    currentPage.value = currentPage.value
  }
}

const handleViewDocument = async (doc) => {
  // Note: API doesn't provide endpoint to GET document content
  // The /document/chunk/{id} endpoint only supports PUT (update), not GET
  // So we can only show metadata
  
  viewingDocument.value = { 
    ...doc,
    id: doc.id,
    content: '⚠️ Cannot view document content.\n\nThe API does not provide an endpoint to retrieve document content.\n\nYou can only:\n- Edit service tags\n- Delete documents\n- Upload new documents\n\nTo view the actual content, please check the original file.',
    service_tag: doc.service_tag || ''
  }
  
  showViewEditModal.value = true
}

const handleUpdateContent = async (documentId, content, serviceTag) => {
  updatingContent.value = true
  const success = await updateDocumentContent(documentId, content, serviceTag)
  updatingContent.value = false
  if (success) {
    showViewEditModal.value = false
  }
}

onMounted(() => {
  fetchDocuments()
})
</script>

<style scoped>
.knowledge-base-content {
  font-family: 'Poppins', sans-serif;
}

.filter-select {
  background-image: none;
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