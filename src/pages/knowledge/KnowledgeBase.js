import { ref, computed } from 'vue'
import { Plus, Search, Edit, Trash2 } from 'lucide-vue-next'

export default {
  name: 'KnowledgeBase',
  components: { Plus, Search, Edit, Trash2 },
  setup() {
    const showUploadModal = ref(false)
    const searchQuery = ref('')
    const selectAll = ref(false)
    const selectedDocuments = ref([])

    const documents = ref([
      { id: 1, name: 'SEO.pdf', url: '#', lastUpdated: new Date('2025-07-25') },
      { id: 2, name: 'WebDev-Ver1.pdf', url: '#', lastUpdated: new Date('2025-07-25') }
    ])

    const filteredDocuments = computed(() => {
      return documents.value.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedDocuments.value = documents.value.map(doc => doc.id)
      } else {
        selectedDocuments.value = []
      }
    }

    const formatDate = (date) => {
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    const editDocument = (doc) => {
      console.log('Edit:', doc)
    }

    const deleteDocument = (id) => {
      documents.value = documents.value.filter(doc => doc.id !== id)
    }

    const handleFileSelect = (e) => {
      console.log('Selected:', e.target.files)
    }

    const saveDocument = () => {
      console.log('Save document!')
      showUploadModal.value = false
    }

    const closeUploadModal = () => {
      showUploadModal.value = false
    }

    return {
      showUploadModal,
      searchQuery,
      selectAll,
      selectedDocuments,
      documents,
      filteredDocuments,
      toggleSelectAll,
      formatDate,
      editDocument,
      deleteDocument,
      handleFileSelect,
      saveDocument,
      closeUploadModal
    }
  }
}
