import { FileText, ChevronLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/PageContainer';
import { LEGAL_VERSIONS, formatLegalDate, ADMIN_EMAIL } from '@/data/legalCopy';

export default function TermsOfServicePage() {
  const navigate = useNavigate();

  return (
    <PageContainer className="space-y-6 animate-fade-in py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Effective Date Banner */}
      <div className="rounded-lg bg-gold/5 border border-gold/20 px-4 py-2 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Effective:</span> {formatLegalDate(LEGAL_VERSIONS.terms.effectiveDate)} &middot; Version {LEGAL_VERSIONS.terms.version}
      </div>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-gold/10 shrink-0">
          <FileText className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground/70 text-sm mt-1">Vet Claim Support &mdash; Version {LEGAL_VERSIONS.terms.version} &mdash; Effective {formatLegalDate(LEGAL_VERSIONS.terms.effectiveDate)}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 text-sm leading-relaxed">

        {/* Section 1: Agreement to Terms */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Agreement to Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using Vet Claim Support (&quot;the Service&quot;, &quot;VCS&quot;, &quot;the App&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. We reserve the right to update these Terms at any time. Continued use after changes constitutes acceptance.
          </p>
        </section>

        {/* Section 2: Service Description */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">2. Service Description</h2>
          <p className="text-muted-foreground">
            Vet Claim Support is an educational and organizational tool designed to help veterans and service members prepare and organize information related to VA disability claims. The Service provides:
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>Educational resources about VA benefits and processes</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>Health and symptom logging tools</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>Evidence organization and tracking</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>Educational templates and organizational worksheets (VCS does not prepare, present, or prosecute claims as defined under 38 C.F.R. &sect; 14.629)</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>AI-powered writing suggestions</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>Rating calculators and estimators</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>C&amp;P exam preparation materials</li>
          </ul>
        </section>

        {/* Section 3: What VCS Is NOT */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">3. What VCS Is NOT &mdash; VA Accreditation Disclosure</h2>
          <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4">
            <p className="text-muted-foreground">
              <strong className="text-foreground">IMPORTANT:</strong> Vet Claim Support is NOT affiliated with, endorsed by, or connected to the U.S. Department of Veterans Affairs (VA). VCS is NOT a VA-accredited representative, attorney, claims agent, or Veterans Service Organization (VSO) as defined under 38 U.S.C. &sect;&sect; 5901-5905 and 38 C.F.R. Part 14. VCS does not engage in the &quot;preparation, presentation, or prosecution&quot; of VA claims as those terms are defined under 38 C.F.R. &sect; 14.629.
            </p>
          </div>
          <p className="text-muted-foreground">
            The Service does not constitute &quot;preparation, presentation, or prosecution of claims&quot; as defined by federal law. VCS does not represent you before the VA, does not submit forms or claims to the VA on your behalf, and does not communicate with the VA on your behalf. For accredited representation, consult the VA&apos;s Office of General Counsel directory of accredited representatives at va.gov/ogc/apps/accreditation.
          </p>
        </section>

        {/* Section 4: No Professional Advice */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">4. No Professional Advice</h2>
          <div className="rounded-xl bg-gold/5 border border-gold/20 p-4">
            <p className="text-muted-foreground">
              The Service does not provide legal advice, medical advice, or professional representation of any kind. We are not attorneys, medical professionals, or VA-accredited claims agents. Using the Service does not create any attorney-client, doctor-patient, or professional-client relationship.
            </p>
          </div>
          <p className="text-muted-foreground">
            All content, including AI-generated suggestions, templates, and educational materials, is for informational and organizational purposes only. You should always consult with a qualified professional &mdash; including a VA-accredited VSO, attorney, or licensed healthcare provider &mdash; before making decisions about your VA claim.
          </p>
        </section>

        {/* Section 5: User Responsibilities and Truthfulness */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">5. User Responsibilities and Truthfulness</h2>
          <p className="text-muted-foreground font-medium">
            YOU ARE SOLELY RESPONSIBLE FOR:
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(a) The accuracy and truthfulness of all information you enter into the Service</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(b) Reviewing, editing, and verifying ALL content &mdash; including AI-generated content &mdash; before using it in any VA submission</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(c) Ensuring any documents you submit to the VA are truthful, accurate, and complete</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(d) Consulting with accredited professionals when appropriate</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(e) Verifying current VA form versions, requirements, and deadlines</li>
          </ul>
          <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4">
            <p className="text-muted-foreground">
              <strong className="text-foreground">VCS IS NOT RESPONSIBLE</strong> for any false, misleading, inaccurate, or incomplete information that you enter into or submit through the Service. Making false statements in connection with a VA claim may constitute fraud under federal law (18 U.S.C. &sect; 1001) and may result in denial of benefits, repayment demands, or criminal prosecution. You agree not to use the Service for any fraudulent, deceptive, or unlawful purpose.
            </p>
          </div>
        </section>

        {/* Section 6: Artificial Intelligence Disclosure */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Artificial Intelligence Disclosure</h2>
          <p className="text-muted-foreground">
            The Service uses a third-party AI service provider (currently Google Gemini) to generate suggestions, templates, and content enhancements. BY USING AI FEATURES, YOU ACKNOWLEDGE AND AGREE THAT:
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(a) AI-generated content may contain errors, inaccuracies, omissions, or fabricated information</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(b) AI output can be inaccurate or fabricated. AI-generated case law citations, legal references, and court decisions are frequently fabricated and may be completely fabricated &mdash; you MUST independently verify ALL legal citations using official databases (Google Scholar, VA Board of Veterans&apos; Appeals decisions, or legal research services) before relying on them</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(c) AI-generated content is NOT a substitute for professional legal, medical, or claims advice</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(d) You are responsible for reviewing and verifying ALL AI-generated content before use</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(e) Information you submit to AI features is processed by our third-party AI service provider (currently Google&apos;s Gemini API) &mdash; we do not retain this data, but the provider&apos;s own terms of service apply to their processing</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(f) AI features are optional and the app functions fully without them</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(g) VCS makes no warranty as to the accuracy, completeness, or reliability of any AI-generated content</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-0.5">&#x2022;</span>(h) AI-generated content should NOT be submitted to the VA or any other party without thorough personal review and editing &mdash; all AI outputs are drafts intended as starting points, not finished documents</li>
          </ul>
        </section>

        {/* Section 7: Case Law and Legal Citations Warning */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">7. Case Law and Legal Citations Warning</h2>
          <div className="rounded-xl bg-gold/5 border border-gold/20 p-4 space-y-3">
            <p className="text-muted-foreground">
              <strong className="text-foreground">Verified Case Law Database:</strong> The Appeals Guide&apos;s &quot;My Appeal&quot; and &quot;Case Law&quot; tabs retrieve citations from a curated database of real BVA, CAVC, Federal Circuit, and Supreme Court decisions. These citations include source URLs to official court records. However, case law summaries have been simplified and may not capture every nuance of a ruling. Laws, regulations, and case interpretations can change over time.
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">AI-Generated Content:</strong> Other AI-powered features in this Service use a third-party AI service provider (currently Google Gemini), which may fabricate case names, citation numbers, holdings, and legal reasoning. AI-generated case law citations are frequently fabricated and <strong className="text-gold">ARE NOT VERIFIED</strong>.
            </p>
          </div>
          <p className="text-muted-foreground">
            Regardless of the source, you MUST independently verify ALL legal citations using official databases (Google Scholar, the Court of Appeals for Veterans Claims website, Westlaw, or the VA&apos;s digital library) before relying on them in any filing. Submitting inaccurate legal citations may harm your credibility, result in claim denial, or constitute fraud. VCS bears no responsibility for any consequences arising from reliance on any legal citations provided by this Service.
          </p>
        </section>

        {/* Section 8: Doctor Summary and Medical Document Templates */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">8. Doctor Summary and Medical Document Templates</h2>
          <p className="text-muted-foreground">
            The Service may provide templates or AI-assisted drafts related to doctor summaries, medical opinions, or other medical documentation. These templates are for reference and organizational purposes ONLY. A valid nexus letter MUST be completed and signed by a licensed medical professional (MD, DO, NP, or PA) who has reviewed your medical records. The VA will not accept unsigned nexus letters or those not authored by a qualified healthcare provider. Do not submit any unsigned template generated by this Service to the VA.
          </p>
        </section>

        {/* Section 9: C&P Exam Preparation */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">9. C&amp;P Exam Preparation</h2>
          <p className="text-muted-foreground">
            C&amp;P exam preparation materials are provided to help you organize your symptoms and medical history for your VA Compensation and Pension examination. These materials are NOT intended to coach you on how to present symptoms, exaggerate conditions, or mislead VA examiners. You must be truthful and accurate during your C&amp;P examination. Misrepresentation during a C&amp;P exam may result in denial of benefits and potential fraud charges.
          </p>
        </section>

        {/* Section 10: Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">10. Limitation of Liability</h2>
          <p className="text-muted-foreground uppercase font-medium">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
          <p className="text-muted-foreground">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, VCS AND ITS OWNER, OPERATORS, AND AFFILIATES SHALL NOT BE LIABLE FOR:
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-destructive mt-0.5">&#x2022;</span>(a) Any VA claim decisions, ratings, denials, or outcomes</li>
            <li className="flex items-start gap-2"><span className="text-destructive mt-0.5">&#x2022;</span>(b) Any errors, inaccuracies, or omissions in AI-generated content</li>
            <li className="flex items-start gap-2"><span className="text-destructive mt-0.5">&#x2022;</span>(c) Any damages arising from your reliance on the Service</li>
            <li className="flex items-start gap-2"><span className="text-destructive mt-0.5">&#x2022;</span>(d) Any loss of data</li>
            <li className="flex items-start gap-2"><span className="text-destructive mt-0.5">&#x2022;</span>(e) Any consequences of submitting information to the VA</li>
            <li className="flex items-start gap-2"><span className="text-destructive mt-0.5">&#x2022;</span>(f) Any indirect, incidental, special, consequential, or punitive damages</li>
          </ul>
          <p className="text-muted-foreground font-medium">
            OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SERVICE.
          </p>
        </section>

        {/* Section 11: Indemnification */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">11. Indemnification</h2>
          <p className="text-muted-foreground">
            You agree to indemnify, defend, and hold harmless VCS, its owner, operators, and affiliates from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising from: (a) your use of the Service; (b) your violation of these Terms; (c) any information you submit to the VA or any third party; (d) any claim that your use of the Service caused harm to a third party.
          </p>
        </section>

        {/* Section 12: No Guarantee of Outcomes */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">12. No Guarantee of Outcomes</h2>
          <p className="text-muted-foreground">
            VCS does not guarantee any specific claim outcomes, ratings, approvals, or monetary awards. VA claim decisions are made solely by the U.S. Department of Veterans Affairs based on their review of evidence, applicable law, and medical evaluations. Past results or examples shown in the app do not predict future outcomes.
          </p>
        </section>

        {/* Section 13: Payment and Premium Access */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">13. Payment and Premium Access</h2>
          <p className="text-muted-foreground">
            VCS offers a free tier with limited features and a paid <strong className="text-foreground">Premium</strong> tier available as a <strong className="text-foreground">one-time purchase of $9.99</strong>. Premium access is permanent and does not require a recurring subscription.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">One-Time Payment.</strong> By purchasing Premium, you make a single payment that grants you permanent access to all current Premium features. There are no recurring charges, monthly fees, or automatic renewals.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Refund Policy.</strong> You may request a full refund within <strong className="text-foreground">7 days</strong> of purchase by contacting <a href={`mailto:${ADMIN_EMAIL}`} className="text-primary underline">{ADMIN_EMAIL}</a>. After 7 days, all sales are final. Upon refund, your Premium access will be revoked.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Payment Processing.</strong> All payments are processed securely by <strong className="text-foreground">Stripe, Inc.</strong> VCS does not directly collect, store, or have access to your full payment card information. Your use of Stripe&apos;s services is subject to <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer" className="text-primary underline">Stripe&apos;s Terms of Service</a> and <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Privacy Policy</a>.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Feature Scope.</strong> Your purchase grants access to all Premium features available at the time of purchase. Future features or major new modules may be offered separately and are not guaranteed to be included in your existing purchase.
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Service Discontinuation.</strong> If the Service is discontinued, we will provide at least 30 days&apos; notice and data export capabilities.
          </p>
        </section>

        {/* Section 14: Data and Privacy */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">14. Data and Privacy</h2>
          <p className="text-muted-foreground">
            Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection and use of information as described in the Privacy Policy.
          </p>
        </section>

        {/* Section 15: Dispute Resolution and Governing Law */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">15. Dispute Resolution and Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms are governed by the laws of the State of Michigan, without regard to conflict of law principles. Any dispute arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, conducted in the State of Michigan. Either party may bring an individual action in small claims court in lieu of arbitration, provided the claim falls within the court&apos;s jurisdictional limits. You agree to waive any right to participate in a class action lawsuit or class-wide arbitration against VCS.
          </p>
        </section>

        {/* Section 16: Severability */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">16. Severability</h2>
          <p className="text-muted-foreground">
            If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.
          </p>
        </section>

        {/* Section 17: Entire Agreement */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">17. Entire Agreement</h2>
          <p className="text-muted-foreground">
            These Terms, together with the Privacy Policy and Disclaimer, constitute the entire agreement between you and VCS regarding the Service.
          </p>
        </section>

        {/* Section 18: Contact */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">18. Contact</h2>
          <p className="text-muted-foreground">
            Questions about these Terms:{' '}
            <a href={`mailto:${ADMIN_EMAIL}`} className="text-gold hover:underline">
              {ADMIN_EMAIL}
            </a>
          </p>
        </section>

        {/* Last Updated */}
        <div className="space-y-3 pt-4 border-t border-border">
          <p className="text-muted-foreground/70 text-xs">
            Last updated: {formatLegalDate(LEGAL_VERSIONS.terms.effectiveDate)}
          </p>
          <p className="text-muted-foreground/70 text-xs flex items-center gap-1">
            <Mail className="h-3 w-3" />
            For legal requests: <a href={`mailto:${ADMIN_EMAIL}`} className="text-gold hover:underline">{ADMIN_EMAIL}</a>
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
