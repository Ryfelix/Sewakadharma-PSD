// authUtils.js - Authentication utilities for Vue.js
const API_BASE_URL = 'https://rag-chatbot-be.azurewebsites.net'

export const authUtils = {
  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('auth_token')
  },
  
  // Get user data from localStorage
  getUserData() {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAuthToken()
  },
  
  // Get auth headers for API calls
  getAuthHeaders() {
    const token = this.getAuthToken()
    const headers = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  },
  
  // Logout function
  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    // Redirect to login if using router
    if (window.$router) {
      window.$router.push('/login')
    } else {
      window.location.href = '/login'
    }
  },
  
  // Enhanced API call function with authentication
  async apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    // Set auth headers
    const headers = options.body instanceof FormData 
      ? { 'Authorization': `Bearer ${this.getAuthToken()}` } // Don't set Content-Type for FormData
      : { ...this.getAuthHeaders(), ...options.headers }

    const config = {
      method: 'GET',
      ...options,
      headers
    }

    try {
      console.log(`API Call: ${config.method} ${url}`)
      const response = await fetch(url, config)
      
      console.log(`Response: ${response.status} ${response.statusText}`)
      
      if (response.status === 401) {
        // Unauthorized - token expired or invalid
        console.error('Unauthorized access - logging out')
        this.logout()
        throw new Error('Session expired. Please login again.')
      }
      
      if (response.status === 403) {
        // Forbidden - insufficient permissions
        console.error('Access forbidden - insufficient permissions')
        throw new Error('Access denied. You don\'t have permission to perform this action.')
      }
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.detail || errorMessage
        } catch (e) {
          errorMessage = `${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }
      
      return response
      
    } catch (error) {
      console.error('API call failed:', error)
      throw error
    }
  },
  
  // Test authentication
  async testAuth() {
    try {
      console.log('Testing authentication...')
      console.log('Token:', this.getAuthToken())
      console.log('User:', this.getUserData())
      console.log('Is authenticated:', this.isAuthenticated())
      
      const response = await this.apiCall('/document/tags')
      const data = await response.json()
      console.log('✅ Auth test successful!', data)
      return { success: true, data }
    } catch (error) {
      console.error('❌ Auth test failed:', error)
      return { success: false, error: error.message }
    }
  }
}

// Vue 3 Composable for authentication
export function useAuth() {
  const token = ref(authUtils.getAuthToken())
  const user = ref(authUtils.getUserData())
  
  const isAuthenticated = computed(() => authUtils.isAuthenticated())
  
  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || 'Login failed')
      }

      const tokenData = await response.text()
      const cleanToken = tokenData.replace(/"/g, '')
      
      // Get user info
      const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json',
        }
      })

      let userData = { username, role: 'admin' }
      if (userResponse.ok) {
        const userInfo = await userResponse.text()
        try {
          userData = JSON.parse(userInfo)
        } catch {
          userData = { username, role: 'admin' }
        }
      }

      // Save to localStorage
      localStorage.setItem('auth_token', cleanToken)
      localStorage.setItem('user_data', JSON.stringify(userData))
      
      token.value = cleanToken
      user.value = userData
      
      return { success: true, token: cleanToken, user: userData }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  const logout = () => {
    authUtils.logout()
    token.value = null
    user.value = null
  }
  
  return {
    token: readonly(token),
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
    apiCall: authUtils.apiCall.bind(authUtils)
  }
}

// Export for global use
export default authUtils