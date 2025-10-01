<template>
  <div class="user-management-content">
    <!-- Header Section -->
    <div class="um-header mb-6">
      <div class="flex items-center justify-between">
        <!-- Left side: Add User button and selection info -->
        <div class="flex items-center space-x-4">
          <button 
            @click="showAddModal = true"
            class="add-user-btn flex items-center space-x-2 px-4 py-2 bg-[#FC5649] text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium">Add User</span>
          </button>
          
          <span v-if="selectedUsers.length > 0" class="selection-info text-sm text-gray-500">
            {{ selectedUsers.length }} row{{ selectedUsers.length > 1 ? 's' : '' }} selected
          </span>
        </div>
        
        <!-- Right side: Search -->
        <div class="search-container relative">
          <svg class="search-icon absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input 
            type="text" 
            placeholder="Search" 
            class="search-input pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none"
            v-model="searchQuery"
          />
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="users-table bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="w-12 px-4 py-3 text-left">
              <input 
                type="checkbox" 
                v-model="selectAll" 
                @change="toggleSelectAll"
                class="w-4 h-4 text-[#FC5649] border-gray-300 rounded focus:ring-[#FC5649] focus:ring-2"
              />
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" @click="sortBy('name')">
              <div class="flex items-center space-x-1">
                <span>Name</span>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" @click="sortBy('email')">
              <div class="flex items-center space-x-1">
                <span>Email</span>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-4">
              <input 
                type="checkbox" 
                v-model="selectedUsers" 
                :value="user.id"
                class="w-4 h-4 text-[#FC5649] border-gray-300 rounded focus:ring-[#FC5649] focus:ring-2"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
                  <svg v-else class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="font-medium text-gray-900">{{ user.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
              <button 
                @click="editUser(user)" 
                class="action-btn text-gray-400 hover:text-[#FCBA40] transition-colors p-1"
                title="Edit user"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button 
                @click="deleteUser(user.id)" 
                class="action-btn text-gray-400 hover:text-[#FC5649] transition-colors p-1"
                title="Delete user"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </td>
          </tr>
          
          <!-- Empty state -->
          <tr v-if="filteredUsers.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p class="text-sm">No users found</p>
              <p class="text-xs text-gray-400 mt-1">Add your first user to get started</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination flex items-center justify-center space-x-4 mt-6">
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

    <!-- Add/Edit User Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
      <div class="user-modal bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" @click.stop>
        <div class="p-6 border-b border-gray-200">
          <h3 class="modal-title text-lg font-semibold text-gray-900">
            {{ showAddModal ? 'Add New User' : 'Edit User' }}
          </h3>
        </div>
        
        <form @submit.prevent="saveUser" class="p-6 space-y-4">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input 
              v-model="userForm.name"
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none"
              placeholder="Enter user name"
            />
          </div>
          
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              v-model="userForm.email"
              type="email" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none"
              placeholder="Enter email address"
            />
          </div>
          
          <div v-if="showAddModal" class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              v-model="userForm.password"
              type="password" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none"
              placeholder="Enter password"
            />
          </div>

          <div class="modal-actions flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              @click="closeModal" 
              class="cancel-btn px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="save-btn px-4 py-2 text-sm font-medium text-white bg-[#FC5649] rounded-lg hover:bg-red-600 transition-colors"
            >
              {{ showAddModal ? 'Add User' : 'Update User' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeDeleteModal">
      <div class="delete-modal bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4" @click.stop>
        <div class="p-6 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
          <p class="text-sm text-gray-500 mb-6">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div class="flex space-x-3">
            <button 
              @click="closeDeleteModal" 
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="confirmDelete" 
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#FC5649] rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Reactive data
const searchQuery = ref('')
const selectAll = ref(false)
const selectedUsers = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortField = ref('name')
const sortDirection = ref('asc')
const userToDelete = ref(null)

// Form data
const userForm = ref({
  name: '',
  email: '',
  password: ''
})

const editingUserId = ref(null)

// Sample users data matching the UI
const users = ref([
  { 
    id: 1, 
    name: 'Admin1', 
    email: 'Admin1.BDD@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format&q=60',
    createdAt: new Date('2024-01-15')
  },
  { 
    id: 2, 
    name: 'Admin2', 
    email: 'Admin2.BDD@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b27c?w=32&h=32&fit=crop&crop=face&auto=format&q=60',
    createdAt: new Date('2024-02-20')
  }
])

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value.filter(user =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  
  // Sort users
  filtered.sort((a, b) => {
    let aValue = a[sortField.value]
    let bValue = b[sortField.value]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
  
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
})

// Watch for selectAll changes
watch(selectAll, (newValue) => {
  if (newValue) {
    selectedUsers.value = filteredUsers.value.map(user => user.id)
  } else {
    selectedUsers.value = []
  }
})

// Watch for individual selections to update selectAll
watch(selectedUsers, (newValue) => {
  if (newValue.length === 0) {
    selectAll.value = false
  } else if (newValue.length === filteredUsers.value.length) {
    selectAll.value = true
  } else {
    selectAll.value = false
  }
}, { deep: true })

// Methods
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedUsers.value = filteredUsers.value.map(user => user.id)
  } else {
    selectedUsers.value = []
  }
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const editUser = (user) => {
  editingUserId.value = user.id
  userForm.value = {
    name: user.name,
    email: user.email,
    password: ''
  }
  showEditModal.value = true
}

const deleteUser = (userId) => {
  userToDelete.value = userId
  showDeleteModal.value = true
}

const confirmDelete = () => {
  if (userToDelete.value) {
    users.value = users.value.filter(user => user.id !== userToDelete.value)
    selectedUsers.value = selectedUsers.value.filter(id => id !== userToDelete.value)
  }
  closeDeleteModal()
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

const saveUser = () => {
  if (showAddModal.value) {
    // Add new user
    const newUser = {
      id: Date.now(),
      name: userForm.value.name,
      email: userForm.value.email,
      avatar: null,
      createdAt: new Date()
    }
    users.value.unshift(newUser)
  } else if (showEditModal.value) {
    // Update existing user
    const index = users.value.findIndex(user => user.id === editingUserId.value)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        name: userForm.value.name,
        email: userForm.value.email
      }
    }
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingUserId.value = null
  userForm.value = {
    name: '',
    email: '',
    password: ''
  }
}
</script>

<style scoped>
.user-management-content {
  font-family: 'Poppins', sans-serif;
}

/* Custom scrollbar for modal */
.user-modal {
  max-height: 90vh;
  overflow-y: auto;
}

/* Table row hover effect */
tbody tr:hover {
  background-color: #f9fafb;
}

/* Action buttons hover effects */
.action-btn:hover svg {
  transform: scale(1.1);
}

/* Form inputs focus */
input:focus {
  box-shadow: 0 0 0 3px rgba(252, 86, 73, 0.1);
}

/* Modal animations */
.user-modal, .delete-modal {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>