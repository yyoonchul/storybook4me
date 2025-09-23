import Header from "../../shared/components/layout/Header";
import Footer from "../../shared/components/layout/Footer";
import { UserProfile } from "@clerk/clerk-react";

const AccountPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-6">Account Settings</h1>
          <UserProfile routing="path" path="/settings/account" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;