<template>
  <div 
    v-if="modelValue" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
    @click="$emit('update:modelValue', false)"
  >
    <div class="delete-modal bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4" @click.stop>
      <div class="p-6 text-center">
        <!-- Warning Icon -->
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg class="h-6 w-6 text-[#FC5649]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <!-- Title -->
        <h3 class="text-lg font-medium text-gray-900 mb-2">Delete User</h3>

        <!-- Description -->
        <p class="text-sm text-gray-500 mb-2">
          Are you sure you want to delete <strong class="text-gray-900">{{ userName }}</strong>?
        </p>
        <p class="text-xs text-red-600 mb-6">
          This action cannot be undone.
        </p>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <!-- Cancel Button -->
          <button 
            @click="$emit('update:modelValue', false)" 
            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            :disabled="loading"
          >
            Cancel
          </button>

          <!-- Delete Button -->
          <button 
            @click="$emit('confirm')" 
            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#FC5649] rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            :disabled="loading"
          >
            <!-- Loading Spinner -->
            <div v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{{ loading ? 'Deleting...' : 'Delete' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  modelValue: Boolean,   // Untuk v-model (show/hide modal)
  userName: {           // Nama user yang akan dihapus
    type: String,
    default: 'this user'
  },
  loading: {            // Loading state saat delete
    type: Boolean,
    default: false
  }
})

// Emits
defineEmits(['update:modelValue', 'confirm'])
</script>

<style scoped>
.delete-modal {
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

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>