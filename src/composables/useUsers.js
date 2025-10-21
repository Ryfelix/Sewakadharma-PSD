import { ref, computed } from 'vue';
import { authAPI, documentAPI } from '../services/api';

export function useUsers() {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const searchQuery = ref('');
  const sortField = ref('username');
  const sortDirection = ref('asc');
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const filteredUsers = computed(() => {
    let filtered = users.value.filter(user => {
      const searchLower = searchQuery.value.toLowerCase();
      return (
        user.username?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.full_name?.toLowerCase().includes(searchLower)
      );
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField.value] || '';
      let bValue = b[sortField.value] || '';

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  });

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredUsers.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
  });

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // Try to get token from any common key
      const token = localStorage.getItem('auth_token');
      const accessToken = localStorage.getItem('access_token');
      const authToken = localStorage.getItem('token');
      const camelCaseToken = localStorage.getItem('authToken');
      
      console.log('🔍 Debug Token Check:', {
        auth_token: token,
        access_token: accessToken,
        token: authToken,
        authToken: camelCaseToken,
        allKeys: Object.keys(localStorage)
      });

      const finalToken = token || accessToken || authToken || camelCaseToken;
      
      if (!finalToken) {
        error.value = 'Please login first to view users';
        console.error('❌ No authentication token found in localStorage');
        loading.value = false;
        return;
      }

      console.log('✅ Token found, fetching documents and current admin...');
      
      // Fetch documents for admins who uploaded documents
      const documents = await documentAPI.getAllDocuments();
      
      const adminMap = new Map();
      
      // Add admins from documents
      documents.forEach(doc => {
        if (doc.admins) {
          adminMap.set(doc.admins.id, {
            id: doc.admins.id,
            username: doc.admins.username,
            full_name: doc.admins.full_name,
            email: `${doc.admins.username}@admin.com`,
            role: 'admin',
            is_active: true,
            last_login: doc.updated_at
          });
        }
      });

      // Fetch current admin (this will get ALL admins including newly created ones)
      try {
        const currentAdmin = await authAPI.getCurrentAdmin();
        console.log('Current admin response:', currentAdmin);
        
        if (currentAdmin && currentAdmin.admin) {
          const admin = currentAdmin.admin;
          adminMap.set(admin.id, {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            full_name: admin.full_name,
            role: admin.role,
            is_active: admin.is_active,
            last_login: admin.last_login
          });
        }
      } catch (err) {
        console.error('Error fetching current admin:', err);
      }

      users.value = Array.from(adminMap.values());
      console.log('✅ Users loaded:', users.value.length, users.value);
      
    } catch (err) {
      if (err.message.includes('Failed to fetch documents') || 
          err.message.includes('401') || 
          err.message.includes('Unauthorized')) {
        error.value = 'Authentication failed. Please login again.';
        setTimeout(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('access_token');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }, 1500);
      } else {
        error.value = err.message;
      }
      console.error('Error fetching users:', err);
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (userData) => {
    loading.value = true;
    error.value = null;

    try {
      const result = await authAPI.register(userData);
      await fetchUsers();
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const sortBy = (field) => {
    if (sortField.value === field) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortField.value = field;
      sortDirection.value = 'asc';
    }
  };

  return {
    users,
    loading,
    error,
    searchQuery,
    sortField,
    sortDirection,
    currentPage,
    itemsPerPage,
    filteredUsers,
    paginatedUsers,
    totalPages,
    fetchUsers,
    createUser,
    sortBy
  };
}