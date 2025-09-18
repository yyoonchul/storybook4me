import Header from "../../shared/components/layout/Header";
import Footer from "../../shared/components/layout/Footer";

const AccountPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Account Settings</h1>
          <p className="text-gray-600">Account settings features will be added here.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;