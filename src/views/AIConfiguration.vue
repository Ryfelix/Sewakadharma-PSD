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
        <ApiKeySection
          v-model="config.apiKey"
          :error="errors.apiKey"
        />
        
        <!-- Primary Prompt Section -->
        <PrimaryPromptSection
          v-model="config.primaryPrompt"
          :error="errors.primaryPrompt"
        />

        <!-- Retrieval Configuration Section -->
        <RetrievalConfigSection
          v-model:top-k="config.topK"
          v-model:min-similarity="config.minSimilarity"
          :top-k-error="errors.topK"
          :min-similarity-error="errors.minSimilarity"
        />

        <!-- Fallback Response Section -->
        <FallbackResponseSection
          v-model="config.fallbackResponse"
          :error="errors.fallbackResponse"
        />

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
          'bg-red-50 border border-red-200 text-red-700': saveStatus === 'error',
          'bg-yellow-50 border border-yellow-200 text-yellow-700': saveStatus === 'warning'
        }">
          <div class="font-medium mb-1">{{ saveMessage }}</div>
          <div v-if="saveStatus === 'error' && errorDetails" class="text-sm mt-2">
            {{ errorDetails }}
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="space-y-6">
        <ChatPreview :fallback-response="config.fallbackResponse" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAIConfig } from '@/composables/useAIConfig'
import ApiKeySection from '@/components/ai-config/ApiKeySection.vue'
import PrimaryPromptSection from '@/components/ai-config/PrimaryPromptSection.vue'
import RetrievalConfigSection from '@/components/ai-config/RetrievalConfigSection.vue'
import FallbackResponseSection from '@/components/ai-config/FallbackResponseSection.vue'
import ChatPreview from '@/components/ai-config/ChatPreview.vue'

const {
  config,
  errors,
  isSaving,
  isLoading,
  saveMessage,
  saveStatus,
  errorDetails,
  loadConfig,
  saveConfig,
  resetConfig
} = useAIConfig()

onMounted(() => {
  loadConfig()
})
</script>

<style scoped>
.ai-configuration-page {
  font-family: 'Poppins', sans-serif;
}
</style>