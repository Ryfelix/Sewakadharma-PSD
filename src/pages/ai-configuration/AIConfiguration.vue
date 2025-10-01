<template>
  <div class="ai-configuration-page space-y-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center h-96">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-[#FCBA40] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Loading configuration...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Configuration Form -->
      <div class="space-y-6">
        <!-- API Key Section -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">API Key</h3>
          <div class="relative">
            <input
              v-model="config.apiKey"
              type="text"
              placeholder="Enter your API key"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FCBA40] focus:border-transparent outline-none bg-gray-50"
              :class="{ 'border-red-500': errors.apiKey }"
            />
            <div v-if="errors.apiKey" class="text-red-500 text-sm mt-1">{{ errors.apiKey }}</div>
          </div>
        </div>
        
        <!-- Primary Prompt Section -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Primary Prompt</h3>
          <textarea
            v-model="config.primaryPrompt"
            placeholder="Kamu adalah chatbot customer service perusahaan Boleh Dicoba Digital, jawab dengan bahasa formal, singkat, ramah."
            rows="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FCBA40] focus:border-transparent outline-none resize-none"
            :class="{ 'border-red-500': errors.primaryPrompt }"
          ></textarea>
          <div v-if="errors.primaryPrompt" class="text-red-500 text-sm mt-1">{{ errors.primaryPrompt }}</div>
          <div class="text-sm text-gray-500 mt-2">
            Instruksi utama yang akan menentukan perilaku chatbot
          </div>
        </div>

        <!-- Fallback Response Section -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Fallback Response</h3>
          <textarea
            v-model="config.fallbackResponse"
            placeholder="Mohon maaf, pertanyaan kamu di luar layanan kami. Apakah ingin terhubung ke tim support?"
            rows="4"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FCBA40] focus:border-transparent outline-none resize-none"
            :class="{ 'border-red-500': errors.fallbackResponse }"
          ></textarea>
          <div v-if="errors.fallbackResponse" class="text-red-500 text-sm mt-1">{{ errors.fallbackResponse }}</div>
          <div class="text-sm text-gray-500 mt-2">
            Respons yang akan ditampilkan jika chatbot tidak dapat menjawab pertanyaan
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-4">
          <button
            @click="resetConfig"
            type="button"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex-1"
          >
            Reset
          </button>
          <button
            @click="saveConfig"
            :disabled="isSaving"
            type="button"
            class="px-6 py-3 bg-[#FC5649] text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex-1 disabled:opacity-50"
          >
            <span v-if="!isSaving">Save</span>
            <div v-else class="flex items-center justify-center space-x-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          </button>
        </div>

        <!-- Save Status Message -->
        <div v-if="saveMessage" class="p-4 rounded-lg" :class="{
          'bg-green-50 border border-green-200 text-green-700': saveStatus === 'success',
          'bg-red-50 border border-red-200 text-red-700': saveStatus === 'error'
        }">
          {{ saveMessage }}
        </div>
      </div>

      <!-- Preview Section -->
      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">Preview</h3>
            <p class="text-sm text-gray-600 mt-1">Test AI configuration</p>
          </div>
          
          <!-- Chat Messages Area -->
          <div class="flex-1 p-6 space-y-4 max-h-96 overflow-y-auto" ref="chatContainer">
            <div v-if="chatMessages.length === 0" class="text-center text-gray-500 py-8">
              <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p class="text-sm">Mulai chat untuk menguji AI</p>
              <p class="text-xs text-gray-400 mt-1">Kirim pesan untuk melihat respons chatbot</p>
            </div>
            
            <div v-for="message in chatMessages" :key="message.id" class="flex" :class="{
              'justify-end': message.sender === 'user',
              'justify-start': message.sender === 'bot'
            }">
              <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg" :class="{
                'bg-[#FCBA40] text-white': message.sender === 'user',
                'bg-gray-100 text-gray-800': message.sender === 'bot'
              }">
                <p class="text-sm">{{ message.text }}</p>
                <p class="text-xs opacity-75 mt-1">{{ formatTime(message.timestamp) }}</p>
              </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="isTyping" class="flex justify-start">
              <div class="bg-gray-100 px-4 py-2 rounded-lg max-w-xs">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Chat Input -->
          <div class="p-6 border-t border-gray-200">
            <div class="flex space-x-3">
              <input
                v-model="newMessage"
                @keypress.enter="sendMessage"
                :disabled="isTyping"
                type="text"
                placeholder="Ask anything"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FCBA40] focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                @click="sendMessage"
                :disabled="!newMessage.trim() || isTyping"
                class="px-4 py-2 bg-[#FC5649] text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

// API Configuration
const API_BASE_URL = 'https://rag-chatbot-be.azurewebsites.net'

// State Management
const config = reactive({
  apiKey: '',
  primaryPrompt: '',
  fallbackResponse: ''
})

const errors = reactive({
  apiKey: '',
  primaryPrompt: '',
  fallbackResponse: ''
})

const currentConfigId = ref(null)
const isSaving = ref(false)
const isLoading = ref(true)
const saveMessage = ref('')
const saveStatus = ref('')

// Chat State
const chatMessages = ref([])
const newMessage = ref('')
const isTyping = ref(false)
const chatContainer = ref(null)

// Load configuration on mount
onMounted(() => {
  loadConfig()
})

// API Functions
const loadConfig = async () => {
  isLoading.value = true
  try {
    // Load API Key
    const tokenResponse = await fetch(`${API_BASE_URL}/token/`)
    const tokenData = await tokenResponse.text()
    
    // Load Chatbot Config
    const configResponse = await fetch(`${API_BASE_URL}/chatbot/config`)
    const configData = await configResponse.json()
    
    config.apiKey = tokenData.replace(/"/g, '') || ''
    config.primaryPrompt = configData.prompt || ''
    config.fallbackResponse = configData.fallback_response || ''
    
    currentConfigId.value = configData.id
    
  } catch (error) {
    console.error('Error loading config:', error)
    saveStatus.value = 'error'
    saveMessage.value = 'Failed to load configuration'
  } finally {
    isLoading.value = false
  }
}

const validateConfig = () => {
  // Reset errors
  errors.apiKey = ''
  errors.primaryPrompt = ''
  errors.fallbackResponse = ''
  
  let isValid = true
  
  if (!config.apiKey.trim()) {
    errors.apiKey = 'API Key is required'
    isValid = false
  }
  
  if (!config.primaryPrompt.trim()) {
    errors.primaryPrompt = 'Primary Prompt is required'
    isValid = false
  }
  
  if (!config.fallbackResponse.trim()) {
    errors.fallbackResponse = 'Fallback Response is required'
    isValid = false
  }
  
  return isValid
}

const saveConfig = async () => {
  if (!validateConfig()) return
  
  isSaving.value = true
  saveMessage.value = ''
  saveStatus.value = ''
  
  try {
    // Save API Key
    await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: config.apiKey })
    })
    
    // Save Chatbot Config
    const configPayload = {
      prompt: config.primaryPrompt,
      fallback_response: config.fallbackResponse
    }
    
    const configResponse = await fetch(
      `${API_BASE_URL}/chatbot/config/${currentConfigId.value}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configPayload)
      }
    )
    
    if (!configResponse.ok) {
      throw new Error('Failed to save config')
    }
    
    saveStatus.value = 'success'
    saveMessage.value = 'Configuration saved successfully!'
    
    setTimeout(() => {
      saveMessage.value = ''
      saveStatus.value = ''
    }, 3000)
    
  } catch (error) {
    console.error('Save failed:', error)
    saveStatus.value = 'error'
    saveMessage.value = 'Failed to save configuration. Please try again.'
  } finally {
    isSaving.value = false
  }
}

const resetConfig = () => {
  if (confirm('Are you sure you want to reset? This will reload the last saved configuration.')) {
    loadConfig()
    saveMessage.value = ''
    saveStatus.value = ''
    errors.apiKey = ''
    errors.primaryPrompt = ''
    errors.fallbackResponse = ''
  }
}

// Chat Functions
const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  
  const userMessage = {
    id: Date.now(),
    text: newMessage.value.trim(),
    sender: 'user',
    timestamp: new Date()
  }
  
  chatMessages.value.push(userMessage)
  newMessage.value = ''
  
  await nextTick()
  scrollToBottom()
  
  isTyping.value = true
  
  try {
    const response = await fetch(`${API_BASE_URL}/rag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: userMessage.text,
        k: 3,
        min_similarity: 0.4
      })
    })
    
    const data = await response.json()
    
    chatMessages.value.push({
      id: Date.now(),
      text: data.answer || config.fallbackResponse,
      sender: 'bot',
      timestamp: new Date(),
      sources: data.sources
    })
    
  } catch (error) {
    console.error('Error sending message:', error)
    chatMessages.value.push({
      id: Date.now(),
      text: 'Sorry, there was an error processing your message.',
      sender: 'bot',
      timestamp: new Date()
    })
  } finally {
    isTyping.value = false
    await nextTick()
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const formatTime = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style scoped>
.ai-configuration-page {
  font-family: 'Poppins', sans-serif;
}

/* Custom scrollbar for chat */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Animation for typing indicator */
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 1.4s ease-in-out infinite;
}
</style>