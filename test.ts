<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import type { PaymentStepDto } from '@/scripts/type/payment/PaymentFlowDto';

const props = defineProps<{
  isOpen: boolean,
  step?: PaymentStepDto,
  initialTab?: string
}>();

const emit = defineEmits(['close']);
const currentTab = ref('Payload');

// Sync tab when prop changes
watch(() => props.initialTab, (newTab) => {
  if (newTab) currentTab.value = newTab;
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex justify-end">
    <div class="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-[1px]" @click="emit('close')"></div>

    <div class="relative w-[700px] h-full flex flex-col shadow-2xl bg-white dark:bg-[#1e1e1e] border-l border-gray-200 dark:border-[#404040]">
      
      <div class="px-6 py-5 border-b border-gray-200 dark:border-[#404040] bg-gray-50 dark:bg-[#2d2d2d] flex justify-between items-start">
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ step?.stepName }}</h2>
          <div class="text-xs text-gray-500 font-mono mt-1">ID: {{ step?.serviceName }}</div>
        </div>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1">✕</button>
      </div>

      <div class="flex border-b border-gray-200 dark:border-[#404040] bg-white dark:bg-[#1e1e1e] px-6 pt-1 overflow-x-auto">
        <button 
          v-for="tab in ['Payload', 'Headers', 'Parameters', 'Metadata']" :key="tab"
          @click="currentTab = tab"
          class="pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors outline-none focus:outline-none whitespace-nowrap"
          :class="currentTab === tab 
            ? 'border-red-600 text-red-600 dark:text-red-500 dark:border-red-500' 
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'">
          {{ tab }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-0 bg-white dark:bg-[#121212]">
        
        <div v-if="currentTab === 'Payload'" class="p-6 space-y-8">
          <div v-if="step?.payload?.length">
            <div v-for="(p, idx) in step.payload" :key="idx">
              <div class="flex justify-between items-center mb-2 pl-2 border-l-2 border-blue-500">
                <span class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">{{ p.label }}</span>
                <span class="text-[10px] text-gray-500 bg-gray-100 dark:bg-[#2d2d2d] px-2 py-0.5 rounded">{{ p.size }} bytes</span>
              </div>
              <div class="bg-gray-50 dark:bg-[#111] p-4 border border-gray-200 dark:border-[#404040] text-xs font-mono text-gray-700 dark:text-gray-300 overflow-x-auto">
                <pre v-if="p.data"><code>{{ JSON.stringify(p.data, null, 2) }}</code></pre>
                <div v-else class="text-gray-500 italic">// Metadata only</div>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center h-64 text-gray-400"><span>No Payloads</span></div>
        </div>

        <div v-if="currentTab === 'Headers'" class="p-6">
          <div v-if="step?.headerDelta">
             <div class="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wider">Header Delta</div>
             <div class="bg-gray-50 dark:bg-[#111] p-4 border border-gray-200 dark:border-[#404040] text-xs font-mono text-gray-700 dark:text-gray-300 overflow-x-auto">
               <pre><code>{{ JSON.stringify(step.headerDelta, null, 2) }}</code></pre>
             </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center h-64 text-gray-400"><span>No Header Changes</span></div>
        </div>

        <div v-if="currentTab === 'Parameters'" class="p-6">
          <div v-if="step?.parameters && Object.keys(step.parameters).length > 0">
             <div class="grid grid-cols-1 gap-px bg-gray-200 dark:bg-[#404040] border border-gray-200 dark:border-[#404040]">
                <div v-for="(val, key) in step.parameters" :key="key" class="grid grid-cols-3 bg-white dark:bg-[#1a1a1a]">
                   <div class="col-span-1 p-3 text-gray-500 text-xs font-bold border-r border-gray-200 dark:border-[#404040] flex items-center bg-gray-50 dark:bg-[#202020]">{{ key }}</div>
                   <div class="col-span-2 p-3 text-gray-700 dark:text-gray-300 text-xs font-mono break-all">{{ val }}</div>
                </div>
             </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center h-64 text-gray-400"><span>No Parameters</span></div>
        </div>

        <div v-if="currentTab === 'Metadata'" class="p-6">
          <table class="w-full text-left text-xs border-collapse">
            <tbody>
              <tr class="border-b border-gray-200 dark:border-[#404040]"><td class="py-3 text-gray-500 font-bold uppercase w-32">Status</td><td class="py-3 font-mono text-gray-900 dark:text-white">{{ step?.state }}</td></tr>
              <tr class="border-b border-gray-200 dark:border-[#404040]"><td class="py-3 text-gray-500 font-bold uppercase">Outcome</td><td class="py-3 font-mono text-gray-900 dark:text-white">{{ step?.outcome || '-' }}</td></tr>
              <tr class="border-b border-gray-200 dark:border-[#404040]"><td class="py-3 text-gray-500 font-bold uppercase align-top pt-3">Sequence</td><td class="py-3 font-mono text-gray-500 dark:text-gray-400 break-all leading-relaxed">{{ step?.serviceName }}</td></tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>
