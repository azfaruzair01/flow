import { RestClient } from '@/scripts/rest/RestClient';
import type { PaymentFlowDto } from '@/scripts/type/payment/PaymentFlowDto';

class PaymentFlowClient {
  private restClient: RestClient;

  constructor(restClient: RestClient) {
    this.restClient = restClient;
  }

  async getFlow(transactionId: string): Promise<PaymentFlowDto> {
    // This looks exactly like your ConfigMapClient logic:
    // 1. Get the URL (either local JSON file or real API endpoint)
    // 2. Perform the actual HTTP GET request
    const url = this.getUrl(transactionId);
    
    return await this.restClient.api
      .get<PaymentFlowDto>(url)
      .json<PaymentFlowDto>();
  }

  private getUrl(transactionId: string): string {
    // Match your project's environment check style
    if (import.meta.env.MODE === "json") {
      // Points to public/mock/payment-flow/transaction-id.json
      return `/mock/payment-flow/${transactionId}.json`;
    } 
    
    // Real API Path
    return `${this.restClient.getBaseUrl()}/process-state/${transactionId}`;
  }
}

// Export singleton
export const paymentFlowClient = new PaymentFlowClient(new RestClient(['payment']));
