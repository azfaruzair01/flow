<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { PaymentStepDto } from '@/scripts/type/payment/PaymentFlowDto';

const props = defineProps<{
  step: PaymentStepDto
}>();

const emit = defineEmits(['openDrawer']);

// --- FORMATTERS ---
const formatTime = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + d.getMilliseconds();
};

const getHeaderCount = (step: PaymentStepDto) => step.headerDelta ? Object.keys(step.headerDelta).length : 0;

// --- COLOR LOGIC (V20 Buckets) ---
const successStates = ['SUCCESS', 'PAYMENT_COMPLETE_SUCCESS'];
const failStates = ['FAILED', 'PAYMENT_COMPLETE_FAILED', 'CALL_FAILED', 'CALL_WATCHDOG_FAILED'];
const warnStates = ['DEADLINE_PASSED', 'MAN_WAKEUP'];

const getDotClass = (state: string) => {
  if (successStates.includes(state)) return 'bg-green-500 border-green-500';
  if (failStates.includes(state)) return 'bg-hsbc-red border-hsbc-red'; // Ensure 'hsbc-red' is in tailwind config
  if (warnStates.includes(state)) return 'bg-amber-500 border-amber-500';
  return 'bg-gray-400 border-gray-400 dark:bg-gray-600 dark:border-gray-600'; // Default Grey
};

const getStateColor = (state: string) => {
  if (successStates.includes(state)) return 'text-green-600 dark:text-green-400';
  if (failStates.includes(state)) return 'text-hsbc-red dark:text-red-400';
  if (warnStates.includes(state)) return 'text-amber-600 dark:text-amber-400';
  return 'text-gray-500 dark:text-gray-400';
};
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
        <div class="w-3 h-3 rounded-full border-2 box-border cursor-help" 
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
          <span :class="getStateColor(step.state)" class="font-bold">
            {{ step.state }}
          </span>
          <span v-if="step.outcome" class="flex items-center gap-2 text-gray-500">
            <span class="w-px h-3 bg-gray-300 dark:bg-gray-600"></span>
            <span class="text-gray-500 dark:text-gray-400">{{ step.outcome }}</span>
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-x-2 gap-y-2 text-xs">
        
        <button v-if="step.payload && step.payload.length" 
          @click="emit('openDrawer', step, 'Payload')"
          class="group flex items-center gap-x-1.5 px-2 py-1 rounded-md border border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 hover:shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
          <span class="icon-[material-symbols--data-object-outline] opacity-70 group-hover:opacity-100"></span>
          <span>{{ step.payload.length }} Payloads</span>
        </button>

        <button v-if="getHeaderCount(step) > 0"
          @click="emit('openDrawer', step, 'Headers')"
          class="group flex items-center gap-x-1.5 px-2 py-1 rounded-md border border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 hover:shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
          <span class="icon-[material-symbols--label-outline] opacity-70 group-hover:opacity-100"></span>
          <span>+{{ getHeaderCount(step) }} Headers</span>
        </button>

        <button v-if="step.parameters && Object.keys(step.parameters).length > 0"
          @click="emit('openDrawer', step, 'Parameters')"
          class="group flex items-center gap-x-1.5 px-2 py-1 rounded-md border border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 hover:shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200">
          <span class="icon-[material-symbols--tune] opacity-70 group-hover:opacity-100"></span>
          <span>{{ Object.keys(step.parameters).length }} Params</span>
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
