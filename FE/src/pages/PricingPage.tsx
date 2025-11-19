import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../shared/components/ui/card";
import { Button } from "../shared/components/ui/button";
import { Badge } from "../shared/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../shared/components/ui/table";
import { PricingTable, SignInButton, SignedOut } from "@clerk/clerk-react";
import { clerkBillingConfig } from "@/shared/lib/billing";

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-3">Pricing</h1>
          <p className="text-gray-600 mb-10">Get started fast. Choose the plan that fits your needs.</p>

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
              fallback={<LegacyPricingFallback />}
            />
          </div>

          <SignedOut>
            <div className="text-center mt-10 border border-dashed rounded-2xl p-8">
              <p className="text-muted-foreground">Sign in to start a Clerk-managed subscription.</p>
              <SignInButton mode="modal">
                <Button className="mt-4">Sign in to continue</Button>
              </SignInButton>
            </div>
          </SignedOut>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;

const LegacyPricingFallback = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="flex flex-col hover-lift transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Free</CardTitle>
            <Badge variant="secondary">Try it</Badge>
          </div>
          <CardDescription>Great for trying things out</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-4xl font-bold">$0</div>
            <div className="text-muted-foreground">/ month</div>
          </div>
          <ul className="space-y-2 text-sm">
            <li>✓ 1 story/day</li>
            <li>— AI chat editing not included</li>
          </ul>
        </CardContent>
        <CardFooter className="mt-auto">
          <Button className="w-full" variant="outline">Get started</Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col hover-lift transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Plus</CardTitle>
            <Badge variant="secondary">Best value</Badge>
          </div>
          <CardDescription>Unlimited creation for power users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-4xl font-bold">$19.9</div>
            <div className="text-muted-foreground">/ month</div>
          </div>
          <ul className="space-y-2 text-sm">
            <li>✓ <span className="font-semibold text-primary">Unlimited stories</span> (fair use)</li>
            <li>✓ <span className="font-semibold">More access to premium AI models</span></li>
            <li>✓ <span className="font-semibold">Full AI chat editing</span></li>
            <li>✓ Priority support</li>
          </ul>
        </CardContent>
        <CardFooter className="mt-auto">
          <Button className="w-full" variant="secondary">Upgrade to Plus</Button>
        </CardFooter>
      </Card>
    </div>

    <div className="mt-14">
      <h2 className="text-2xl font-semibold mb-4">Compare plans</h2>
      <Table>
        <TableCaption>Features are continuously improving.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Feature</TableHead>
            <TableHead>Free</TableHead>
            <TableHead>Plus</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Story generation</TableCell>
            <TableCell>1/day</TableCell>
            <TableCell>Unlimited</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Priority support</TableCell>
            <TableCell>—</TableCell>
            <TableCell>Included</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>AI chat editing</TableCell>
            <TableCell>Not available</TableCell>
            <TableCell>Full access</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Premium AI models</TableCell>
            <TableCell>Basic</TableCell>
            <TableCell>More access</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </>
);