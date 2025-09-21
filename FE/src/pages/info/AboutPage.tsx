import Header from "../../shared/components/layout/Header";
import Footer from "../../shared/components/layout/Footer";
import HeroSection from "../../features/landing/components/HeroSection";
import ProblemSection from "../../features/landing/components/ProblemSection";
import UseCasesSection from "../../features/landing/components/UseCasesSection";
import SolutionSection from "../../features/landing/components/SolutionSection";
import DifferentiatorsSection from "../../features/landing/components/DifferentiatorsSection";
import SocialProofSection from "../../features/landing/components/SocialProofSection";
import FinalCTASection from "../../features/landing/components/FinalCTASection";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
    </div>
  );
};

export default AboutPage;
