import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { paymentFlowClient } from '@/scripts/rest/PaymentFlowClient';
import type { PaymentStepDto } from '@/scripts/type/payment/PaymentFlowDto';

export const usePaymentFlowStore = defineStore('payment-flow', () => {
  
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const transactionId = ref<string>('');
  const rawSteps = ref<PaymentStepDto[]>([]);

  // Duration Logic
  const totalDuration = computed(() => {
    const validSteps = rawSteps.value.filter(s => s.timestamp);
    if (validSteps.length < 2) return '0ms';
    const start = new Date(validSteps[0].timestamp!).getTime();
    const end = new Date(validSteps[validSteps.length - 1].timestamp!).getTime();
    return `${end - start}ms`;
  });

  // Last Status Text
  const lastStatus = computed(() => {
    if (!rawSteps.value.length) return 'UNKNOWN';
    return rawSteps.value[rawSteps.value.length - 1].state;
  });

  // Last Status Color (Shared Logic for Header)
  const lastStatusColor = computed(() => {
    const s = lastStatus.value;
    if (['SUCCESS', 'PAYMENT_COMPLETE_SUCCESS'].includes(s)) return 'text-green-600 dark:text-green-400';
    if (['FAILED', 'PAYMENT_COMPLETE_FAILED', 'CALL_WATCHDOG_FAILED'].includes(s)) return 'text-hsbc-red dark:text-red-400';
    if (['DEADLINE_PASSED', 'MAN_WAKEUP'].includes(s)) return 'text-amber-600 dark:text-amber-400';
    return 'text-blue-600 dark:text-blue-400'; // Header keeps Blue for "In Progress/Received"
  });

  async function loadTransaction(id: string) {
    if(!id) return;
    loading.value = true;
    error.value = null;
    try {
      const data = await paymentFlowClient.getPaymentFlow(id);
      transactionId.value = data.transactionId;
      rawSteps.value = data.steps;
    } catch (err: any) {
      error.value = err.message || 'Failed to load';
    } finally {
      loading.value = false;
    }
  }

  return { loading, error, transactionId, rawSteps, totalDuration, lastStatus, lastStatusColor, loadTransaction };
});
