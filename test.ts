<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  step: any;
  initialTab?: string;
}>();

const emit = defineEmits(['close']);
const currentTab = ref('Payload');

// When drawer opens, sync tab
watch(() => props.isOpen, (val) => {
  if (val && props.initialTab) currentTab.value = props.initialTab;
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex justify-end">
    <div class="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-[1px]" @click="emit('close')"></div>

    <div class="relative w-[700px] h-full flex flex-col shadow-2xl transition-transform transform bg-white dark:bg-[#1e1e1e] border-l border-gray-200 dark:border-gray-700">
      
      <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] flex justify-between items-start">
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ step?.stepName }}</h2>
          <div class="text-xs text-gray-500 font-mono mt-1">ID: {{ step?.serviceName }}</div>
        </div>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded">✕</button>
      </div>

      <div class="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] px-6 pt-1">
        <button 
          v-for="tab in ['Payload', 'Headers', 'Parameters', 'Metadata']" :key="tab"
          @click="currentTab = tab"
          class="pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors outline-none"
          :class="currentTab === tab 
            ? 'border-red-600 text-red-600 dark:text-[#db0011] dark:border-[#db0011]' 
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'">
          {{ tab }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-0 bg-white dark:bg-[#1e1e1e]">
        
        <div v-if="currentTab === 'Payload'" class="p-6 space-y-8">
          <div v-if="step?.payload?.length">
            <div v-for="(p, idx) in step.payload" :key="idx">
              <div class="flex justify-between items-center mb-2 pl-2 border-l-2 border-blue-500">
                <span class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">{{ p.label }}</span>
                <span class="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{{ p.size }} bytes</span>
              </div>
              <div class="bg-gray-50 dark:bg-[#111] p-4 border border-gray-200 dark:border-gray-700 text-xs font-mono text-gray-700 dark:text-gray-300 overflow-x-auto">
                <pre v-if="p.data"><code>{{ JSON.stringify(p.data, null, 2) }}</code></pre>
                <div v-else class="text-gray-500 italic">// Metadata only</div>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center h-64 text-gray-400"><span>No Payloads</span></div>
        </div>

        </div>
    </div>
  </div>
</template>
