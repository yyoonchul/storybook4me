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
import FamilyPage from "./pages/FamilyPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";
import { LandingPage } from "@/features/landing";
import { AuthProvider } from "./shared/lib/auth";
import { useScrollToTop } from "./shared/hooks/useScrollToTop";


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTopWrapper />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/welcome" element={<WelcomePage />} />
              {/* Removed standalone Bookshelf/Family routes; handled by main page section scroll */}
              <Route path="/family" element={<FamilyPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/studio" element={<StudioPage />} />
              <Route path="/studio/:id" element={<StudioPage />} />
              <Route path="/book/:id" element={<BookViewerPage />} />
              <Route path="/settings/account" element={<AccountPage />} />
              <Route path="/settings/billing" element={<BillingPage />} />
              <Route path="/family/character/:id" element={<CharacterFormPage />} />
              <Route path="/about" element={<LandingPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
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
