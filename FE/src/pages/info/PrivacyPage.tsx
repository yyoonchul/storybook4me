import Header from "../../shared/components/layout/Header";
import Footer from "../../shared/components/layout/Footer";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

          <nav aria-label="Table of contents" className="border rounded-md p-4 mb-8 text-sm">
            <p className="font-medium mb-2">Contents</p>
            <ol className="list-decimal ps-5 space-y-1">
              <li><a href="#intro" className="underline">Overview</a></li>
              <li><a href="#collect" className="underline">Information We Collect</a></li>
              <li><a href="#how-collect" className="underline">How We Collect Information</a></li>
              <li><a href="#use" className="underline">How We Use Information</a></li>
              <li><a href="#legal" className="underline">Legal Bases</a></li>
              <li><a href="#retention" className="underline">Retention</a></li>
              <li><a href="#sharing" className="underline">Sharing and Disclosure</a></li>
              <li><a href="#transfers" className="underline">International Transfers</a></li>
              <li><a href="#cookies" className="underline">Cookies and Tracking</a></li>
              <li><a href="#rights" className="underline">Your Rights</a></li>
              <li><a href="#security" className="underline">Security</a></li>
              <li><a href="#children" className="underline">Children's Privacy</a></li>
              <li><a href="#contact" className="underline">Data Protection Contact</a></li>
              <li><a href="#changes" className="underline">Changes to This Policy</a></li>
              <li><a href="#effective" className="underline">Effective Date</a></li>
            </ol>
          </nav>

          <div className="prose prose-neutral max-w-none text-base md:text-lg leading-relaxed space-y-6">
            <p id="intro">This Privacy Policy explains how we collect, use, disclose, and protect personal information when you use our websites, applications, and related services (collectively, the "Service").</p>

            <hr />

            <h2 id="collect" className="mt-10 scroll-mt-24 text-xl font-semibold">1. Information We Collect</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>Account Information: email address, password, display name, and optional contact details you provide.</li>
              <li>Usage Information: activity logs, pages or features used, cookies, IP address, and device information (browser, OS, device identifiers).</li>
              <li>Payment Information (for paid features): payment method details processed by our payment processor, billing and transaction records.</li>
              <li>Support Information: messages, attachments, and contact information provided when you contact support.</li>
            </ul>

            <h2 id="how-collect" className="mt-10 scroll-mt-24 text-xl font-semibold">2. How We Collect Information</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>Directly from you when you register, update settings, or communicate with us.</li>
              <li>Automatically through cookies, pixels, SDKs, and similar technologies during your use of the Service.</li>
              <li>From third-party integrations (e.g., social login, payment processors) as authorized by you.</li>
            </ul>

            <h2 id="use" className="mt-10 scroll-mt-24 text-xl font-semibold">3. How We Use Information</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>To provide, maintain, and improve the Service, including account creation and authentication.</li>
              <li>To communicate with you about updates, security alerts, and support responses.</li>
              <li>To process payments, issue refunds, and manage billing.</li>
              <li>To ensure security, detect and prevent fraud or abuse.</li>
              <li>To analyze usage, develop new features, and improve performance.</li>
              <li>To comply with legal obligations and resolve disputes.</li>
            </ul>

            <h2 id="legal" className="mt-10 scroll-mt-24 text-xl font-semibold">4. Legal Bases for Processing</h2>
            <p>Depending on your location, our legal bases may include performance of a contract, legitimate interests, consent, and compliance with legal obligations.</p>

            <h2 id="retention" className="mt-10 scroll-mt-24 text-xl font-semibold">5. Retention</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>We retain personal information for as long as needed to provide the Service and as required by law. Certain records (e.g., transaction or access logs) may be retained for the legal retention periods applicable in your jurisdiction.</li>
            </ul>

            <h2 id="sharing" className="mt-10 scroll-mt-24 text-xl font-semibold">6. Sharing and Disclosure</h2>
            <p>We do not sell personal information. We share information with service providers who perform services on our behalf (such as cloud hosting, analytics, and payment processing) under appropriate contracts, and we may disclose information when required by law or to protect rights, safety, and security.</p>

            <h2 id="transfers" className="mt-10 scroll-mt-24 text-xl font-semibold">7. International Transfers</h2>
            <p>Your information may be transferred to and processed in countries other than your own, including the United States. Where required, we will implement appropriate safeguards for such transfers.</p>

            <h2 id="cookies" className="mt-10 scroll-mt-24 text-xl font-semibold">8. Cookies and Tracking Technologies</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>We use cookies and similar technologies to operate the Service, remember preferences, and analyze usage.</li>
              <li>You can control cookies through your browser settings, but some features may not function properly if you disable cookies.</li>
            </ul>

            <h2 id="rights" className="mt-10 scroll-mt-24 text-xl font-semibold">9. Your Rights</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>You may request access to, correction of, deletion of, or restriction of processing of your personal information, and, where applicable, data portability.</li>
              <li>You may object to processing based on legitimate interests and withdraw consent where consent is the basis for processing.</li>
            </ul>

            <h2 id="security" className="mt-10 scroll-mt-24 text-xl font-semibold">10. Security</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>We implement reasonable technical and organizational measures to protect personal information, including encryption, access controls, monitoring, and backups.</li>
              <li>Access to personal information is limited to personnel with a need to know.</li>
            </ul>

            <h2 id="children" className="mt-10 scroll-mt-24 text-xl font-semibold">11. Children's Privacy</h2>
            <p>The Service is not directed to children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete it.</p>

            <h2 id="contact" className="mt-10 scroll-mt-24 text-xl font-semibold">12. Data Protection Contact</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>Privacy Contact: privacy@storybook4.me (example)</li>
              <li>Address: Company address (example)</li>
            </ul>

            <h2 id="changes" className="mt-10 scroll-mt-24 text-xl font-semibold">13. Changes to This Policy</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>We may update this Policy from time to time. Material changes will be announced via in-product notices or email prior to the effective date.</li>
            </ul>

            <h2 id="effective" className="mt-10 scroll-mt-24 text-xl font-semibold">Effective Date</h2>
            <ul className="list-disc ps-6">
              <li>Effective date: September 18, 2025</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
