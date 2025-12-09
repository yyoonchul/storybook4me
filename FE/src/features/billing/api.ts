import { apiClient } from '@/shared/lib/api-client';

export type PlanType = 'free' | 'plus';

export interface SubscriptionResponse {
  plan_type: PlanType;
}

// Billing feature API
export const billingApi = {
  async getSubscription(token?: string): Promise<SubscriptionResponse> {
    return apiClient.get<SubscriptionResponse>('billing/subscription', token);
  },
};











