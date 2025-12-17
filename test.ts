<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePaymentFlowStore } from '@/scripts/store/PaymentFlowStore';
import TimelineItem from '@/components/payment/TimelineItem.vue';
import TimelineDrawer from '@/components/payment/TimelineDrawer.vue';

const route = useRoute();
const store = usePaymentFlowStore();

const isDrawerOpen = ref(false);
const selectedStep = ref(null);
const initialTab = ref('Payload');

function handleOpenDrawer(step: any, tab: string) {
  selectedStep.value = step;
  initialTab.value = tab;
  isDrawerOpen.value = true;
}

// Robust loading logic
const loadData = () => {
  const id = route.params.id as string;
  if(id) store.loadTransaction(id);
};

onMounted(loadData);
watch(() => route.params.id, loadData);
</script>

<template>
  <div class="h-full flex flex-col bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-200">
    
    <header class="bg-gray-50 dark:bg-[#2d2d2d] border-b border-gray-200 dark:border-[#404040] px-6 py-3 shrink-0 z-20 shadow-md">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <h1 class="text-lg font-bold tracking-tight">{{ store.transactionId || 'Loading...' }}</h1>
          <span class="font-bold uppercase tracking-wider text-xs" :class="store.lastStatusColor">
            {{ store.lastStatus }}
          </span>
        </div>
        <div class="flex gap-8 text-right text-xs">
           <div><span class="text-gray-500 font-semibold uppercase">Duration</span> <span class="font-mono block">{{ store.totalDuration }}</span></div>
           <div><span class="text-gray-500 font-semibold uppercase">Steps</span> <span class="font-mono block">{{ store.rawSteps.length }}</span></div>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto p-8">
      <div v-if="store.loading" class="text-center text-gray-500 mt-10">Loading...</div>
      <div v-else-if="store.error" class="text-center text-red-500 mt-10">{{ store.error }}</div>
      
      <div v-else class="max-w-6xl mx-auto">
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
