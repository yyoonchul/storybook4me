import Header from "../../shared/components/layout/Header";
import Footer from "../../shared/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { Badge } from "../../shared/components/ui/badge";
import { Link } from "react-router-dom";

// Mocked subscription state (replace with real API integration later)
const currentSubscription = {
  planId: "free" as "free" | "starter" | "pro",
  status: "active" as "active" | "past_due" | "canceled",
  renewsOn: "2025-10-01",
  paymentMethod: "Visa •••• 4242",
};

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "/ month",
    badge: { label: "Try it", variant: "secondary" as const },
    description: "Great for trying things out",
    features: ["✓ 1 story/day", "✓ Core templates"],
  },
  {
    id: "starter",
    name: "Starter",
    price: "$9.9",
    cadence: "/ month",
    badge: { label: "Popular", variant: "default" as const },
    description: "Smart pick for individuals",
    features: [
      "✓ 10 stories/month",
      "✓ All templates",
      "✓ High‑res downloads",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19.9",
    cadence: "/ month",
    badge: { label: "Best value", variant: "secondary" as const },
    description: "Advanced tools for power users",
    features: [
      "✓ Unlimited stories (fair use)",
      "✓ All templates + premium themes",
      "✓ High‑res downloads",
      "✓ Priority support",
    ],
  },
] as const;

function getPlanOrder(planId: "free" | "starter" | "pro") {
  return planId === "free" ? 0 : planId === "starter" ? 1 : 2;
}

const BillingPage = () => {
  const currentPlanOrder = getPlanOrder(currentSubscription.planId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground mb-8">View your plan, manage billing, and upgrade your subscription.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Plan</CardTitle>
                    <CardDescription>Current subscription status and renewal</CardDescription>
                  </div>
                  <Badge variant={currentSubscription.planId === "starter" ? "default" : "secondary"}>
                    {currentSubscription.planId === "free" ? "Free" : currentSubscription.planId === "starter" ? "Starter" : "Pro"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="font-medium capitalize">{currentSubscription.status.replace("_", " ")}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Renews on</div>
                    <div className="font-medium">{currentSubscription.renewsOn}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Payment method</div>
                    <div className="font-medium">{currentSubscription.paymentMethod}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button variant="outline" disabled title="Connect billing to enable">
                  Manage subscription
                </Button>
                {currentPlanOrder < getPlanOrder("pro") ? (
                  <Link to="/pricing">
                    <Button>Upgrade</Button>
                  </Link>
                ) : (
                  <Button variant="outline" disabled>
                    You're on Pro
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>Invoices and receipts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Default payment</span>
                  <span className="font-medium">{currentSubscription.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Next invoice</span>
                  <span className="font-medium">{currentSubscription.renewsOn}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" disabled title="Invoices will appear after your first payment">
                  View invoices
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Available plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const planOrder = getPlanOrder(plan.id);
                const isCurrent = currentPlanOrder === planOrder;
                const isUpgrade = planOrder > currentPlanOrder;
                const isDowngrade = planOrder < currentPlanOrder;

                return (
                  <Card
                    key={plan.id}
                    className={`${plan.id === "starter" ? "relative border-primary/30 " : ""}flex flex-col`}
                  >
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
                        {plan.features.map((f) => {
                          if (f === "✓ 10 stories/month") return <li key={f}>{f}</li>;
                          if (f === "✓ All templates")
                            return (
                              <li key={f}>
                                ✓ <span className="font-semibold text-primary">All templates</span>
                              </li>
                            );
                          if (f === "✓ High‑res downloads")
                            return (
                              <li key={f}>
                                ✓ <span className="font-semibold text-primary">High‑res downloads</span>
                              </li>
                            );
                          if (f.startsWith("✓ Unlimited stories"))
                            return (
                              <li key={f}>
                                ✓ <span className="font-semibold text-primary">Unlimited stories</span> (fair use)
                              </li>
                            );
                          if (f === "✓ All templates + premium themes")
                            return (
                              <li key={f}>
                                ✓ All templates + <span className="font-semibold text-primary">premium themes</span>
                              </li>
                            );
                          if (f === "✓ Priority support")
                            return (
                              <li key={f}>
                                ✓ <span className="font-semibold text-primary">Priority support</span>
                              </li>
                            );
                          return <li key={f}>{f}</li>;
                        })}
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      {isCurrent ? (
                        <Button className="w-full" variant="outline" disabled>
                          Current plan
                        </Button>
                      ) : isUpgrade ? (
                        <Link to="/pricing" className="w-full">
                          <Button className="w-full">Upgrade to {plan.name}</Button>
                        </Link>
                      ) : isDowngrade ? (
                        <Button className="w-full" variant="outline" disabled title="Downgrade will be available soon">
                          Downgrade to {plan.name}
                        </Button>
                      ) : null}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BillingPage;