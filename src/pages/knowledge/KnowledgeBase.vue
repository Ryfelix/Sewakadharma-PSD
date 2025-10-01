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
          
          <span v-if="selectedDocuments.length > 0" class="selection-info text-sm text-gray-500">
            {{ selectedDocuments.length }} row{{ selectedDocuments.length > 1 ? 's' : '' }} selected
          </span>
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
    <div v-else class="documents-table bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No.
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" @click="sortBy('filename')">
              <div class="flex items-center space-x-1">
                <span>Document</span>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" @click="sortBy('uploaded_at')">
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
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(document, index) in paginatedDocuments" :key="document.id" class="hover:bg-gray-50 transition-colors">
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
                <span class="text-[#FC5649] hover:text-red-700 transition-colors font-medium cursor-pointer">
                  {{ document.filename }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getFileTypeBadge(document.file_type)">
                {{ document.file_type ? document.file_type.toUpperCase() : 'TEXT' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(document.uploaded_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span v-if="document.service_tag" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FCBA40] text-white">
                {{ document.service_tag }}
              </span>
              <span v-else class="text-gray-400 italic">No tag</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
              <button 
                @click="viewEditDocument(document)" 
                class="action-btn text-gray-400 hover:text-blue-600 transition-colors p-1"
                title="View/Edit content"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button 
                @click="editDocument(document)" 
                class="action-btn text-gray-400 hover:text-[#FCBA40] transition-colors p-1"
                title="Edit service tag"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button 
                @click="deleteDocument(document.filename)" 
                class="action-btn text-gray-400 hover:text-[#FC5649] transition-colors p-1"
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
          <tr v-if="filteredDocuments.length === 0">
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

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeUploadModal">
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
            @click="closeUploadModal" 
            class="cancel-btn px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="uploadDocuments" 
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

    <!-- Add Text Modal -->
    <div v-if="showTextModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeTextModal">
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
            @click="closeTextModal" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="submitTextKnowledge" 
            class="px-4 py-2 text-sm font-medium text-white bg-[#FCBA40] rounded-lg hover:bg-yellow-500 transition-colors"
            :disabled="!textData.title || !textData.content || submittingText"
            :class="{ 'opacity-50 cursor-not-allowed': !textData.title || !textData.content || submittingText }"
          >
            <span v-if="!submittingText">Submit</span>
            <div v-else class="flex items-center space-x-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeEditModal">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Edit Service Tag</h3>
        </div>
        
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
            <input 
              :value="editingDocument.filename"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              disabled
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Service Tag</label>
            <select 
              v-model="editingDocument.service_tag"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none"
            >
              <option value="">No tag</option>
              <option v-for="tag in serviceTags" :key="tag" :value="tag">{{ tag }}</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-xl">
          <button 
            @click="closeEditModal" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="updateDocument" 
            class="px-4 py-2 text-sm font-medium text-white bg-[#FC5649] rounded-lg hover:bg-red-600 transition-colors"
            :disabled="updatingDocument"
          >
            <span v-if="!updatingDocument">Update</span>
            <div v-else class="flex items-center space-x-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Updating...</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- View/Edit Content Modal -->
    <div v-if="showViewEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeViewEditModal">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">View/Edit Document Content</h3>
          <p class="text-sm text-gray-500 mt-1">{{ viewingDocument.filename }}</p>
        </div>
        
        <div class="p-6 flex-1 overflow-y-auto">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              v-model="viewingDocument.content"
              rows="15"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Service Tag</label>
            <select 
              v-model="viewingDocument.service_tag"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">No tag</option>
              <option v-for="tag in serviceTags" :key="tag" :value="tag">{{ tag }}</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-xl border-t">
          <button 
            @click="closeViewEditModal" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="updateDocumentContent" 
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="updatingContent"
          >
            <span v-if="!updatingContent">Save Changes</span>
            <div v-else class="flex items-center space-x-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          </button>
        </div>
      </div>
    </div>

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

<script>
import axios from "axios";

export default {
  data() {
    return {
      documents: [],
      serviceTags: [],
      selectedServiceTag: "",
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      loading: false,
      deletingDocument: null,
      selectedDocuments: [],
      showUploadModal: false,
      selectedFiles: [],
      uploadServiceTag: "",
      customServiceTag: "",
      uploading: false,
      showEditModal: false,
      editingDocument: {},
      updatingDocument: false,
      showTextModal: false,
      textData: {
        title: "",
        content: "",
        service_tag: "",
      },
      customTextTag: "",
      submittingText: false,
      showViewEditModal: false,
      viewingDocument: {},
      updatingContent: false,
      message: {
        show: false,
        type: "",
        text: "",
      },
    };
  },
  computed: {
    filteredDocuments() {
      let docs = this.documents;

      if (this.selectedServiceTag) {
        docs = docs.filter((doc) => doc.service_tag === this.selectedServiceTag);
      }

      if (this.searchQuery) {
        docs = docs.filter((doc) =>
          doc.filename.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      return docs;
    },
    totalPages() {
      return Math.ceil(this.filteredDocuments.length / this.itemsPerPage);
    },
    paginatedDocuments() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredDocuments.slice(start, start + this.itemsPerPage);
    },
  },
  methods: {
    async fetchDocuments() {
      this.loading = true;
      try {
        let url = "/api/document";
        if (this.selectedServiceTag) {
          url = `/api/document/service/${this.selectedServiceTag}`;
        }
        const res = await axios.get(url);
        this.documents = res.data || [];
        
        const tagsRes = await axios.get("/api/document/tags");
        this.serviceTags = tagsRes.data.tags || [];
      } catch (err) {
        this.showMessage("error", "Failed to fetch documents");
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async uploadDocuments() {
      if (this.selectedFiles.length === 0) return;
      this.uploading = true;

      const formData = new FormData();
      this.selectedFiles.forEach((file) => formData.append("files", file));

      const serviceTag = this.uploadServiceTag === "custom" ? this.customServiceTag : this.uploadServiceTag;
      if (serviceTag) {
        formData.append("service_tag", serviceTag);
      }

      try {
        await axios.post("/api/document/embed-document", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        this.showMessage("success", "Documents uploaded successfully");
        this.closeUploadModal();
        this.fetchDocuments();
      } catch (err) {
        this.showMessage("error", "Upload failed");
        console.error(err);
      } finally {
        this.uploading = false;
      }
    },
    async submitTextKnowledge() {
      if (!this.textData.title || !this.textData.content) return;
      this.submittingText = true;

      const serviceTag = this.textData.service_tag === "custom" ? this.customTextTag : this.textData.service_tag;

      try {
        await axios.post("/api/document/embed-text", {
          title: this.textData.title,
          content: this.textData.content,
          service_tag: serviceTag || null,
        });
        this.showMessage("success", "Text knowledge added successfully");
        this.closeTextModal();
        this.fetchDocuments();
      } catch (err) {
        this.showMessage("error", "Failed to add text knowledge");
        console.error(err);
      } finally {
        this.submittingText = false;
      }
    },
    async deleteDocument(filename) {
      this.deletingDocument = filename;
      try {
        await axios.delete(`/api/document/filename/${filename}`);
        this.showMessage("success", "Document deleted");
        this.fetchDocuments();
      } catch (err) {
        this.showMessage("error", "Failed to delete document");
        console.error(err);
      } finally {
        this.deletingDocument = null;
      }
    },
    async viewEditDocument(doc) {
      this.viewingDocument = { ...doc };
      this.showViewEditModal = true;
    },
    async updateDocumentContent() {
      this.updatingContent = true;
      try {
        await axios.put(`/api/document/chunk/${this.viewingDocument.id}`, {
          content: this.viewingDocument.content,
          service_tag: this.viewingDocument.service_tag || null,
        });
        this.showMessage("success", "Document content updated successfully");
        this.closeViewEditModal();
        this.fetchDocuments();
      } catch (err) {
        this.showMessage("error", "Failed to update content");
        console.error(err);
      } finally {
        this.updatingContent = false;
      }
    },
    editDocument(doc) {
      this.editingDocument = { ...doc };
      this.showEditModal = true;
    },
    async updateDocument() {
      this.updatingDocument = true;
      try {
        await axios.put(`/api/document/filename/${this.editingDocument.filename}/tag`, {
          service_tag: this.editingDocument.service_tag || null,
        });
        this.showMessage("success", "Service tag updated successfully");
        this.closeEditModal();
        this.fetchDocuments();
      } catch (err) {
        this.showMessage("error", "Update failed");
        console.error(err);
      } finally {
        this.updatingDocument = false;
      }
    },
    showMessage(type, text) {
      this.message = { show: true, type, text };
      setTimeout(() => {
        this.message.show = false;
      }, 3000);
    },
    closeUploadModal() {
      this.showUploadModal = false;
      this.selectedFiles = [];
      this.uploadServiceTag = "";
      this.customServiceTag = "";
    },
    closeEditModal() {
      this.showEditModal = false;
      this.editingDocument = {};
    },
    closeTextModal() {
      this.showTextModal = false;
      this.textData = {
        title: "",
        content: "",
        service_tag: "",
      };
      this.customTextTag = "";
    },
    closeViewEditModal() {
      this.showViewEditModal = false;
      this.viewingDocument = {};
    },
    handleFileSelect(e) {
      this.selectedFiles = Array.from(e.target.files);
    },
    handleFileDrop(e) {
      e.preventDefault();
      this.selectedFiles = Array.from(e.dataTransfer.files);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    removeFile(file) {
      this.selectedFiles = this.selectedFiles.filter((f) => f !== file);
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    sortBy(field) {
      this.documents.sort((a, b) =>
        a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0
      );
    },
    getFileIconBg(type) {
      return {
        "bg-red-100": type === "pdf",
        "bg-blue-100": type === "docx",
        "bg-green-100": type === "txt",
        "bg-gray-100": !type,
      };
    },
    getFileIconColor(type) {
      return {
        "text-red-600": type === "pdf",
        "text-blue-600": type === "docx",
        "text-green-600": type === "txt",
        "text-gray-600": !type,
      };
    },
    getFileTypeBadge(type) {
      return {
        "bg-red-100 text-red-800": type === "pdf",
        "bg-blue-100 text-blue-800": type === "docx",
        "bg-green-100 text-green-800": type === "txt",
        "bg-gray-100 text-gray-800": !type,
      };
    },
  },
  mounted() {
    this.fetchDocuments();
  },
};
</script>

<style scoped>
.knowledge-base-content {
  font-family: 'Poppins', sans-serif;
}

.upload-modal {
  max-height: 90vh;
  overflow-y: auto;
}

input[type="file"] {
  display: none;
}

.upload-area:hover {
  background-color: #fef2f2;
}

tbody tr:hover {
  background-color: #f9fafb;
}

.action-btn:hover svg {
  transform: scale(1.1);
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