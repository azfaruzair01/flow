<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePaymentFlowStore } from '@/scripts/store/PaymentFlowStore';
import TimelineItem from '@/components/payment/TimelineItem.vue';
import TimelineDrawer from '@/components/payment/TimelineDrawer.vue';

const store = usePaymentFlowStore();
const isDrawerOpen = ref(false);
const selectedStep = ref(null);
const initialTab = ref('Payload');

// Load Data
onMounted(() => {
  store.loadTransaction('542196fe-1f62-4ec8-a6b7-78043fc6bc3b');
});

// Actions
const handleOpenDrawer = (step: any, tab: string) => {
  selectedStep.value = step;
  initialTab.value = tab;
  isDrawerOpen.value = true;
};
</script>

<template>
  <div class="h-full flex flex-col bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100">
    
    <header class="bg-gray-50 dark:bg-[#2d2d2d] border-b border-gray-200 dark:border-[#404040] px-6 py-4 shadow-sm z-10">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <h1 class="text-lg font-bold tracking-tight">{{ store.transactionId }}</h1>
          <span class="font-bold uppercase text-xs" :class="store.lastStatusColor">
            {{ store.lastStatus }}
          </span>
        </div>
        <div class="flex gap-8 text-right">
          <div>
            <div class="text-[10px] uppercase text-gray-500 font-semibold">Duration</div>
            <div class="font-mono text-base font-medium">{{ store.totalDuration }}</div>
          </div>
          <div>
            <div class="text-[10px] uppercase text-gray-500 font-semibold">Steps</div>
            <div class="font-mono text-base font-medium">{{ store.rawSteps.length }}</div>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto p-8">
      <div v-if="store.loading" class="flex justify-center mt-10 text-gray-500">Loading...</div>
      <div v-else class="max-w-6xl mx-auto">
        <TimelineItem 
          v-for="step in store.rawSteps" 
          :key="step.step" 
          :step="step" 
          @openDrawer="handleOpenDrawer"
        />
      </div>
    </main>

    <TimelineDrawer 
      :isOpen="isDrawerOpen" 
      :step="selectedStep" 
      :initialTab="initialTab"
      @close="isDrawerOpen = false"
    />
  </div>
</template>
