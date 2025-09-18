import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";

const FAQPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Help Center / FAQ</h1>
          <p className="text-gray-600">Frequently asked questions will be added here.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;