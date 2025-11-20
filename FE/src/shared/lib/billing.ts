const resolvePlanPeriod = (value: string | undefined): 'month' | 'annual' => {
  return value === 'annual' ? 'annual' : 'month';
};

const plusPlanId = import.meta.env.VITE_CLERK_PLUS_PLAN_ID ?? '';
const plusPlanPeriodEnv = import.meta.env.VITE_CLERK_PLUS_PLAN_PERIOD;
const redirectUrl = import.meta.env.VITE_CLERK_BILLING_REDIRECT_URL ?? '/settings/billing';

// Debug: Log plan configuration (only in development)
if (import.meta.env.DEV) {
  console.log('[Billing Config]', {
    planId: plusPlanId || 'NOT SET',
    planPeriod: resolvePlanPeriod(plusPlanPeriodEnv),
    redirectUrl,
    envCheck: {
      hasEnv: !!import.meta.env.VITE_CLERK_PLUS_PLAN_ID,
      value: import.meta.env.VITE_CLERK_PLUS_PLAN_ID,
    },
  });
}

export const clerkBillingConfig = {
  redirectUrl,
  plus: {
    planId: plusPlanId,
    planPeriod: resolvePlanPeriod(plusPlanPeriodEnv),
  },
};

export const isPlusPlanConfigured = () => Boolean(plusPlanId);

// Helper to get current plan ID for debugging
export const getCurrentPlanId = () => plusPlanId;

