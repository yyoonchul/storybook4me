import Header from "../../shared/components/layout/Header";
import Footer from "../../shared/components/layout/Footer";

const BillingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Billing & Subscription</h1>
          <p className="text-gray-600">Payment and subscription management features will be added here.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BillingPage;