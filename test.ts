import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { paymentFlowClient } from '@/scripts/rest/PaymentFlowClient';
import type { PaymentStepDto } from '@/scripts/type/payment/PaymentFlowDto';

export const usePaymentFlowStore = defineStore('payment-flow', () => {
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const transactionId = ref<string>('');
  const rawSteps = ref<PaymentStepDto[]>([]);

  // Getters (Duration, Status) remain the same...

  async function loadTransaction(id: string): Promise<void> {
    loading.value = true;
    error.value = null;
    
    try {
      // Now this actually triggers a network call (to local JSON or Real API)
      const data = await paymentFlowClient.getFlow(id);
      
      transactionId.value = data.transactionId;
      rawSteps.value = data.steps;
    } catch (err: any) {
      console.error("Payment Flow Error:", err);
      error.value = err.message || 'Failed to load flow';
    } finally {
      loading.value = false;
    }
  }

  return {
    loading, error, transactionId, rawSteps,
    loadTransaction
    // ... export getters
  };
});
