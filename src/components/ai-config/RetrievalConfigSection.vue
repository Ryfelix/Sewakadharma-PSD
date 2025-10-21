<template>
  <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Retrieval Configuration</h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Top K</label>
        <input
          :value="topK"
          @input="$emit('update:topK', parseInt($event.target.value) || '')"
          type="number"
          min="1"
          max="10"
          placeholder="3"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FCBA40] focus:border-transparent outline-none bg-gray-50"
          :class="{ 'border-red-500': topKError }"
        />
        <div v-if="topKError" class="text-red-500 text-sm mt-1">{{ topKError }}</div>
        <div class="text-sm text-gray-500 mt-1">
          Jumlah dokumen relevan yang akan diambil (1-10)
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Min Similarity</label>
        <input
          :value="minSimilarity"
          @input="$emit('update:minSimilarity', parseFloat($event.target.value) || '')"
          type="number"
          step="0.1"
          min="0"
          max="1"
          placeholder="0.4"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FCBA40] focus:border-transparent outline-none bg-gray-50"
          :class="{ 'border-red-500': minSimilarityError }"
        />
        <div v-if="minSimilarityError" class="text-red-500 text-sm mt-1">{{ minSimilarityError }}</div>
        <div class="text-sm text-gray-500 mt-1">
          Minimal kesamaan dokumen (0.0 - 1.0)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  topK: {
    type: Number,
    default: 3
  },
  minSimilarity: {
    type: Number,
    default: 0.4
  },
  topKError: {
    type: String,
    default: ''
  },
  minSimilarityError: {
    type: String,
    default: ''
  }
})

defineEmits(['update:topK', 'update:minSimilarity'])
</script>