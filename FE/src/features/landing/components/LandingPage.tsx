import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";
import HeroSection from "./HeroSection";
import ProblemSection from "./ProblemSection";
import UseCasesSection from "./UseCasesSection";
import SolutionSection from "./SolutionSection";
import DifferentiatorsSection from "./DifferentiatorsSection";
import SocialProofSection from "./SocialProofSection";
import FinalCTASection from "./FinalCTASection";

const LandingPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <ProblemSection />
        <UseCasesSection />
        <SolutionSection />
        <DifferentiatorsSection />
        <SocialProofSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
