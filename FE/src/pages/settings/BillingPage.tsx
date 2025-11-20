import Header from "../../shared/components/layout/Header";
import Footer from "../../shared/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { Badge } from "../../shared/components/ui/badge";
import { SignedIn, SignedOut, SignInButton, PricingTable } from "@clerk/clerk-react";
import { clerkBillingConfig } from "@/shared/lib/billing";
import { useEffect } from "react";
import { usePlanDialog } from "@/shared/components/plan/PlanDialogProvider";

const BillingPage = () => {
  // TODO: Fetch actual subscription status from Clerk API
  // For now, assume Free plan if no subscription is found
  const hasPlusSubscription = false; // This should be fetched from Clerk
  const { openPlanDialog } = usePlanDialog();

  // Fix Clerk checkout drawer z-index dynamically
  useEffect(() => {
    const fixClerkZIndex = () => {
      // Find all possible Clerk elements and set high z-index
      const clerkElements = document.querySelectorAll(
        '[data-clerk-element], [data-clerk-portal], [class*="cl-"], [id*="clerk"], [role="dialog"]'
      );
      clerkElements.forEach((el) => {
        const element = el as HTMLElement;
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.position === 'fixed' || computedStyle.position === 'absolute') {
          element.style.zIndex = '10000';
        }
      });

      // Check body direct children (Portal elements)
      const bodyChildren = Array.from(document.body.children);
      bodyChildren.forEach((child) => {
        const element = child as HTMLElement;
        const computedStyle = window.getComputedStyle(element);
        if ((element.id?.includes('clerk') || 
            element.className?.includes('cl') ||
            element.hasAttribute('data-clerk')) &&
            (computedStyle.position === 'fixed' || computedStyle.position === 'absolute')) {
          element.style.zIndex = '10000';
        }
      });
    };

    // Run on mount and periodically to catch dynamically added elements
    fixClerkZIndex();
    const interval = setInterval(fixClerkZIndex, 100);

    // Also listen for DOM mutations
    const observer = new MutationObserver(fixClerkZIndex);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'id'],
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground mb-8">
            Manage your subscription and billing information.
          </p>

          <SignedIn>
            {/* Current Plan Section */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Your active subscription plan</CardDescription>
                  </div>
                  <Badge variant={hasPlusSubscription ? "default" : "secondary"}>
                    {hasPlusSubscription ? "Plus" : "Free"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Plan</div>
                    <div className="font-medium">{hasPlusSubscription ? "Plus" : "Free"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="font-medium capitalize">
                      {hasPlusSubscription ? "Active" : "Free Tier"}
                    </div>
                  </div>
                  {hasPlusSubscription && (
                    <div>
                      <div className="text-sm text-muted-foreground">Next billing</div>
                      <div className="font-medium">—</div>
                    </div>
                  )}
                </div>
                {hasPlusSubscription ? (
                  <div className="pt-4 border-t">
                    <ul className="space-y-2 text-sm">
                      <li>✓ <span className="font-semibold text-primary">Unlimited stories</span> (fair use)</li>
                      <li>✓ <span className="font-semibold">More access to premium AI models</span></li>
                      <li>✓ <span className="font-semibold">Full AI chat editing</span></li>
                      <li>✓ Priority support</li>
                    </ul>
                  </div>
                ) : (
                  <div className="pt-4 border-t">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✓ 1 story/day</li>
                      <li>— AI chat editing not included</li>
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {hasPlusSubscription ? (
                  <Button variant="outline" disabled>
                    Manage subscription (Coming soon)
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
                    <p className="text-sm text-muted-foreground">
                      View available plans to upgrade your subscription.
                    </p>
                    <Button onClick={openPlanDialog} className="sm:w-max">
                      View plans
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>

            {/* Available Plans - Use Clerk PricingTable */}
            {!hasPlusSubscription && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Available Plans</h2>
                <div className="rounded-3xl border border-border/80 bg-card/60 p-6 shadow-lg shadow-purple-100/40">
                  <PricingTable
                    collapseFeatures={false}
                    ctaPosition="bottom"
                    newSubscriptionRedirectUrl={clerkBillingConfig.redirectUrl}
                    checkoutProps={{
                      appearance: {
                        variables: {
                          colorPrimary: "#7c3aed",
                        },
                      },
                    }}
                    fallback={
                      <p className="text-muted-foreground text-sm text-center py-8">
                        Loading plans...
                      </p>
                    }
                  />
                </div>
              </div>
            )}
          </SignedIn>

          <SignedOut>
            <Card className="text-center">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">Sign in to view and manage your subscription.</p>
                <SignInButton mode="modal">
                  <Button>Sign in</Button>
                </SignInButton>
              </CardContent>
            </Card>
          </SignedOut>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BillingPage;