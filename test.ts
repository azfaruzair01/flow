<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { usePaymentFlowStore } from '@/scripts/store/PaymentFlowStore'; // Import the new store

// Initialize Store
const store = usePaymentFlowStore();

// Local UI State (Drawer logic stays local)
const selectedStep = ref(null);
const isDrawerOpen = ref(false);
const currentTab = ref('Payload');

// Formatters & UI Logic (Keep this in the component for now)
function extractTime(iso: string) { 
    if(!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit' }) + '.' + new Date(iso).getMilliseconds(); 
}

function formatDateTime(iso: string) { 
    if(!iso) return ''; 
    return new Date(iso).toLocaleString(); 
}

// Color Logic
const successStates = ['SUCCESS', 'PAYMENT_COMPLETE_SUCCESS'];
const failStates = ['FAILED', 'PAYMENT_COMPLETE_FAILED', 'CALL_FAILED', 'CALL_WATCHDOG_FAILED'];
const warnStates = ['DEADLINE_PASSED', 'MAN_WAKEUP'];

function getStateColor(state: string) {
    if(successStates.includes(state)) return 'text-green-500';
    if(failStates.includes(state)) return 'text-hsbc-red'; // Ensure 'hsbc-red' is in your Tailwind config
    if(warnStates.includes(state)) return 'text-amber-500';
    return 'text-gray-400';
}

function getDotClass(state: string) {
    if(successStates.includes(state)) return 'bg-green-500 border-green-500';
    if(failStates.includes(state)) return 'bg-hsbc-red border-hsbc-red';
    if(warnStates.includes(state)) return 'bg-amber-500 border-amber-500';
    return 'bg-gray-500 border-gray-500';
}

const statusColorText = computed(() => getStateColor(store.lastStatus));

// Drawer Actions
function openDrawer(step: any, tab = 'Payload') { 
    selectedStep.value = step; 
    currentTab.value = tab; 
    isDrawerOpen.value = true; 
}
function closeDrawer() { isDrawerOpen.value = false; }
function getHeaderCount(step: any) { return step.headerDelta ? Object.keys(step.headerDelta).length : 0; }

// Trigger Load on Mount
onMounted(() => {
    // Pass the ID you want to load
    store.loadTransaction('542196fe-1f62-4ec8-a6b7-78043fc6bc3b'); 
});
</script>

<template>
  <div class="h-full flex flex-col">
    <div v-if="store.loading" class="flex justify-center items-center h-full text-gray-500">
        Loading...
    </div>

    <div v-else-if="store.error" class="flex justify-center items-center h-full text-red-500">
        {{ store.error }}
    </div>

    <div v-else class="flex flex-col h-full">
        </div>
    
    </div>
</template>
