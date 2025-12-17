export interface PaymentStepPayloadDto {
  label: string;
  size: number;
  data?: any;
  metadata?: any;
}

export interface PaymentStepDto {
  step: number;
  timestamp?: string; // Optional because of Mesh steps
  state: string;
  stepName: string;
  serviceName: string;
  outcome?: string;
  error?: { message: string };
  blockTags?: string[];
  headerDelta?: Record<string, string>;
  parameters?: Record<string, string>;
  payload?: PaymentStepPayloadDto[];
}

export interface PaymentFlowDto {
  transactionId: string;
  steps: PaymentStepDto[];
}
