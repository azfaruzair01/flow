<script setup lang="ts">
import { computed } from 'vue';
import type { PaymentStepDto } from '@/scripts/type/payment/PaymentFlowDto';

const props = defineProps<{ step: PaymentStepDto }>();
const emit = defineEmits(['openDrawer']);

// Helper to determine dot color
const getDotClass = (state: string) => {
  if (['SUCCESS', 'PAYMENT_COMPLETE_SUCCESS'].includes(state)) return 'bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
  if (['FAILED', 'PAYMENT_COMPLETE_FAILED'].includes(state)) return 'bg-rose-500 border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]';
  if (state === 'RECEIVED') return 'bg-blue-500 border-blue-500';
  return 'bg-slate-400 border-slate-400';
};

// Helper for State Text Color
const getStateColor = (state: string) => {
  if (['SUCCESS', 'PAYMENT_COMPLETE_SUCCESS'].includes(state)) return 'text-emerald-500';
  if (['FAILED', 'PAYMENT_COMPLETE_FAILED'].includes(state)) return 'text-rose-500';
  if (state === 'RECEIVED') return 'text-blue-400';
  return 'text-slate-400';
};

const formatTime = (iso?: string) => {
  if(!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit' }) + '.' + d.getMilliseconds();
};

const getHeaderCount = (step: PaymentStepDto) => step.headerDelta ? Object.keys(step.headerDelta).length : 0;
const getParamCount = (step: PaymentStepDto) => step.parameters ? Object.keys(step.parameters).length : 0;
</script>

<template>
  <div class="flex gap-x-6 group min-h-[80px]">
    
    <div class="w-24 text-end pt-1 flex flex-col items-end shrink-0">
      <span v-if="step.timestamp" class="text-xs font-mono text-slate-500 dark:text-slate-400 leading-none">
        {{ formatTime(step.timestamp) }}
      </span>
    </div>

    <div class="relative last:after:hidden after:absolute after:top-2.5 after:bottom-0 after:start-[6px] after:w-[2px] after:bg-slate-200 dark:after:bg-slate-700/50">
      <div class="relative z-10 flex justify-center items-center">
        <div class="w-3.5 h-3.5 rounded-full border-2 box-border transition-all duration-300" 
             :class="getDotClass(step.state)"></div>
      </div>
    </div>

    <div class="grow pb-10 pt-0.5">
      
      <div class="flex flex-col gap-1 mb-3">
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100 leading-tight">
          {{ step.stepName }}
        </h3>
        
        <div v-if="step.state" class="font-mono text-[11px] uppercase tracking-wider flex items-center gap-2">
          <span :class="getStateColor(step.state)" class="font-bold">
            {{ step.state }}
          </span>
          <span v-if="step.outcome" class="flex items-center gap-2 text-slate-500">
            <span class="w-[1px] h-3 bg-slate-600"></span>
            <span>{{ step.outcome }}</span>
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 text-xs">
        
        <button v-if="step.payload?.length" 
          @click="emit('openDrawer', step, 'Payload')"
          class="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-400 transition-all shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <span class="font-medium">{{ step.payload.length }} Payloads</span>
        </button>

        <button v-if="getHeaderCount(step) > 0"
          @click="emit('openDrawer', step, 'Headers')"
          class="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-500 hover:text-purple-400 transition-all shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
          <span class="font-medium">+{{ getHeaderCount(step) }} Headers</span>
        </button>

        <button v-if="getParamCount(step) > 0"
          @click="emit('openDrawer', step, 'Parameters')"
          class="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-400 transition-all shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          <span class="font-medium">{{ getParamCount(step) }} Params</span>
        </button>

      </div>

      <div v-if="step.error" class="mt-3">
        <div class="inline-flex items-start gap-3 px-4 py-3 bg-rose-50 dark:bg-rose-900/10 border-l-4 border-rose-500 text-sm text-rose-800 dark:text-rose-200 rounded-r shadow-sm">
          <svg class="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div class="font-mono break-all">{{ step.error.message }}</div>
        </div>
      </div>

    </div>
  </div>
</template>
