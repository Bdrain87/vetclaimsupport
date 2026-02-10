import { FileText, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfServicePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-[#3B82F6]/10 shrink-0">
          <FileText className="h-6 w-6 text-[#3B82F6]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
          <p className="text-white/40 text-sm mt-1">Vet Claim Support &mdash; Last updated: February 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 text-sm leading-relaxed">

        {/* Section 1: Agreement to Terms */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">1. Agreement to Terms</h2>
          <p className="text-white/60">
            By accessing or using Vet Claim Support (&quot;the Service&quot;, &quot;VCS&quot;, &quot;the App&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. We reserve the right to update these Terms at any time. Continued use after changes constitutes acceptance.
          </p>
        </section>

        {/* Section 2: Service Description */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">2. Service Description</h2>
          <p className="text-white/60">
            Vet Claim Support is an educational and organizational tool designed to help veterans and service members prepare and organize information related to VA disability claims. The Service provides:
          </p>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>Educational resources about VA benefits and processes</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>Health and symptom logging tools</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>Evidence organization and tracking</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>VA form drafting assistance</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>AI-powered writing suggestions</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>Rating calculators and estimators</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>C&amp;P exam preparation materials</li>
          </ul>
        </section>

        {/* Section 3: What VCS Is NOT */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">3. What VCS Is NOT &mdash; VA Accreditation Disclosure</h2>
          <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4">
            <p className="text-white/70">
              <strong className="text-white">IMPORTANT:</strong> Vet Claim Support is NOT affiliated with, endorsed by, or connected to the U.S. Department of Veterans Affairs (VA). VCS is NOT a VA-accredited representative, attorney, claims agent, or Veterans Service Organization (VSO) as defined under 38 U.S.C. &sect;&sect; 5901-5905 and 38 C.F.R. Part 14.
            </p>
          </div>
          <p className="text-white/60">
            The Service does not constitute &quot;preparation, presentation, or prosecution of claims&quot; as defined by federal law. VCS does not represent you before the VA, does not submit forms or claims to the VA on your behalf, and does not communicate with the VA on your behalf. For accredited representation, consult the VA&apos;s Office of General Counsel directory of accredited representatives at va.gov/ogc/apps/accreditation.
          </p>
        </section>

        {/* Section 4: No Professional Advice */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">4. No Professional Advice</h2>
          <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4">
            <p className="text-white/70">
              The Service does not provide legal advice, medical advice, or professional representation of any kind. We are not attorneys, medical professionals, or VA-accredited claims agents. Using the Service does not create any attorney-client, doctor-patient, or professional-client relationship.
            </p>
          </div>
          <p className="text-white/60">
            All content, including AI-generated suggestions, templates, and educational materials, is for informational and organizational purposes only. You should always consult with a qualified professional &mdash; including a VA-accredited VSO, attorney, or licensed healthcare provider &mdash; before making decisions about your VA claim.
          </p>
        </section>

        {/* Section 5: User Responsibilities and Truthfulness */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">5. User Responsibilities and Truthfulness</h2>
          <p className="text-white/60 font-medium">
            YOU ARE SOLELY RESPONSIBLE FOR:
          </p>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>(a) The accuracy and truthfulness of all information you enter into the Service</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>(b) Reviewing, editing, and verifying ALL content &mdash; including AI-generated content &mdash; before using it in any VA submission</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>(c) Ensuring any documents you submit to the VA are truthful, accurate, and complete</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>(d) Consulting with accredited professionals when appropriate</li>
            <li className="flex items-start gap-2"><span className="text-[#3B82F6] mt-0.5">&#x2022;</span>(e) Verifying current VA form versions, requirements, and deadlines</li>
          </ul>
          <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4">
            <p className="text-white/70">
              <strong className="text-white">VCS IS NOT RESPONSIBLE</strong> for any false, misleading, inaccurate, or incomplete information that you enter into or submit through the Service. Making false statements in connection with a VA claim may constitute fraud under federal law (18 U.S.C. &sect; 1001) and may result in denial of benefits, repayment demands, or criminal prosecution. You agree not to use the Service for any fraudulent, deceptive, or unlawful purpose.
            </p>
          </div>
        </section>

        {/* Section 6: Artificial Intelligence Disclosure */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">6. Artificial Intelligence Disclosure</h2>
          <p className="text-white/60">
            The Service uses Google Gemini artificial intelligence to generate suggestions, templates, and content enhancements. BY USING AI FEATURES, YOU ACKNOWLEDGE AND AGREE THAT:
          </p>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">&#x2022;</span>(a) AI-generated content may contain errors, inaccuracies, omissions, or fabricated information</li>
            <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">&#x2022;</span>(b) AI-generated case law citations, legal references, and court decisions have a documented hallucination rate of 50-88% and may be completely fabricated &mdash; you MUST independently verify ALL legal citations using official databases (Google Scholar, VA Board of Veterans&apos; Appeals decisions, or legal research services) before relying on them</li>
            <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">&#x2022;</span>(c) AI-generated content is NOT a substitute for professional legal, medical, or claims advice</li>
            <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">&#x2022;</span>(d) You are responsible for reviewing and verifying ALL AI-generated content before use</li>
            <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">&#x2022;</span>(e) Information you submit to AI features is processed by Google&apos;s Gemini API &mdash; we do not retain this data, but Google&apos;s own terms of service apply to their processing</li>
            <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">&#x2022;</span>(f) AI features are optional and the app functions fully without them</li>
            <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">&#x2022;</span>(g) VCS makes no warranty as to the accuracy, completeness, or reliability of any AI-generated content</li>
          </ul>
        </section>

        {/* Section 7: Case Law and Legal Citations Warning */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">7. Case Law and Legal Citations Warning</h2>
          <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
            <p className="text-white/70">
              Any case law citations, BVA decisions, Federal Circuit rulings, or legal authorities generated by this Service are produced by artificial intelligence and <strong className="text-amber-400">ARE NOT VERIFIED</strong>. AI systems are known to fabricate case names, citation numbers, holdings, and legal reasoning that do not exist in any court database.
            </p>
          </div>
          <p className="text-white/60">
            DO NOT submit AI-generated legal citations to the VA, a court, or any official body without first independently verifying each citation using official legal databases. Submitting fabricated legal citations may harm your credibility, result in claim denial, or constitute fraud. VCS bears no responsibility for any consequences arising from reliance on unverified AI-generated legal citations.
          </p>
        </section>

        {/* Section 8: Nexus Letter and Medical Document Templates */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">8. Nexus Letter and Medical Document Templates</h2>
          <p className="text-white/60">
            The Service may provide templates or AI-assisted drafts related to nexus letters, medical opinions, or other medical documentation. These templates are for reference and organizational purposes ONLY. A valid nexus letter MUST be completed and signed by a licensed medical professional (MD, DO, NP, or PA) who has reviewed your medical records. The VA will not accept unsigned nexus letters or those not authored by a qualified healthcare provider. Do not submit any unsigned template generated by this Service to the VA.
          </p>
        </section>

        {/* Section 9: C&P Exam Preparation */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">9. C&amp;P Exam Preparation</h2>
          <p className="text-white/60">
            C&amp;P exam preparation materials are provided to help you organize your symptoms and medical history for your VA Compensation and Pension examination. These materials are NOT intended to coach you on how to present symptoms, exaggerate conditions, or mislead VA examiners. You must be truthful and accurate during your C&amp;P examination. Misrepresentation during a C&amp;P exam may result in denial of benefits and potential fraud charges.
          </p>
        </section>

        {/* Section 10: Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">10. Limitation of Liability</h2>
          <p className="text-white/60 uppercase font-medium">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
          <p className="text-white/60">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, VCS AND ITS OWNER, OPERATORS, AND AFFILIATES SHALL NOT BE LIABLE FOR:
          </p>
          <ul className="space-y-1.5 text-white/60">
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2022;</span>(a) Any VA claim decisions, ratings, denials, or outcomes</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2022;</span>(b) Any errors, inaccuracies, or omissions in AI-generated content</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2022;</span>(c) Any damages arising from your reliance on the Service</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2022;</span>(d) Any loss of data</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2022;</span>(e) Any consequences of submitting information to the VA</li>
            <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#x2022;</span>(f) Any indirect, incidental, special, consequential, or punitive damages</li>
          </ul>
          <p className="text-white/60 font-medium">
            OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SERVICE.
          </p>
        </section>

        {/* Section 11: Indemnification */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">11. Indemnification</h2>
          <p className="text-white/60">
            You agree to indemnify, defend, and hold harmless VCS, its owner, operators, and affiliates from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising from: (a) your use of the Service; (b) your violation of these Terms; (c) any information you submit to the VA or any third party; (d) any claim that your use of the Service caused harm to a third party.
          </p>
        </section>

        {/* Section 12: No Guarantee of Outcomes */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">12. No Guarantee of Outcomes</h2>
          <p className="text-white/60">
            VCS does not guarantee any specific claim outcomes, ratings, approvals, or monetary awards. VA claim decisions are made solely by the U.S. Department of Veterans Affairs based on their review of evidence, applicable law, and medical evaluations. Past results or examples shown in the app do not predict future outcomes.
          </p>
        </section>

        {/* Section 13: Payment and Lifetime Access */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">13. Payment and Lifetime Access</h2>
          <p className="text-white/60">
            If you purchase VCS, &quot;lifetime access&quot; means access for the operational lifetime of the Service, not the lifetime of the user. If the Service is discontinued, we will provide at least 30 days notice and data export capabilities. Payment is processed through Apple App Store or Google Play Store &mdash; VCS does not collect or store your payment card information.
          </p>
        </section>

        {/* Section 14: Data and Privacy */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">14. Data and Privacy</h2>
          <p className="text-white/60">
            Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection and use of information as described in the Privacy Policy.
          </p>
        </section>

        {/* Section 15: Dispute Resolution and Governing Law */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">15. Dispute Resolution and Governing Law</h2>
          <p className="text-white/60">
            These Terms are governed by the laws of the State of Michigan, without regard to conflict of law principles. Any dispute arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, conducted in the State of Michigan. You agree to waive any right to participate in a class action lawsuit or class-wide arbitration against VCS.
          </p>
        </section>

        {/* Section 16: Severability */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">16. Severability</h2>
          <p className="text-white/60">
            If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.
          </p>
        </section>

        {/* Section 17: Entire Agreement */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">17. Entire Agreement</h2>
          <p className="text-white/60">
            These Terms, together with the Privacy Policy and Disclaimer, constitute the entire agreement between you and VCS regarding the Service.
          </p>
        </section>

        {/* Section 18: Contact */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">18. Contact</h2>
          <p className="text-white/60">
            Questions about these Terms:{' '}
            <a href="mailto:blakedrain@gmail.com" className="text-[#3B82F6] hover:underline">
              blakedrain@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
