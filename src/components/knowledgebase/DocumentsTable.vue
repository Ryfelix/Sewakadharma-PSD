<!-- src/components/knowledgebase/DocumentsTable.vue -->
<template>
  <div class="documents-table bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <table class="w-full">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th class="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            No.
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" @click="$emit('sort', 'filename')">
            <div class="flex items-center space-x-1">
              <span>Document</span>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" @click="$emit('sort', 'uploaded_at')">
            <div class="flex items-center space-x-1">
              <span>Uploaded</span>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Service Tag
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" @click="$emit('sort', 'updated_at')">
            <div class="flex items-center space-x-1">
              <span>Last Edited</span>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(document, index) in documents" :key="document.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ (currentPage - 1) * itemsPerPage + index + 1 }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg" :class="getFileIconBg(document.file_type)">
                <svg class="w-4 h-4" :class="getFileIconColor(document.file_type)" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                </svg>
              </div>
              <button 
                @click.prevent="handleViewClick(document)"
                class="text-[#FC5649] hover:text-red-700 transition-colors font-medium cursor-pointer text-left"
              >
                {{ document.filename }}
              </button>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatDate(document.uploaded_at) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <span 
              v-if="document.service_tag && document.service_tag.trim() !== ''" 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FCBA40] text-white"
            >
              {{ document.service_tag }}
            </span>
            <span v-else class="text-gray-400 italic text-xs">No tag</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <div class="flex flex-col">
              <span class="text-gray-700 font-medium">{{ getAdminName(document.admins) }}</span>
              <span class="text-xs text-gray-400">{{ formatDate(document.updated_at) }}</span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
            <button 
              @click.prevent="handleViewClick(document)" 
              class="action-btn text-gray-400 hover:text-blue-600 transition-colors p-1 inline-flex items-center justify-center"
              title="View/Edit content"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button 
              @click.prevent="handleEditClick(document)" 
              class="action-btn text-gray-400 hover:text-[#FCBA40] transition-colors p-1 inline-flex items-center justify-center"
              title="Edit service tag"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button 
              @click.prevent="handleDeleteClick(document.filename)" 
              class="action-btn text-gray-400 hover:text-[#FC5649] transition-colors p-1 inline-flex items-center justify-center"
              title="Delete document"
              :disabled="deletingDocument === document.filename"
            >
              <svg v-if="deletingDocument === document.filename" class="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </td>
        </tr>
        
        <!-- Empty state -->
        <tr v-if="documents.length === 0">
          <td colspan="6" class="px-6 py-12 text-center text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-sm">{{ searchQuery ? 'No documents found matching your search' : 'No documents found' }}</p>
            <p class="text-xs text-gray-400 mt-1">Upload your first document to get started</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatDate, getAdminName, getFileIconBg, getFileIconColor } from '@/utils/formatters'

defineProps({
  documents: {
    type: Array,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  },
  deletingDocument: {
    type: String,
    default: null
  },
  searchQuery: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['view', 'edit', 'delete', 'sort'])

const handleViewClick = (document) => {
  console.log('View clicked:', document)
  emit('view', document)
}

const handleEditClick = (document) => {
  console.log('Edit clicked:', document)
  emit('edit', document)
}

const handleDeleteClick = (filename) => {
  console.log('Delete clicked:', filename)
  emit('delete', filename)
}
</script>

<style scoped>
tbody tr:hover {
  background-color: #f9fafb;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover svg {
  transform: scale(1.1);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>