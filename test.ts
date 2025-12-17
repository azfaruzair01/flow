import { RestClient } from '@/scripts/rest/RestClient';
import type { PaymentFlowDto } from '@/scripts/type/payment/PaymentFlowDto';

export class PaymentFlowClient {

  private restClient: RestClient;

  constructor(restClient: RestClient) {
    this.restClient = restClient;
  }

  // Exact pattern from EventClient: uses getUrl() to handle the path
  public async getPaymentFlow(transactionId: string): Promise<PaymentFlowDto> {
    return await this.restClient.api
      .get<PaymentFlowDto>(this.restClient.getBaseUrl() + this.getUrl(transactionId))
      .json<PaymentFlowDto>();
  }

  // Helper to switch between Mock JSON file and Real API endpoint
  private getUrl(transactionId: string): string {
    if (import.meta.env.MODE === "json") {
      // In 'json' mode, this looks for a file in your public folder:
      // public/payment/542196fe-1f62-4ec8-a6b7-78043fc6bc3b.json
      return "payment/" + transactionId + ".json";
    } else {
      // In production/remote mode, this hits the real backend endpoint
      return "process-state/" + transactionId;
    }
  }
}

// FIX: Added 'environment' to match EventClient's pattern
export const paymentFlowClient: PaymentFlowClient = new PaymentFlowClient(new RestClient(['environment', 'payment']));
