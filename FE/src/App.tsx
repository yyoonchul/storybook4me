import { Toaster } from "./shared/components/ui/toaster";
import { Toaster as Sonner } from "./shared/components/ui/sonner";
import { TooltipProvider } from "./shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import WelcomePage from "./pages/WelcomePage";
import ExplorePage from "./pages/ExplorePage";
import PricingPage from "./pages/PricingPage";
import StudioPage from "./pages/StudioPage";
import BookViewerPage from "./pages/BookViewerPage";
import AccountPage from "./pages/settings/AccountPage";
import BillingPage from "./pages/settings/BillingPage";
import CharacterFormPage from "./pages/family/CharacterFormPage";
import AboutPage from "./pages/info/AboutPage";
import FAQPage from "./pages/info/FAQPage";
import ContactPage from "./pages/info/ContactPage";
import TermsPage from "./pages/info/TermsPage";
import PrivacyPage from "./pages/info/PrivacyPage";
import NotFound from "./pages/NotFound";
import { LandingPage } from "@/features/landing";
// Clerk is provided at root in main.tsx; remove legacy AuthProvider
import { useScrollToTop } from "./shared/hooks/useScrollToTop";


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <ScrollToTopWrapper />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/welcome" element={<WelcomePage />} />
              {/* Family handled within MainPage's section; no standalone /family route */}
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/studio" element={<StudioPage />} />
              <Route path="/studio/:id" element={<StudioPage />} />
              <Route path="/book/:id" element={<BookViewerPage />} />
              <Route path="/settings/account" element={<AccountPage />} />
              <Route path="/settings/billing" element={<BillingPage />} />
              <Route path="/family/character/:id" element={<CharacterFormPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Wrapper component to use the hook inside BrowserRouter
const ScrollToTopWrapper = () => {
  useScrollToTop();
  return null;
};

export default App;
