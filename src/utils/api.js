const API_BASE_URL = 'https://rag-chatbot-be.azurewebsites.net'


export const getAuthToken = () => {
  return localStorage.getItem('authToken') || ''
}


export const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    mode: 'cors'
  })

  // Handle 401 Unauthorized
  if (response.status === 401) {
    throw new Error('UNAUTHORIZED')
  }

  return response
}


export const aiConfigAPI = {
  // Get prompt configuration
  getPromptConfig: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/chatbot/config/prompt`)
    if (!response.ok) throw new Error('Failed to fetch prompt config')
    return response.json()
  },

  // Update prompt configuration
  updatePromptConfig: async (configId, data) => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/chatbot/config/prompt/${configId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data)
      }
    )
    if (!response.ok) throw new Error('Failed to update prompt config')
    return response.json()
  },

  // Get retrieval configuration
  getRetrievalConfig: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/config/`)
    if (!response.ok) throw new Error('Failed to fetch retrieval config')
    return response.json()
  },

  // Update retrieval configuration
  updateRetrievalConfig: async (data) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/config/`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update retrieval config')
    return response.json()
  },

  // Get API token
  getToken: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/token/`)
    if (!response.ok) throw new Error('Failed to fetch token')
    const text = await response.text()
    return text.replace(/"/g, '').trim()
  },

  // Set API token
  setToken: async (value) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/token/`, {
      method: 'POST',
      body: JSON.stringify({ value })
    })
    if (!response.ok) throw new Error('Failed to set token')
    return response.json()
  },

  // Test RAG with message
  testRAG: async (query) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/rag`, {
      method: 'POST',
      body: JSON.stringify({ query })
    })
    if (!response.ok) throw new Error('Failed to get RAG response')
    return response.json()
  }
}