const API_BASE_URL = 'https://chat-layanan-publik.azurewebsites.net';

// Helper untuk get token dari localStorage
const getAuthToken = () => {
  // Support multiple token key formats
  return localStorage.getItem('auth_token') || 
         localStorage.getItem('authToken') || 
         localStorage.getItem('access_token') || 
         localStorage.getItem('token');
};

// Helper untuk headers dengan auth
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Auth APIs
export const authAPI = {
  // Login
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    const data = await response.json();
    console.log(data)
    // Response structure from API:
    // {
    //   "admin": { ... },
    //   "token": "eyJhbGc..."
    // }
    
    if (data.access_token) {
      // Save token with multiple keys for compatibility
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('authToken', data.access_token);
      console.log('✅ Token saved successfully');
    } else {
      throw new Error('No token received from server');
    }
    
    // Save admin info if needed
    if (data.admin) {
      localStorage.setItem('admin_info', JSON.stringify(data.admin));
    }
    
    return data;
  },

  // Register (Create new admin/user)
  async register(userData) {
    const { username, email, password, full_name, role = 'admin' } = userData;
    const response = await fetch(
      `${API_BASE_URL}/auth/register?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&full_name=${encodeURIComponent(full_name || '')}&role=${role}`,
      {
        method: 'POST',
        headers: getHeaders()
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }
    
    return await response.json();
  },

  // Get current admin info
  async getCurrentAdmin() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch current admin');
    }
    
    return await response.json();
  },

  // Logout
  logout() {
    localStorage.removeItem('auth_token');
  }
};

// Document APIs (untuk mendapatkan list admin yang pernah update dokumen)
export const documentAPI = {
  async getAllDocuments() {
    const response = await fetch(`${API_BASE_URL}/document`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    
    return await response.json();
  }
};

// Export default
export default {
  authAPI,
  documentAPI
};