import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Terms & Conditions',
  description:
    'Terms of service for development engagements with Sadik — pricing, payment milestones, IP assignment, refund policy, liability, and governing law.',
  path: '/terms',
});

const EFFECTIVE_DATE = 'April 14, 2026';
const LAST_UPDATED = 'April 14, 2026';

export default function TermsPage() {
  return (
    <>
      <span className="legal-eyebrow">Legal</span>
      <h1 className="legal-title">Terms &amp; Conditions</h1>

      <div className="legal-meta">
        <span>Effective: {EFFECTIVE_DATE}</span>
        <span>Last updated: {LAST_UPDATED}</span>
      </div>

      <p className="legal-lede">
        These Terms govern your use of <strong>sadik.dev</strong> and any
        development services you engage from <strong>Sadik Shaikh</strong>
        (&ldquo;Sadik&rdquo;, &ldquo;I&rdquo;, &ldquo;we&rdquo;,
        or &ldquo;my&rdquo;). By submitting an inquiry, making a payment,
        or signing a statement of work, you agree to be bound by these Terms.
      </p>

      <div className="legal-callout">
        <p>
          <strong>Quick summary:</strong> I deliver fixed-scope engagements
          against a written proposal. Billing is milestone-based (30% / 40% /
          30%). You own the final code on full payment. Liability is capped
          at fees paid. Disputes are governed by Indian law, Mumbai
          jurisdiction.
        </p>
      </div>

      <div className="legal-toc">
        <h3>Contents</h3>
        <ol>
          <li><a href="#acceptance">1. Acceptance</a></li>
          <li><a href="#services">2. Services</a></li>
          <li><a href="#engagement">3. Engagement process</a></li>
          <li><a href="#pricing">4. Pricing &amp; payment</a></li>
          <li><a href="#refunds">5. Refund policy</a></li>
          <li><a href="#ip">6. Intellectual property</a></li>
          <li><a href="#client-duties">7. Your responsibilities</a></li>
          <li><a href="#confidentiality">8. Confidentiality</a></li>
          <li><a href="#warranties">9. Warranties &amp; disclaimers</a></li>
          <li><a href="#liability">10. Limitation of liability</a></li>
          <li><a href="#indemnity">11. Indemnity</a></li>
          <li><a href="#term">12. Term &amp; termination</a></li>
          <li><a href="#governing-law">13. Governing law &amp; disputes</a></li>
          <li><a href="#general">14. General terms</a></li>
          <li><a href="#contact">15. Contact</a></li>
        </ol>
      </div>

      <h2 id="acceptance">1. Acceptance</h2>
      <p>
        By using this website, submitting a contact form, or engaging me for
        paid services, you acknowledge that you have read, understood, and
        agreed to these Terms. If you are entering into this agreement on
        behalf of a company, you represent that you have the authority to
        bind that company.
      </p>

      <h2 id="services">2. Services</h2>
      <p>
        I provide development services including, but not limited to:
        React and Next.js web applications, Shopify storefronts (themes and
        headless Hydrogen), custom SaaS platforms, design-to-code conversion,
        and fractional engineering retainers. The exact scope of each
        engagement is described in a written proposal or statement of work
        (&ldquo;SOW&rdquo;) that both parties agree to before work begins.
      </p>

      <h2 id="engagement">3. Engagement process</h2>
      <ol>
        <li>You submit an inquiry via the contact form or email.</li>
        <li>Within 24 hours (business days), I reply with clarifying questions or a proposal.</li>
        <li>Once scope is clear, I send a fixed quote and proposed timeline.</li>
        <li>You accept the proposal, pay the deposit, and the project kicks off on the agreed start date.</li>
        <li>Work is delivered in milestones with review cycles built in.</li>
        <li>On final acceptance and full payment, the engagement closes and the code is transferred to you.</li>
      </ol>

      <h2 id="pricing">4. Pricing &amp; payment</h2>
      <h3>Pricing</h3>
      <p>
        Pricing for each service is shown on{' '}
        <a href="/contact">/contact</a>. Indian clients are billed in INR;
        international clients in USD. All quotes are fixed for a specific
        scope — changes require a written change order with updated pricing.
      </p>

      <h3>Payment schedule</h3>
      <p>
        Standard milestone billing for fixed-scope engagements:
      </p>
      <ul>
        <li><strong>30%</strong> upon signing the proposal (project kickoff).</li>
        <li><strong>40%</strong> at the agreed midpoint milestone.</li>
        <li><strong>30%</strong> on delivery and acceptance.</li>
      </ul>
      <p>
        Retainer engagements are billed monthly in advance. Invoices are due
        within <strong>7 days</strong> of issue unless otherwise agreed.
      </p>

      <h3>Payment methods</h3>
      <ul>
        <li><strong>India</strong> — Razorpay (UPI, net banking, credit/debit cards, wallets) or direct NEFT/IMPS. GST invoices issued for every milestone.</li>
        <li><strong>International</strong> — Stripe, Wise, or bank wire in USD.</li>
      </ul>

      <h3>Late payment</h3>
      <p>
        Invoices unpaid beyond 14 days incur a late fee of 2% per month or
        the maximum allowed by applicable law, whichever is lower. Work may
        be paused on overdue accounts until payment is received.
      </p>

      <h2 id="refunds">5. Refund policy</h2>
      <p>
        Because services are bespoke and delivered against a written scope,
        refunds are limited:
      </p>
      <ul>
        <li>
          <strong>Before kickoff</strong> — the kickoff deposit is refundable
          in full within 48 hours of payment, less any work already performed.
        </li>
        <li>
          <strong>After kickoff</strong> — completed milestones are
          non-refundable. If you cancel mid-engagement, you pay for work
          delivered up to the cancellation date plus a reasonable wind-down
          fee, and receive all work product in its current state.
        </li>
        <li>
          <strong>Shopify themes / static websites</strong> — non-refundable
          once development has started because each build is unique and
          cannot be resold.
        </li>
        <li>
          <strong>Payment disputes</strong> — please contact me directly
          before raising a bank chargeback or Razorpay/Stripe dispute. Most
          issues resolve faster by email.
        </li>
      </ul>

      <h2 id="ip">6. Intellectual property</h2>
      <h3>Your code</h3>
      <p>
        Upon receipt of final payment, I assign to you <strong>all rights,
        title, and interest</strong> in the custom code, designs, and
        deliverables created specifically for your project under the SOW.
        You may modify, redistribute, and sublicense that code as you wish.
      </p>

      <h3>Pre-existing IP</h3>
      <p>
        I retain ownership of my pre-existing tools, libraries, and code
        patterns developed before or outside your engagement. Where these
        are incorporated into your deliverables, I grant you a perpetual,
        non-exclusive, worldwide licence to use them as part of the project.
      </p>

      <h3>Third-party assets</h3>
      <p>
        Any third-party code, images, fonts, or libraries used in your
        project remain the property of their respective owners and are
        licensed under their own terms (typically MIT, Apache 2.0, or
        similar). I will flag any non-standard licence before use.
      </p>

      <h3>Portfolio rights</h3>
      <p>
        Unless we agree otherwise in writing, I may reference the engagement
        in my portfolio, including screenshots, the client name, and a
        high-level description of the work. Sensitive business logic and
        proprietary data will never be shown.
      </p>

      <h2 id="client-duties">7. Your responsibilities</h2>
      <p>To keep the project on schedule and on budget, you agree to:</p>
      <ul>
        <li>Provide timely, substantive feedback at review points (usually within 2 business days).</li>
        <li>Deliver content, assets, and third-party access (domains, analytics, design files) on time.</li>
        <li>Make a decision-maker available for key architectural and scope questions.</li>
        <li>Pay invoices on time per the agreed schedule.</li>
        <li>Warrant that any content or assets you provide do not infringe anyone else&apos;s rights.</li>
      </ul>

      <h2 id="confidentiality">8. Confidentiality</h2>
      <p>
        I treat everything you share as confidential, including business
        strategy, customer data, unreleased product plans, and source
        materials. I will not disclose your confidential information to any
        third party without your written consent, except where required by
        law. This obligation survives the engagement indefinitely.
      </p>
      <p>
        If you need a signed Non-Disclosure Agreement before sharing
        sensitive information, I will sign yours or provide a simple mutual
        template.
      </p>

      <h2 id="warranties">9. Warranties &amp; disclaimers</h2>
      <p>
        I warrant that I will perform the services with reasonable skill and
        care, and that the deliverables will conform to the scope in the SOW.
        If a defect in the deliverables is reported within <strong>30 days of
        delivery</strong>, I will fix it at no additional cost.
      </p>
      <p>
        <strong>Except as expressly stated above, the services and
        deliverables are provided &ldquo;AS IS&rdquo; without warranty of
        any kind</strong>, including implied warranties of merchantability,
        fitness for a particular purpose, or non-infringement. I do not
        guarantee that the deliverables will be error-free, uninterrupted,
        or compatible with every third-party system.
      </p>

      <h2 id="liability">10. Limitation of liability</h2>
      <p>
        <strong>To the maximum extent permitted by law, my total liability
        under this agreement — whether in contract, tort (including
        negligence), or otherwise — is capped at the total fees paid by you
        for the engagement giving rise to the claim.</strong>
      </p>
      <p>
        I am not liable for any indirect, incidental, special, consequential,
        or punitive damages, including lost profits, lost revenue, lost
        data, or business interruption, even if I have been advised of the
        possibility of such damages.
      </p>

      <h2 id="indemnity">11. Indemnity</h2>
      <p>
        You agree to indemnify and hold me harmless from any third-party
        claims, damages, or costs arising from: (a) content you provide for
        the project; (b) your use of the deliverables in violation of law
        or third-party rights; or (c) modifications to the deliverables
        made by you or a third party after delivery.
      </p>

      <h2 id="term">12. Term &amp; termination</h2>
      <p>
        These Terms take effect on the date you accept them and continue
        until the engagement is complete. Either party may terminate the
        engagement by written notice if the other party materially breaches
        these Terms and fails to cure within 14 days of receiving notice.
      </p>
      <p>
        On termination, you pay for all work completed up to the termination
        date. Surviving clauses include: Intellectual Property, Confidentiality,
        Limitation of Liability, Indemnity, and Governing Law.
      </p>

      <h2 id="governing-law">13. Governing law &amp; disputes</h2>
      <p>
        These Terms are governed by the laws of <strong>India</strong>.
        The parties submit to the exclusive jurisdiction of the courts
        in <strong>Mumbai, Maharashtra</strong>, for any dispute arising
        out of or related to this agreement.
      </p>
      <p>
        Before escalating to court, both parties agree to attempt a
        good-faith resolution by email within 30 days of raising a dispute.
        Where appropriate, we may agree to mediation or arbitration under
        the Arbitration and Conciliation Act, 1996.
      </p>

      <h2 id="general">14. General terms</h2>
      <ul>
        <li><strong>Entire agreement</strong> — these Terms, together with the signed SOW, constitute the entire agreement between us on the subject matter and supersede all prior communications.</li>
        <li><strong>Amendments</strong> — changes to these Terms require my written consent. Changes to scope require a signed change order.</li>
        <li><strong>Severability</strong> — if any clause is held unenforceable, the remainder continues in effect.</li>
        <li><strong>Waiver</strong> — my failure to enforce any right does not waive that right in future.</li>
        <li><strong>Assignment</strong> — you may not assign this agreement without my prior written consent.</li>
        <li><strong>Force majeure</strong> — neither party is liable for delays caused by events outside their reasonable control (natural disaster, outage, illness, etc.).</li>
        <li><strong>Notices</strong> — email to the address on the SOW is valid notice.</li>
      </ul>

      <h2 id="contact">15. Contact</h2>
      <p>
        Questions about these Terms, a signed SOW, or a current engagement:
      </p>
      <ul>
        <li>Email: <a href="mailto:sadik5780@gmail.com">sadik5780@gmail.com</a></li>
        <li>Website: <a href="/">sadik.dev</a></li>
      </ul>
      <p>
        Please reference your project name or invoice number in the subject
        line so I can respond quickly.
      </p>
    </>
  );
}
