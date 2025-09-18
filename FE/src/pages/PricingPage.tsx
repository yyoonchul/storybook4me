import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../shared/components/ui/card";
import { Button } from "../shared/components/ui/button";
import { Badge } from "../shared/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../shared/components/ui/table";

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-3">Pricing</h1>
          <p className="text-gray-600 mb-10">Get started fast. Choose the plan that fits your needs.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex flex-col">
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
                  <li>✓ Core templates</li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full" variant="outline">Get started</Button>
              </CardFooter>
            </Card>

            <Card className="relative border-primary/30 flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Starter</CardTitle>
                  <Badge>Popular</Badge>
                </div>
                <CardDescription>Smart pick for individuals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-4xl font-bold">$9.9</div>
                  <div className="text-muted-foreground">/ month</div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✓ 10 stories/month</li>
                  <li>✓ <span className="font-semibold text-primary">All templates</span></li>
                  <li>✓ <span className="font-semibold text-primary">High‑res downloads</span></li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full">Choose Starter</Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pro</CardTitle>
                  <Badge variant="secondary">Best value</Badge>
                </div>
                <CardDescription>Advanced tools for power users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-4xl font-bold">$19.9</div>
                  <div className="text-muted-foreground">/ month</div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>✓ <span className="font-semibold text-primary">Unlimited stories</span> (fair use)</li>
                  <li>✓ All templates + <span className="font-semibold text-primary">premium themes</span></li>
                  <li>✓ High‑res downloads</li>
                  <li>✓ <span className="font-semibold text-primary">Priority support</span></li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full" variant="secondary">Upgrade to Pro</Button>
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
                  <TableHead>Starter</TableHead>
                  <TableHead>Pro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Story generation</TableCell>
                  <TableCell>1/day</TableCell>
                  <TableCell>10/month</TableCell>
                  <TableCell>Unlimited</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Template access</TableCell>
                  <TableCell>Core</TableCell>
                  <TableCell>All</TableCell>
                  <TableCell>All + Premium</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>High‑res downloads</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>Included</TableCell>
                  <TableCell>Included</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Priority support</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>Included</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;