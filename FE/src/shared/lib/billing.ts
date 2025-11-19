const resolvePlanPeriod = (value: string | undefined): 'month' | 'annual' => {
  return value === 'annual' ? 'annual' : 'month';
};

const plusPlanId = import.meta.env.VITE_CLERK_PLUS_PLAN_ID ?? '';
const plusPlanPeriodEnv = import.meta.env.VITE_CLERK_PLUS_PLAN_PERIOD;
const redirectUrl = import.meta.env.VITE_CLERK_BILLING_REDIRECT_URL ?? '/studio';

export const clerkBillingConfig = {
  redirectUrl,
  plus: {
    planId: plusPlanId,
    planPeriod: resolvePlanPeriod(plusPlanPeriodEnv),
  },
};

export const isPlusPlanConfigured = () => Boolean(plusPlanId);

