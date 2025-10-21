import { ref, computed } from 'vue'

const API_BASE_URL = 'https://rag-chatbot-be.azurewebsites.net'

export function useKnowledgeBase() {
  // State
  const documents = ref([])
  const serviceTags = ref([])
  const selectedServiceTag = ref('')
  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const loading = ref(false)
  const deletingDocument = ref(null)

  // Message state
  const message = ref({
    show: false,
    type: '',
    text: ''
  })

  // Get auth token
  const getAuthToken = () => localStorage.getItem('authToken') || ''

  // Fetch with auth
  const fetchWithAuth = async (url, options = {}) => {
    const token = getAuthToken()
    const headers = {
      'Accept': 'application/json',
      ...options.headers
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }
    
    return fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
      mode: 'cors'
    })
  }

  // Computed
  const filteredDocuments = computed(() => {
    let docs = documents.value
    
    if (selectedServiceTag.value) {
      docs = docs.filter(doc => doc.service_tag === selectedServiceTag.value)
    }
    
    if (searchQuery.value) {
      docs = docs.filter(doc => 
        doc.filename.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }
    
    return docs
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredDocuments.value.length / itemsPerPage.value)
  })

  const paginatedDocuments = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredDocuments.value.slice(start, start + itemsPerPage.value)
  })

  // Methods
  const showMessage = (type, text) => {
    message.value = { show: true, type, text }
    setTimeout(() => {
      message.value.show = false
    }, 3000)
  }

  const fetchDocuments = async () => {
    loading.value = true
    try {
      let url = '/document'
      if (selectedServiceTag.value) {
        url = `/document/service/${selectedServiceTag.value}`
      }
      
      const response = await fetchWithAuth(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }
      
      const data = await response.json()
      console.log('API Response:', data) // Debug
      documents.value = data
      
      // Fetch service tags
      const tagsResponse = await fetchWithAuth('/document/tags')
      if (tagsResponse.ok) {
        const tagsData = await tagsResponse.json()
        console.log('Tags Response:', tagsData) // Debug
        serviceTags.value = tagsData.tags || []
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      showMessage('error', 'Failed to fetch documents')
    } finally {
      loading.value = false
    }
  }

  const uploadDocuments = async (files, serviceTag) => {
    if (files.length === 0) return false
    
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        if (serviceTag) {
          formData.append('service_tag', serviceTag)
        }
        
        const response = await fetchWithAuth('/document/embed-document', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }
      }
      
      showMessage('success', 'Documents uploaded successfully')
      await fetchDocuments()
      return true
    } catch (error) {
      console.error('Upload error:', error)
      showMessage('error', 'Upload failed: ' + error.message)
      return false
    }
  }

  const submitTextKnowledge = async (textData, serviceTag) => {
    if (!textData.title || !textData.content) return false
    
    try {
      const response = await fetchWithAuth('/document/embed-text', {
        method: 'POST',
        body: JSON.stringify({
          title: textData.title,
          content: textData.content,
          service_tag: serviceTag || undefined
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add text knowledge')
      }
      
      showMessage('success', 'Text knowledge added successfully')
      await fetchDocuments()
      return true
    } catch (error) {
      console.error('Submit text error:', error)
      showMessage('error', 'Failed to add text knowledge')
      return false
    }
  }

  const deleteDocument = async (filename) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return
    
    deletingDocument.value = filename
    
    try {
      const response = await fetchWithAuth(`/document/filename/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete document')
      }
      
      showMessage('success', 'Document deleted successfully')
      await fetchDocuments()
    } catch (error) {
      console.error('Delete error:', error)
      showMessage('error', 'Failed to delete document')
    } finally {
      deletingDocument.value = null
    }
  }

  const updateDocumentTag = async (filename, serviceTag) => {
    try {
      const response = await fetchWithAuth(
        `/document/filename/${encodeURIComponent(filename)}/tag`,
        {
          method: 'PUT',
          body: JSON.stringify({
            service_tag: serviceTag || undefined
          })
        }
      )
      
      if (!response.ok) {
        throw new Error('Failed to update service tag')
      }
      
      showMessage('success', 'Service tag updated successfully')
      await fetchDocuments()
      return true
    } catch (error) {
      console.error('Update error:', error)
      showMessage('error', 'Failed to update service tag')
      return false
    }
  }

  const updateDocumentContent = async (documentId, content, serviceTag) => {
    try {
      const response = await fetchWithAuth(`/document/chunk/${documentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          content: content,
          service_tag: serviceTag || undefined
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update content')
      }
      
      showMessage('success', 'Document content updated successfully')
      await fetchDocuments()
      return true
    } catch (error) {
      console.error('Update content error:', error)
      showMessage('error', 'Failed to update content')
      return false
    }
  }

  const sortBy = (field) => {
    documents.value.sort((a, b) => {
      if (a[field] > b[field]) return 1
      if (a[field] < b[field]) return -1
      return 0
    })
  }

  return {
    // State
    documents,
    serviceTags,
    selectedServiceTag,
    searchQuery,
    currentPage,
    itemsPerPage,
    loading,
    deletingDocument,
    message,
    
    // Computed
    filteredDocuments,
    totalPages,
    paginatedDocuments,
    
    // Methods
    fetchDocuments,
    uploadDocuments,
    submitTextKnowledge,
    deleteDocument,
    updateDocumentTag,
    updateDocumentContent,
    sortBy,
    showMessage
  }
}