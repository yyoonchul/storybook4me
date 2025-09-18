import Header from "../../shared/components/layout/Header";
import Footer from "../../shared/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { Separator } from "../../shared/components/ui/separator";
import { Badge } from "../../shared/components/ui/badge";

// Mocked user & subscription data (replace with real API integration later)
const currentUser = {
  name: "",
  displayName: "",
  bio: "",
  email: "you@example.com",
  providers: ["email" as const, /* e.g., "google", "github" */],
};

const currentSubscription = {
  planId: "free" as "free" | "starter" | "pro",
  status: "active" as "active" | "past_due" | "canceled",
  renewsOn: "2025-10-01",
};

function getPlanLabel(planId: "free" | "starter" | "pro") {
  return planId === "free" ? "Free" : planId === "starter" ? "Starter" : "Pro";
}

const AccountPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground mb-8">View your account details and subscription.</p>

          {/* Account Summary: Name + Sign-in accounts */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Basic info and sign-in accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Full name</div>
                  <div className="font-medium min-h-5">{currentUser.name || "—"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium min-h-5">{currentUser.email}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Connected providers</div>
                <div className="flex flex-wrap gap-2">
                  {currentUser.providers.map((p) => (
                    <Badge key={p} variant={p === "email" ? "secondary" : "default"}>
                      {p === "email" ? "Email" : p === "google" ? "Google" : p === "github" ? "GitHub" : p}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled title="Connect backend to enable editing">Edit account</Button>
            </CardFooter>
          </Card>

          {/* Subscription */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Your current plan and renewal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Current plan</div>
                  <div className="font-medium flex items-center gap-2">
                    {getPlanLabel(currentSubscription.planId)}
                    <Badge variant={currentSubscription.planId === "starter" ? "default" : "secondary"}>
                      {currentSubscription.planId}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="font-medium capitalize">{currentSubscription.status.replace("_", " ")}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Renews on</div>
                  <div className="font-medium">{currentSubscription.renewsOn}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="outline" disabled title="Connect billing to manage">Manage subscription</Button>
              <Button variant="secondary" disabled title="Upgrade via billing page">Upgrade</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger zone</CardTitle>
              <CardDescription>Permanently delete your account</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">This action is irreversible. All your data will be permanently removed.</p>
              <Separator />
            </CardContent>
            <CardFooter>
              <Button variant="destructive" disabled title="Connect backend to enable delete">Delete account</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;