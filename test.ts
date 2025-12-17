import { RestClient } from '@/scripts/rest/RestClient';
import type { PaymentFlowDto } from '@/scripts/type/payment/PaymentFlowDto';

export class PaymentFlowClient {

  private restClient: RestClient;

  constructor(restClient: RestClient) {
    this.restClient = restClient;
  }

  public async getPaymentFlow(transactionId: string): Promise<PaymentFlowDto> {
    // Debug Log: Check your console to see exactly what URL is being requested
    const url = this.restClient.getBaseUrl() + this.getUrl(transactionId);
    console.log("[PaymentClient] Fetching:", url); 

    return await this.restClient.api
      .get<PaymentFlowDto>(url)
      .json<PaymentFlowDto>();
  }

  private getUrl(transactionId: string): string {
    // CHECK: likely your mode is "development", not "json"
    // We add "development" here so it works during standard 'npm run dev'
    if (import.meta.env.MODE === "json" || import.meta.env.MODE === "development") {
      
      // Force usage of the public folder structure
      // Ensure we don't double-slash if base url ends in /
      return `payment/${transactionId}.json`;
    } else {
      // Production / Real API endpoint
      return `process-state/${transactionId}`;
    }
  }
}

// Ensure 'environment' is passed if your RestClient depends on it for base URL setup
export const paymentFlowClient: PaymentFlowClient = new PaymentFlowClient(new RestClient(['environment', 'payment']));
