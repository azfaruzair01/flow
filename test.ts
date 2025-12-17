<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePaymentFlowStore } from '@/scripts/store/PaymentFlowStore';
import TimelineItem from '@/components/payment/TimelineItem.vue';
import TimelineDrawer from '@/components/payment/TimelineDrawer.vue';

const route = useRoute();
const store = usePaymentFlowStore();

const isDrawerOpen = ref(false);
const selectedStep = ref(null);
const initialTab = ref('Payload');

const statusColorText = computed(() => {
  const last = store.lastStatus;
  if(['SUCCESS', 'PAYMENT_COMPLETE_SUCCESS'].includes(last)) return 'text-emerald-500'; // Brighter Green
  if(['FAILED', 'PAYMENT_COMPLETE_FAILED'].includes(last)) return 'text-rose-500';     // Brighter Red
  return 'text-blue-400';
});

function handleOpenDrawer(step: any, tab: string) {
  selectedStep.value = step;
  initialTab.value = tab;
  isDrawerOpen.value = true;
}

onMounted(() => {
  const txnId = route.params.id as string; 
  if(txnId) store.loadTransaction(txnId);
});
</script>

<template>
  <div class="h-full flex flex-col bg-white dark:bg-[#0f111a] text-slate-900 dark:text-slate-200">
    
    <header class="bg-white dark:bg-[#161822] border-b border-slate-200 dark:border-slate-700/60 px-6 py-4 shrink-0 z-20 shadow-sm">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {{ store.transactionId || 'Loading...' }}
              </h1>
              <span class="font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-opacity-10"
                :class="[statusColorText, statusColorText.replace('text-', 'bg-')]">
                {{ store.lastStatus }}
              </span>
            </div>
            <div class="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">
              Started: <span class="font-mono">{{ store.rawSteps[0]?.timestamp || '-' }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex gap-10 text-right">
           <div>
             <div class="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Duration</div>
             <div class="font-mono text-lg font-semibold text-slate-700 dark:text-slate-200">{{ store.totalDuration }}</div>
           </div>
           <div>
             <div class="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Steps</div>
             <div class="font-mono text-lg font-semibold text-slate-700 dark:text-slate-200">{{ store.rawSteps.length }}</div>
           </div>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto p-8 custom-scrollbar">
      <div v-if="store.loading" class="text-center text-slate-500 mt-10">Loading Payment Flow...</div>
      <div v-else-if="store.error" class="text-center text-rose-500 mt-10">{{ store.error }}</div>
      
      <div v-else class="max-w-5xl mx-auto">
        <TimelineItem 
          v-for="(step, index) in store.rawSteps" 
          :key="index" 
          :step="step"
          @openDrawer="handleOpenDrawer"
        />
      </div>
    </main>

    <TimelineDrawer 
      :is-open="isDrawerOpen" 
      :step="selectedStep" 
      :initial-tab="initialTab"
      @close="isDrawerOpen = false"
    />
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; border-radius: 4px; }
</style>
