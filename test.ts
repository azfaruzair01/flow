import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { paymentFlowClient } from '@/scripts/rest/PaymentFlowClient';
import type { PaymentStepDto } from '@/scripts/type/payment/PaymentFlowDto';

export const usePaymentFlowStore = defineStore('payment-flow', () => {
  
  // -- State --
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const transactionId = ref<string>('');
  const rawSteps = ref<PaymentStepDto[]>([]);

  // -- Getters (Computed) --
  
  // 1. Calculate Duration
  const totalDuration = computed(() => {
    const validSteps = rawSteps.value.filter(s => s.timestamp);
    if (validSteps.length < 2) return '0ms';
    
    const start = new Date(validSteps[0].timestamp!).getTime();
    const end = new Date(validSteps[validSteps.length - 1].timestamp!).getTime();
    return `${end - start}ms`;
  });

  // 2. Get Last Status
  const lastStatus = computed(() => {
    if (!rawSteps.value.length) return 'UNKNOWN';
    return rawSteps.value[rawSteps.value.length - 1].state;
  });

  // -- Actions --
  
  async function loadTransaction(id: string): Promise<void> {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await paymentFlowClient.getFlow(id);
      transactionId.value = data.transactionId;
      rawSteps.value = data.steps;
    } catch (err: any) {
      console.error(err);
      error.value = err.message || 'Failed to load payment flow';
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    loading,
    error,
    transactionId,
    rawSteps,
    // Getters
    totalDuration,
    lastStatus,
    // Actions
    loadTransaction
  };
});
