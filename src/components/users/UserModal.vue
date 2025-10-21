<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
    @click="handleClose"
  >
    <div 
      class="user-modal bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" 
      @click.stop
    >
      <div class="p-6 border-b border-gray-200">
        <h3 class="modal-title text-lg font-semibold text-gray-900">
          {{ isEdit ? 'Edit User' : 'Add New User' }}
        </h3>
      </div>
      
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Username -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Username <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.username"
            type="text" 
            required
            :disabled="isEdit"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter username"
          />
        </div>

        <!-- Full Name -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input 
            v-model="formData.full_name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none"
            placeholder="Enter full name"
          />
        </div>
        
        <!-- Email -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.email"
            type="email" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none"
            placeholder="Enter email address"
          />
        </div>
        
        <!-- Password (only for add) -->
        <div v-if="!isEdit" class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Password <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.password"
            type="password" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none"
            placeholder="Enter password"
          />
        </div>

        <!-- Role -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select 
            v-model="formData.role"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC5649] focus:border-transparent outline-none"
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- Actions -->
        <div class="modal-actions flex justify-end space-x-3 pt-4">
          <button 
            type="button"
            @click="handleClose" 
            :disabled="loading"
            class="cancel-btn px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            :disabled="loading"
            class="save-btn px-4 py-2 text-sm font-medium text-white bg-[#FC5649] rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Saving...' : (isEdit ? 'Update User' : 'Add User') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  isEdit: Boolean,
  user: Object,
  loading: Boolean
});

const emit = defineEmits(['close', 'submit']);

const formData = ref({
  username: '',
  email: '',
  full_name: '',
  password: '',
  role: 'admin'
});

const errorMessage = ref('');

// Watch for user changes (when editing)
watch(() => props.user, (newUser) => {
  if (newUser && props.isEdit) {
    formData.value = {
      username: newUser.username || '',
      email: newUser.email || '',
      full_name: newUser.full_name || '',
      password: '',
      role: newUser.role || 'admin'
    };
  }
}, { immediate: true });

// Reset form when modal closes
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    formData.value = {
      username: '',
      email: '',
      full_name: '',
      password: '',
      role: 'admin'
    };
    errorMessage.value = '';
  }
});

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  errorMessage.value = '';
  emit('submit', { ...formData.value });
};
</script>

<style scoped>
.user-modal {
  max-height: 90vh;
  overflow-y: auto;
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

input:focus, select:focus {
  box-shadow: 0 0 0 3px rgba(252, 86, 73, 0.1);
}
</style>