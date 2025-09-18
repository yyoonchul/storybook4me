import { useSearchParams } from "react-router-dom";
import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";

const StudioPage = () => {
  const [searchParams] = useSearchParams();
  const prompt = searchParams.get("prompt");

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Creation Studio</h1>
          {prompt && (
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">Entered prompt:</p>
              <p className="font-medium">{prompt}</p>
            </div>
          )}
          <p className="text-gray-600">Book creation features will be added here.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudioPage;