<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
    <div class="p-6 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800">Preview</h3>
      <p class="text-sm text-gray-600 mt-1">Test AI configuration</p>
    </div>
    
    <!-- Chat Messages Area -->
    <div class="flex-1 p-6 space-y-4 max-h-[600px] overflow-y-auto" ref="chatContainer">
      <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">
        <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-sm">Mulai chat untuk menguji AI</p>
        <p class="text-xs text-gray-400 mt-1">Kirim pesan untuk melihat respons chatbot</p>
      </div>
      
      <div v-for="message in messages" :key="message.id" class="flex" :class="{
        'justify-end': message.sender === 'user',
        'justify-start': message.sender === 'bot'
      }">
        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg" :class="{
          'bg-[#FCBA40] text-white': message.sender === 'user',
          'bg-gray-100 text-gray-800': message.sender === 'bot'
        }">
          <div v-if="message.sender === 'user'" class="text-sm">{{ message.text }}</div>
          <div v-else class="text-sm formatted-message" v-html="formatBotMessage(message.text)"></div>
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
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { aiConfigAPI } from '@/utils/api'

const props = defineProps({
  fallbackResponse: {
    type: String,
    default: ''
  }
})

const messages = ref([])
const newMessage = ref('')
const isTyping = ref(false)
const chatContainer = ref(null)

const sendMessage = async () => {
  if (!newMessage.value.trim() || isTyping.value) return
  
  const userMessage = {
    id: Date.now(),
    text: newMessage.value.trim(),
    sender: 'user',
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  const messageText = newMessage.value.trim()
  newMessage.value = ''
  
  await nextTick()
  scrollToBottom()
  
  isTyping.value = true
  
  try {
    const data = await aiConfigAPI.testRAG(messageText)
    
    messages.value.push({
      id: Date.now() + 1,
      text: data.answer || props.fallbackResponse || 'Sorry, no response available.',
      sender: 'bot',
      timestamp: new Date(),
      sources: data.sources
    })
    
  } catch (error) {
    console.error('Error sending message:', error)
    messages.value.push({
      id: Date.now() + 1,
      text: error.message === 'UNAUTHORIZED'
        ? 'Please login to use the chat feature.'
        : 'Sorry, there was an error processing your message.',
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

// Format bot message to support lists and formatting
const formatBotMessage = (text) => {
  if (!text) return ''
  
  let formatted = text
  
  // Escape HTML first
  formatted = formatted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // Convert bold text **text** to <strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Split by double newlines to preserve paragraph structure
  const sections = formatted.split(/\n\n+/)
  
  formatted = sections.map(section => {
    // Check if section contains numbered list pattern
    if (/^\d+\.\s+\*\*.*?\*\*:/.test(section)) {
      // This is a numbered list with bold headers
      const items = section.split(/\n(?=\d+\.\s)/)
      const listItems = items.map(item => {
        const match = item.match(/^(\d+)\.\s+(.+)/)
        if (match) {
          const content = match[2].trim()
          return `<li value="${match[1]}">${content}</li>`
        }
        return item
      }).join('')
      return `<ol class="list-decimal list-outside ml-5 space-y-2 my-2">${listItems}</ol>`
    }
    
    // Check if section is a simple list of items with dashes
    if (/^-\s/.test(section)) {
      const items = section.split('\n')
      const listItems = items.map(item => {
        if (item.trim().startsWith('-')) {
          const content = item.replace(/^-\s*/, '').trim()
          return `<li>${content}</li>`
        }
        return item
      }).join('')
      return `<ul class="list-disc list-outside ml-5 space-y-1 my-2">${listItems}</ul>`
    }
    
    // Regular paragraph
    return `<p class="mb-2">${section.trim()}</p>`
  }).join('')
  
  // Convert single line breaks to <br> (but not inside lists)
  formatted = formatted.replace(/\n(?![^<]*<\/li>)/g, '<br>')
  
  return formatted
}
</script>

<style scoped>
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

/* Formatted message styles */
.formatted-message {
  line-height: 1.6;
}

.formatted-message ol,
.formatted-message ul {
  margin: 0.5rem 0;
  padding-left: 1.25rem;
}

.formatted-message li {
  margin: 0.25rem 0;
}

.formatted-message p {
  margin: 0;
}

.formatted-message p:not(:last-child) {
  margin-bottom: 0.5rem;
}

.formatted-message strong {
  font-weight: 600;
}
</style>