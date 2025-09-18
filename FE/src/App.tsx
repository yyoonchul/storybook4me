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
import AccountPage from "./pages/settings/AccountPage";
import BillingPage from "./pages/settings/BillingPage";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          {/* Removed standalone Bookshelf/Family routes; handled by main page section scroll */}
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/settings/account" element={<AccountPage />} />
          <Route path="/settings/billing" element={<BillingPage />} />
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

export default App;
