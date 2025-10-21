<template>
  <div class="user-management-content min-h-screen bg-[#F7F4F2] p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="um-header mb-6">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <!-- Left side: Title and Add User button -->
          <div class="flex items-center space-x-4" style="z-index: 100; position: relative;">
            <h1 class="text-2xl font-semibold text-gray-900">User Management</h1>
            <button 
              @click="handleAddUserClick"
              class="add-user-btn flex items-center space-x-2 px-4 py-2 bg-[#FC5649] text-white rounded-lg hover:bg-red-600 transition-colors"
              style="position: relative; z-index: 10; cursor: pointer;"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm font-medium">Add User</span>
            </button>
          </div>
          
          <!-- Right side: Search -->
          <div class="search-container relative">
            <svg class="search-icon absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by username, name or email" 
              class="search-input pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none bg-white"
              v-model="searchQuery"
            />
          </div>
        </div>
      </div>

      <!-- Alert Messages -->
      <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-green-800">{{ successMessage }}</p>
        </div>
        <button @click="successMessage = ''" class="text-green-600 hover:text-green-800">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <div v-if="error && !modalError" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
        <button @click="error = ''" class="text-red-600 hover:text-red-800">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Users Table Component -->
      <UserTable 
        :users="paginatedUsers" 
        :loading="loading"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @sort="sortBy"
      />

      <!-- Pagination -->
      <div class="pagination flex items-center justify-between mt-6 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
        <div class="text-sm text-gray-600">
          Showing {{ startItem }} to {{ endItem }} of {{ filteredUsers.length }} users
        </div>
        <div class="flex items-center space-x-4">
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
            :disabled="currentPage === totalPages || totalPages === 0" 
            @click="currentPage++"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Add User Modal -->
      <div 
        v-if="showAddModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showAddModal = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">
              {{ selectedUser ? 'Edit User' : 'Add New User' }}
            </h2>
            <button 
              @click="showAddModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Error Alert -->
          <div v-if="modalError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ modalError }}</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit(formData)">
            <div class="space-y-4">
              <!-- Username -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Username <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.username"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="Enter username"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="Enter email"
                />
              </div>

              <!-- Full Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  v-model="formData.full_name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="Enter full name"
                />
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Password <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.password"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="Enter password"
                />
              </div>

              <!-- Role -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  v-model="formData.role"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="showAddModal = false"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                :disabled="modalLoading"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="modalLoading"
              >
                {{ modalLoading ? 'Saving...' : (selectedUser ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Original UserModal (hidden, keep for reference) -->
      <UserModal 
        v-show="false"
        v-model="showAddModal"
        :user="selectedUser"
        :loading="modalLoading"
        :error="modalError"
        @submit="handleSubmit"
      />

      <DeleteConfirmModal 
        v-model="showDeleteModal"
        :loading="deleteLoading"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUsers } from '../composables/useUsers';
import UserTable from '../components/users/UserTable.vue';
import UserModal from '../components/users/UserModal.vue';
import DeleteConfirmModal from '../components/users/DeleteConfirmModal.vue';

// Use composable
const {
  loading,
  error,
  searchQuery,
  currentPage,
  filteredUsers,
  paginatedUsers,
  totalPages,
  fetchUsers,       
  createUser,
  sortBy
} = useUsers();

// Local state
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const modalLoading = ref(false);
const modalError = ref('');
const deleteLoading = ref(false);
const successMessage = ref('');
const selectedUser = ref(null);
const userToDelete = ref(null);

// Form data for add/edit user
const formData = ref({
  username: '',
  email: '',
  password: '',
  full_name: '',
  role: 'admin'
});

// Computed for pagination display
const startItem = computed(() => {
  if (filteredUsers.value.length === 0) return 0;
  return (currentPage.value - 1) * 10 + 1;
});

const endItem = computed(() => {
  const end = currentPage.value * 10;
  return end > filteredUsers.value.length ? filteredUsers.value.length : end;
});

// Methods
const handleAddUserClick = () => {
  console.log('🔵 Add User button clicked!');
  openAddModal();
};

const testClick = () => {
  alert('Button clicked!');
  openAddModal();
};

const openAddModal = () => {
  console.log('🔵 openAddModal called!');
  console.log('Before - showAddModal:', showAddModal.value);
  
  selectedUser.value = null;
  modalError.value = '';
  
  // Reset form
  formData.value = {
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: 'admin'
  };
  
  showAddModal.value = true;
  
  console.log('After - showAddModal:', showAddModal.value);
};

const openEditModal = (user) => {
  selectedUser.value = user;
  modalError.value = '';
  showAddModal.value = true;
};

const openDeleteModal = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const handleSubmit = async (userData) => {
  modalLoading.value = true;
  modalError.value = '';
  
  try {
    if (selectedUser.value) {
      // Edit mode (not implemented yet)
      modalError.value = 'Update user feature is not available yet. API endpoint needed.';
    } else {
      // Add mode
      console.log('Creating user with data:', userData);
      await createUser(userData);
      showAddModal.value = false;
      successMessage.value = `User "${userData.username}" has been created successfully`;
      setTimeout(() => successMessage.value = '', 5000);
    }
  } catch (err) {
    console.error('Error in handleSubmit:', err);
    modalError.value = err.message || 'Failed to create user';
  } finally {
    modalLoading.value = false;
  }
};

const confirmDelete = async () => {
  deleteLoading.value = true;
  
  try {
    alert(`Delete user "${userToDelete.value.username}" feature is not available yet. API endpoint needed.`);
    showDeleteModal.value = false;
    userToDelete.value = null;
  } catch (err) {
    error.value = err.message || 'Failed to delete user';
  } finally {
    deleteLoading.value = false;
  }
};

onMounted(async () => {
  console.log('✅ Component mounted');
  console.log('showAddModal:', showAddModal.value);
  console.log('testClick function:', typeof testClick);
  await fetchUsers();  
});
</script>