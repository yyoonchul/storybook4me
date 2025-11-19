import Header from "../../shared/components/layout/Header";
import Footer from "../../shared/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { Badge } from "../../shared/components/ui/badge";
import { PricingTable, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { CheckoutButton } from "@clerk/clerk-react/experimental";
import { clerkBillingConfig, isPlusPlanConfigured } from "@/shared/lib/billing";

type BillingPlan = {
  id: "free" | "plus";
  name: string;
  price: string;
  cadence: string;
  badge: { label: string; variant: "default" | "secondary" };
  description: string;
  features: string[];
  planId?: string;
  planPeriod?: "month" | "annual";
  ctaLabel?: string;
};

const plans: BillingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "/ month",
    badge: { label: "Try it", variant: "secondary" },
    description: "Great for trying things out",
    features: ["✓ 1 story/day", "— AI chat editing not included"],
    ctaLabel: "Included",
  },
  {
    id: "plus",
    name: "Plus",
    price: "$19.9",
    cadence: "/ month",
    badge: { label: "Best value", variant: "secondary" },
    description: "Unlimited creation for power users",
    features: [
      "✓ Unlimited stories (fair use)",
      "✓ More access to premium AI models",
      "✓ Full AI chat editing",
      "✓ Priority support",
    ],
    planId: clerkBillingConfig.plus.planId,
    planPeriod: clerkBillingConfig.plus.planPeriod,
    ctaLabel: "Upgrade to Plus",
  },
];

const BillingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground mb-8">
            Clerk Billing manages subscriptions and opens a secure Stripe-powered checkout when you pick a plan.
          </p>

          <Card className="mb-10">
            <CardHeader>
              <CardTitle>Clerk-managed checkout</CardTitle>
              <CardDescription>Subscriptions, upgrades, and downgrades follow the lifecycle described in Clerk Billing docs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Upgrades apply immediately; downgrades take effect at the next renewal.</p>
              <p>• All prices are processed in USD through your connected Stripe account.</p>
              <p>• Use the buttons below to open Clerk&apos;s checkout drawer for each plan.</p>
            </CardContent>
          </Card>

          <SignedIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {plans.map((plan) => (
                <Card key={plan.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.name}</CardTitle>
                      <Badge variant={plan.badge.variant}>{plan.badge.label}</Badge>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-4xl font-bold">{plan.price}</div>
                      <div className="text-muted-foreground">{plan.cadence}</div>
                    </div>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature) => {
                        if (feature.startsWith("✓ Unlimited stories")) {
                          return (
                            <li key={feature}>
                              ✓ <span className="font-semibold text-primary">Unlimited stories</span> (fair use)
                            </li>
                          );
                        }
                        if (feature === "✓ More access to premium AI models") {
                          return (
                            <li key={feature}>
                              ✓ <span className="font-semibold">More access to premium AI models</span>
                            </li>
                          );
                        }
                        if (feature === "✓ Full AI chat editing") {
                          return (
                            <li key={feature}>
                              ✓ <span className="font-semibold">Full AI chat editing</span>
                            </li>
                          );
                        }
                        if (feature === "✓ Priority support") {
                          return <li key={feature}>✓ Priority support</li>;
                        }
                        return <li key={feature}>{feature}</li>;
                      })}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    {plan.planId ? (
                      <CheckoutButton
                        planId={plan.planId}
                        planPeriod={plan.planPeriod}
                        newSubscriptionRedirectUrl={clerkBillingConfig.redirectUrl}
                      >
                        <Button className="w-full">{plan.ctaLabel ?? "Open checkout"}</Button>
                      </CheckoutButton>
                    ) : (
                      <Button
                        className="w-full"
                        variant={plan.id === "free" ? "outline" : "destructive"}
                        disabled={plan.id === "free" || isPlusPlanConfigured()}
                        title={
                          plan.id === "plus" && !isPlusPlanConfigured()
                            ? "Set VITE_CLERK_PLUS_PLAN_ID to enable checkout."
                            : undefined
                        }
                      >
                        {plan.id === "plus" && !isPlusPlanConfigured() ? "Plan ID missing" : plan.ctaLabel}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </SignedIn>

          <SignedOut>
            <div className="text-center border border-dashed rounded-2xl p-10">
              <p className="text-muted-foreground">Sign in to view and manage your subscription.</p>
              <SignInButton mode="modal">
                <Button className="mt-4">Sign in</Button>
              </SignInButton>
            </div>
          </SignedOut>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Plan overview</h2>
            <div className="rounded-3xl border border-border/70 bg-card/60 p-4">
              <PricingTable
                collapseFeatures
                ctaPosition="bottom"
                newSubscriptionRedirectUrl={clerkBillingConfig.redirectUrl}
                fallback={
                  <p className="text-muted-foreground text-sm">
                    Loading Clerk pricing table…
                  </p>
                }
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BillingPage;