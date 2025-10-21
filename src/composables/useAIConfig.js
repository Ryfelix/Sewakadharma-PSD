import { ref, reactive } from 'vue'
import { aiConfigAPI } from '@/utils/api'

export const useAIConfig = () => {
  const config = reactive({
    apiKey: '',
    primaryPrompt: '',
    topK: 3,
    minSimilarity: 0.4,
    fallbackResponse: ''
  })

  const errors = reactive({
    apiKey: '',
    primaryPrompt: '',
    topK: '',
    minSimilarity: '',
    fallbackResponse: ''
  })

  const currentConfigId = ref(null)
  const isSaving = ref(false)
  const isLoading = ref(true)
  const saveMessage = ref('')
  const saveStatus = ref('')
  const errorDetails = ref('')

  // Load all configurations
  const loadConfig = async () => {
    isLoading.value = true
    saveMessage.value = ''
    saveStatus.value = ''
    errorDetails.value = ''

    try {
      // Load Prompt Config
      try {
        const promptData = await aiConfigAPI.getPromptConfig()
        config.primaryPrompt = promptData.prompt || ''
        config.fallbackResponse = promptData.fallback_response || ''
        currentConfigId.value = promptData.id
      } catch (error) {
        if (error.message === 'UNAUTHORIZED') {
          throw error
        }
        console.warn('Prompt config not accessible, using defaults')
        config.primaryPrompt = 'Kamu adalah chatbot customer service, jawab dengan bahasa formal, singkat, ramah.'
        config.fallbackResponse = 'Mohon maaf, pertanyaan kamu di luar layanan kami.'
      }

      // Load Retrieval Config
      try {
        const retrievalData = await aiConfigAPI.getRetrievalConfig()
        config.topK = retrievalData.top_k || 3
        config.minSimilarity = retrievalData.min_similarity || 0.4
      } catch (error) {
        if (error.message !== 'UNAUTHORIZED') {
          console.warn('Retrieval config not accessible, using defaults')
          config.topK = 3
          config.minSimilarity = 0.4
        }
      }

      // Load API Token (optional)
      try {
        const token = await aiConfigAPI.getToken()
        config.apiKey = token
      } catch (error) {
        console.warn('Token not accessible')
        config.apiKey = ''
      }

      // Set default config ID if not set
      if (!currentConfigId.value) {
        currentConfigId.value = '00000000-0000-0000-0000-000000000000'
      }

    } catch (error) {
      if (error.message === 'UNAUTHORIZED') {
        saveStatus.value = 'error'
        saveMessage.value = 'Please login first to access configuration'
        errorDetails.value = 'Your session may have expired. Please login again.'
      } else {
        console.error('Error loading config:', error)
        saveStatus.value = 'warning'
        saveMessage.value = 'Could not load configuration from server'
        errorDetails.value = 'Using default values. Please check your connection.'
      }

      // Set defaults
      config.primaryPrompt = config.primaryPrompt || 'Kamu adalah chatbot customer service, jawab dengan bahasa formal, singkat, ramah.'
      config.topK = config.topK || 3
      config.minSimilarity = config.minSimilarity || 0.4
      config.fallbackResponse = config.fallbackResponse || 'Mohon maaf, pertanyaan kamu di luar layanan kami.'
    } finally {
      isLoading.value = false
    }
  }

  // Validate configuration
  const validateConfig = () => {
    // Reset errors
    errors.apiKey = ''
    errors.primaryPrompt = ''
    errors.topK = ''
    errors.minSimilarity = ''
    errors.fallbackResponse = ''

    let isValid = true

    if (!config.primaryPrompt.trim()) {
      errors.primaryPrompt = 'Primary Prompt is required'
      isValid = false
    }

    if (!config.topK || config.topK < 1 || config.topK > 10) {
      errors.topK = 'Top K must be between 1 and 10'
      isValid = false
    }

    if (config.minSimilarity < 0 || config.minSimilarity > 1) {
      errors.minSimilarity = 'Min Similarity must be between 0 and 1'
      isValid = false
    }

    if (!config.fallbackResponse.trim()) {
      errors.fallbackResponse = 'Fallback Response is required'
      isValid = false
    }

    return isValid
  }

  // Save configuration
  const saveConfig = async () => {
    if (!validateConfig()) return

    isSaving.value = true
    saveMessage.value = ''
    saveStatus.value = ''
    errorDetails.value = ''

    try {
      // Save API Token (if provided)
      if (config.apiKey.trim()) {
        try {
          await aiConfigAPI.setToken(config.apiKey)
        } catch (error) {
          console.warn('Token save skipped:', error)
        }
      }

      // Save Retrieval Config
      try {
        await aiConfigAPI.updateRetrievalConfig({
          top_k: parseInt(config.topK),
          min_similarity: parseFloat(config.minSimilarity)
        })
      } catch (error) {
        console.warn('Retrieval config save failed:', error)
      }

      // Save Prompt Config
      await aiConfigAPI.updatePromptConfig(currentConfigId.value, {
        prompt: config.primaryPrompt,
        fallback_response: config.fallbackResponse
      })

      saveStatus.value = 'success'
      saveMessage.value = 'Configuration saved successfully!'

      setTimeout(() => {
        saveMessage.value = ''
        saveStatus.value = ''
      }, 3000)

    } catch (error) {
      console.error('Save failed:', error)
      saveStatus.value = 'error'
      
      if (error.message === 'UNAUTHORIZED') {
        saveMessage.value = 'Please login to save configuration'
        errorDetails.value = 'Your session may have expired.'
      } else {
        saveMessage.value = 'Failed to save configuration'
        errorDetails.value = error.message
      }
    } finally {
      isSaving.value = false
    }
  }

  // Reset configuration
  const resetConfig = () => {
    if (confirm('Are you sure you want to reset? This will reload the last saved configuration.')) {
      loadConfig()
      Object.keys(errors).forEach(key => errors[key] = '')
    }
  }

  return {
    config,
    errors,
    currentConfigId,
    isSaving,
    isLoading,
    saveMessage,
    saveStatus,
    errorDetails,
    loadConfig,
    saveConfig,
    resetConfig,
    validateConfig
  }
}