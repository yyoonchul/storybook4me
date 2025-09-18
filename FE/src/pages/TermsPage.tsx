import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>

          <nav aria-label="Table of contents" className="border rounded-md p-4 mb-8 text-sm">
            <p className="font-medium mb-2">Contents</p>
            <ol className="list-decimal ps-5 space-y-1">
              <li><a href="#purpose" className="underline">Purpose</a></li>
              <li><a href="#definitions" className="underline">Definitions</a></li>
              <li><a href="#changes" className="underline">Changes to the Terms</a></li>
              <li><a href="#accounts" className="underline">Accounts and Security</a></li>
              <li><a href="#provision" className="underline">Provision and Changes to the Service</a></li>
              <li><a href="#fees" className="underline">Fees and Payments</a></li>
              <li><a href="#obligations" className="underline">User Obligations</a></li>
              <li><a href="#ip" className="underline">Intellectual Property</a></li>
              <li><a href="#third-party" className="underline">Third-Party Services</a></li>
              <li><a href="#privacy" className="underline">Privacy</a></li>
              <li><a href="#termination" className="underline">Termination and Suspension</a></li>
              <li><a href="#disclaimers" className="underline">Disclaimers</a></li>
              <li><a href="#liability" className="underline">Limitation of Liability</a></li>
              <li><a href="#indemnification" className="underline">Indemnification</a></li>
              <li><a href="#law" className="underline">Governing Law and Dispute Resolution</a></li>
              <li><a href="#misc" className="underline">Miscellaneous</a></li>
              <li><a href="#effective" className="underline">Effective Date</a></li>
            </ol>
          </nav>

          <div className="prose prose-neutral max-w-none text-base md:text-lg leading-relaxed space-y-6">
            <p>These Terms of Service (the "Terms") govern your access to and use of our websites, applications, and related services (collectively, the "Service"). Please read these Terms carefully before using the Service.</p>

            <hr />

            <h2 id="purpose" className="mt-10 scroll-mt-24 text-xl font-semibold">1. Purpose</h2>
            <p>These Terms establish the rights, obligations, and responsibilities between the Service provider ("Company") and users of the Service ("User").</p>

            <h2 id="definitions" className="mt-10 scroll-mt-24 text-xl font-semibold">2. Definitions</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>"Service" means all online and mobile products, features, and content provided by the Company.</li>
              <li>"User" means any individual or entity who agrees to these Terms and uses the Service.</li>
              <li>"Account" means the profile and credentials created by a User to access the Service.</li>
              <li>"Content" means any data, text, images, files, or materials uploaded, posted, or transmitted on the Service by a User or the Company.</li>
            </ul>

            <h2 id="changes" className="mt-10 scroll-mt-24 text-xl font-semibold">3. Changes to the Terms</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>The Company may modify these Terms to the extent permitted by applicable law. If we make material changes, we will provide notice by posting the updated Terms and updating the effective date.</li>
              <li>By continuing to use the Service after the effective date of the updated Terms, you agree to the changes.</li>
            </ul>

            <h2 id="accounts" className="mt-10 scroll-mt-24 text-xl font-semibold">4. Accounts and Security</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>You must provide accurate and up-to-date information when creating an Account, and you are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your Account.</li>
              <li>If you suspect unauthorized use of your Account, you must notify the Company promptly.</li>
            </ul>

            <h2 id="provision" className="mt-10 scroll-mt-24 text-xl font-semibold">5. Provision and Changes to the Service</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>We strive to provide the Service 24/7; however, maintenance or events beyond our control may interrupt availability.</li>
              <li>We may change, suspend, or discontinue all or part of the Service at any time. For material changes, we will provide reasonable advance notice where practicable.</li>
            </ul>

            <h2 id="fees" className="mt-10 scroll-mt-24 text-xl font-semibold">6. Fees and Payments</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>Fees, billing cycles, payment methods, and refund policies for paid features are described in the Service or applicable policies.</li>
              <li>Refunds, where applicable, follow our refund policy and applicable laws. Promotional or trial benefits may be excluded from refunds.</li>
            </ul>

            <h2 id="obligations" className="mt-10 scroll-mt-24 text-xl font-semibold">7. User Obligations</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>Users must comply with applicable laws, these Terms, posted policies, and any guidelines we provide in connection with the Service.</li>
              <li>Users may not post or transmit unlawful, harmful, discriminatory, violent, sexually explicit, or infringing Content, or violate third-party rights.</li>
              <li>Users may not interfere with the normal operation of the Service, including by reverse engineering, breaching technical limitations, circumventing access controls, abusive automation, or unauthorized scraping.</li>
            </ul>

            <h2 id="ip" className="mt-10 scroll-mt-24 text-xl font-semibold">8. Intellectual Property</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>The Service and all related software, designs, trademarks, and logos are owned by the Company or its licensors and are protected by intellectual property laws.</li>
              <li>Users retain ownership of their Content. By submitting Content to the Service, Users grant the Company a non-exclusive, worldwide, royalty-free license to use, host, store, reproduce, modify, and display such Content solely for operating, improving, and promoting the Service.</li>
            </ul>

            <h2 id="third-party" className="mt-10 scroll-mt-24 text-xl font-semibold">9. Third-Party Services</h2>
            <p>The Service may integrate with third-party platforms or APIs. Your use of third-party services is governed by the terms and policies of those providers, and the Company is not responsible for their actions or Content.</p>

            <h2 id="privacy" className="mt-10 scroll-mt-24 text-xl font-semibold">10. Privacy</h2>
            <p>We process personal information in accordance with our <a href="/privacy" className="underline">Privacy Policy</a>. Please review it to understand how we collect, use, and share information.</p>

            <h2 id="termination" className="mt-10 scroll-mt-24 text-xl font-semibold">11. Termination and Suspension</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>We may suspend or terminate access to the Service immediately, without notice, if a User violates these Terms or our policies, or if required to protect the Service or others.</li>
              <li>We may also remove or disable Content believed to be unlawful or in violation of these Terms.</li>
            </ul>

            <h2 id="disclaimers" className="mt-10 scroll-mt-24 text-xl font-semibold">12. Disclaimers</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. To the maximum extent permitted by law, the Company disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.</li>
              <li>The Company does not guarantee that the Service will be uninterrupted, secure, or error-free.</li>
            </ul>

            <h2 id="liability" className="mt-10 scroll-mt-24 text-xl font-semibold">13. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, the Company will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, revenues, profits, or business opportunities, arising out of or related to your use of the Service, whether based on warranty, contract, tort, or any other legal theory, and whether or not the Company has been informed of the possibility of such damage.</p>

            <h2 id="indemnification" className="mt-10 scroll-mt-24 text-xl font-semibold">14. Indemnification</h2>
            <p>You agree to indemnify and hold the Company and its affiliates, officers, agents, and employees harmless from any claims, losses, liabilities, damages, and expenses (including reasonable attorneys' fees) arising from your use of the Service, your Content, or your violation of these Terms or applicable law.</p>

            <h2 id="law" className="mt-10 scroll-mt-24 text-xl font-semibold">15. Governing Law and Dispute Resolution</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>These Terms are governed by the laws of the State of Delaware, without regard to its conflict of laws principles.</li>
              <li>Any disputes will be resolved in the state or federal courts located in Delaware, and you consent to the jurisdiction and venue of such courts.</li>
            </ul>

            <h2 id="misc" className="mt-10 scroll-mt-24 text-xl font-semibold">16. Miscellaneous</h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>If any provision of these Terms is found unenforceable, the remaining provisions will remain in full force and effect.</li>
              <li>Failure by the Company to enforce a provision is not a waiver of its right to do so later.</li>
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

export default TermsPage;