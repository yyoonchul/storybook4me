import { HeroSection } from "./HeroSection"
import { ProblemSection } from "./ProblemSection"
import { SolutionSection } from "./SolutionSection"
import { DifferentiatorsSection } from "./DifferentiatorsSection"
import { SocialProofSection } from "./SocialProofSection"
import { FinalCTASection } from "./FinalCTASection"

export const LandingPage = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <DifferentiatorsSection />
      <SocialProofSection />
      <FinalCTASection />
    </main>
  )
}
