<script setup lang="ts">
import { computed } from 'vue';
// Import types if you want strict typing
// import type { PaymentStepDto } from '@/scripts/type/payment/PaymentFlowDto';

const props = defineProps<{
  step: any // Replace 'any' with PaymentStepDto for strict typing
}>();

const emit = defineEmits(['openDrawer']);

// --- Visual Helpers ---
const getDotClass = (state: string) => {
  if (['SUCCESS', 'PAYMENT_COMPLETE_SUCCESS'].includes(state)) return 'bg-green-500 border-green-500';
  if (['FAILED', 'PAYMENT_COMPLETE_FAILED'].includes(state)) return 'bg-red-600 border-red-600';
  if (state === 'RECEIVED') return 'bg-blue-500 border-blue-500';
  return 'bg-gray-400 border-gray-400 dark:bg-gray-600 dark:border-gray-600';
};

const getStateColor = (state: string) => {
  if (['SUCCESS', 'PAYMENT_COMPLETE_SUCCESS'].includes(state)) return 'text-green-600 dark:text-green-400';
  if (['FAILED', 'PAYMENT_COMPLETE_FAILED'].includes(state)) return 'text-red-600 dark:text-red-400';
  return 'text-gray-500 dark:text-gray-400';
};

const formatTime = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit' }) + '.' + d.getMilliseconds();
};

const headerCount = computed(() => props.step.headerDelta ? Object.keys(props.step.headerDelta).length : 0);
const paramCount = computed(() => props.step.parameters ? Object.keys(props.step.parameters).length : 0);
</script>

<template>
  <div class="flex gap-x-4 group">
    
    <div class="w-24 text-end pt-0.5 flex flex-col items-end">
      <span v-if="step.timestamp" class="text-xs text-gray-500 font-mono leading-none">
        {{ formatTime(step.timestamp) }}
      </span>
      <span v-else class="h-4"></span>
    </div>

    <div class="relative last:after:hidden after:absolute after:top-2 after:bottom-0 after:start-[6px] after:w-px after:bg-gray-200 dark:after:bg-gray-700">
      <div class="relative z-10 flex justify-center items-center">
        <div class="w-3 h-3 rounded-full border-2 box-border ring-2 ring-white dark:ring-gray-900" 
             :class="getDotClass(step.state)"
             :title="step.state">
        </div>
      </div>
    </div>

    <div class="grow pb-8 pt-0.5">
      
      <div class="flex flex-col gap-1 mb-2">
        <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">
          {{ step.stepName }}
        </h3>
        
        <div v-if="step.state" class="font-mono text-[10px] uppercase tracking-wider flex items-center gap-2">
          <span :class="getStateColor(step.state)" class="font-bold">{{ step.state }}</span>
          <span v-if="step.outcome" class="flex items-center gap-2 text-gray-500">
            <span class="w-px h-3 bg-gray-300 dark:bg-gray-600"></span>
            <span class="text-gray-500 dark:text-gray-400">{{ step.outcome }}</span>
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-x-2 gap-y-2 text-xs">
        
        <button v-if="step.payload?.length" 
          @click="emit('openDrawer', step, 'Payload')"
          class="group flex items-center gap-x-1.5 px-2 py-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span class="icon-[material-symbols--data-object-outline] text-blue-500"></span>
          <span>{{ step.payload.length }} Payloads</span>
        </button>

        <button v-if="headerCount > 0"
          @click="emit('openDrawer', step, 'Headers')"
          class="group flex items-center gap-x-1.5 px-2 py-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span class="icon-[material-symbols--label-outline] text-purple-500"></span>
          <span>+{{ headerCount }} Headers</span>
        </button>

        <button v-if="paramCount > 0"
          @click="emit('openDrawer', step, 'Parameters')"
          class="group flex items-center gap-x-1.5 px-2 py-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span class="icon-[material-symbols--tune] text-amber-500"></span>
          <span>{{ paramCount }} Params</span>
        </button>

      </div>

      <div v-if="step.error" class="mt-3">
        <div class="inline-block px-3 py-2 bg-red-50 dark:bg-red-900/20 border-l-2 border-red-600 text-xs text-red-800 dark:text-red-200 font-mono rounded-r-sm">
          <span class="font-bold text-red-600 dark:text-red-400 block mb-1">Error:</span>
          {{ step.error.message }}
        </div>
      </div>

    </div>
  </div>
</template>
