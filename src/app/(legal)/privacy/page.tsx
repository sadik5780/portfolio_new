import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'How Sadik collects, uses, and protects personal information from contact form submissions, payments, and site visits. GDPR, India DPDP Act, and CCPA compliant.',
  path: '/privacy',
});

const EFFECTIVE_DATE = 'April 14, 2026';
const LAST_UPDATED = 'April 14, 2026';

export default function PrivacyPolicyPage() {
  return (
    <>
      <span className="legal-eyebrow">Legal</span>
      <h1 className="legal-title">Privacy Policy</h1>

      <div className="legal-meta">
        <span>Effective: {EFFECTIVE_DATE}</span>
        <span>Last updated: {LAST_UPDATED}</span>
      </div>

      <p className="legal-lede">
        This Privacy Policy explains how <strong>Sadik Shaikh</strong>
        (&ldquo;Sadik&rdquo;, &ldquo;I&rdquo;, &ldquo;we&rdquo;,
        or &ldquo;my&rdquo;) collects, uses, and safeguards personal
        information when you visit <strong>sadik.dev</strong>, contact me
        through the site, or pay for my development services.
      </p>

      <div className="legal-toc">
        <h3>Contents</h3>
        <ol>
          <li><a href="#who-we-are">1. Who we are</a></li>
          <li><a href="#information-we-collect">2. Information we collect</a></li>
          <li><a href="#how-we-use">3. How we use information</a></li>
          <li><a href="#legal-basis">4. Legal basis for processing</a></li>
          <li><a href="#third-parties">5. Third-party services</a></li>
          <li><a href="#cookies">6. Cookies</a></li>
          <li><a href="#retention">7. Data retention</a></li>
          <li><a href="#security">8. Data security</a></li>
          <li><a href="#your-rights">9. Your rights</a></li>
          <li><a href="#transfers">10. International data transfers</a></li>
          <li><a href="#children">11. Children</a></li>
          <li><a href="#changes">12. Changes</a></li>
          <li><a href="#contact">13. Contact</a></li>
        </ol>
      </div>

      <h2 id="who-we-are">1. Who we are</h2>
      <p>
        Sadik Shaikh is an independent full-stack developer based in India,
        offering React, Next.js, Shopify, and SaaS development services to
        clients worldwide. For the purposes of data protection law (including
        the EU GDPR and India&apos;s Digital Personal Data Protection Act 2023),
        I am the <strong>data controller</strong> for any personal information
        collected through this website.
      </p>
      <p>
        Contact for privacy matters:{' '}
        <a href="mailto:sadik5780@gmail.com">sadik5780@gmail.com</a>.
      </p>

      <h2 id="information-we-collect">2. Information we collect</h2>

      <h3>a) Information you provide</h3>
      <ul>
        <li>
          <strong>Contact form submissions</strong> — your name, email address,
          optional phone number, selected project type, stated budget, and the
          message you send.
        </li>
        <li>
          <strong>Payment information</strong> — name, email, and billing
          details you enter in the Razorpay or Stripe checkout flow. Card
          numbers and bank credentials are <strong>never</strong> transmitted
          to or stored on sadik.dev; they go directly to the payment processor.
        </li>
        <li>
          <strong>Project content</strong> — anything you share during an
          engagement (briefs, assets, source materials) is held in confidence
          under the Terms of Service.
        </li>
      </ul>

      <h3>b) Information collected automatically</h3>
      <ul>
        <li>
          <strong>Request metadata</strong> — IP address, user-agent, referring
          URL, and approximate country (used to display pricing in the right
          currency). I do not log IP addresses to a personal profile.
        </li>
        <li>
          <strong>Session cookie</strong> — a single short-lived, signed
          <code> sadik_admin_session</code> cookie is set only when I sign in
          to the admin panel. No tracking cookies are set for site visitors.
        </li>
      </ul>

      <h2 id="how-we-use">3. How we use information</h2>
      <p>I use the information I collect for these purposes only:</p>
      <ul>
        <li>To reply to your inquiry and, if we proceed, to scope and deliver the project.</li>
        <li>To process payments via Razorpay (India) or Stripe (international).</li>
        <li>To send transactional email (quotes, invoices, delivery updates) — no newsletters without explicit opt-in.</li>
        <li>To comply with tax, accounting, and legal obligations.</li>
        <li>To improve the site&apos;s content and performance using aggregated, non-identifying data.</li>
      </ul>
      <p>
        I <strong>never</strong> sell your personal information, rent it to
        advertisers, or use it to train machine-learning models.
      </p>

      <h2 id="legal-basis">4. Legal basis for processing</h2>
      <p>Under the GDPR (and analogous Indian and Australian law), I process personal data on these bases:</p>
      <ul>
        <li><strong>Contract</strong> — to respond to your inquiry and perform the services you engage me for.</li>
        <li><strong>Legitimate interest</strong> — to secure the site (e.g. rate-limiting, abuse prevention) and to maintain accurate business records.</li>
        <li><strong>Legal obligation</strong> — to meet tax, anti-money-laundering, and accounting requirements.</li>
        <li><strong>Consent</strong> — where required (e.g. optional marketing emails, which I currently do not send).</li>
      </ul>

      <h2 id="third-parties">5. Third-party services</h2>
      <p>
        I use a small, audited set of sub-processors to run the site. Each has
        its own privacy policy, linked below:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — database and storage for projects,
          leads, payments, and uploaded images.{' '}
          <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Policy →</a>
        </li>
        <li>
          <strong>Vercel</strong> — hosts and serves this website.{' '}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Policy →</a>
        </li>
        <li>
          <strong>Razorpay</strong> — processes payments from Indian customers
          in INR.{' '}
          <a href="https://razorpay.com/privacy" target="_blank" rel="noopener noreferrer">Policy →</a>
        </li>
        <li>
          <strong>Stripe</strong> — processes payments from international
          customers in USD (when enabled).{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Policy →</a>
        </li>
        <li>
          <strong>Resend</strong> — delivers transactional email from the
          contact form (when configured).{' '}
          <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Policy →</a>
        </li>
      </ul>
      <p>
        I share the <strong>minimum</strong> data required to operate each
        service. Payment processors receive what they need to complete the
        transaction; the database holds structured inquiry records and (if
        you paid) a reference to the payment. No third party receives data
        for advertising purposes.
      </p>

      <h2 id="cookies">6. Cookies</h2>
      <p>
        sadik.dev uses cookies sparingly. The only cookie set during normal
        browsing is a session cookie for the admin panel, which is only set
        after the administrator signs in. There are no advertising cookies,
        no cross-site tracking pixels, and no analytics cookies by default.
      </p>
      <p>
        If I add analytics in the future (e.g. Plausible, Vercel Analytics),
        I will use cookieless or first-party-cookie options that do not
        identify individuals.
      </p>

      <h2 id="retention">7. Data retention</h2>
      <ul>
        <li><strong>Contact form submissions</strong> — kept until the lead is resolved, then archived for up to 3 years for tax and audit purposes.</li>
        <li><strong>Payment records</strong> — retained for at least 7 years to meet Indian tax-filing requirements (Rule 6F / Section 44AA of the Income Tax Act).</li>
        <li><strong>Project assets</strong> — retained for the duration of the engagement plus 90 days after delivery, then deleted on request.</li>
        <li><strong>Server logs</strong> — rotated automatically after 30 days.</li>
      </ul>

      <h2 id="security">8. Data security</h2>
      <p>
        The site enforces TLS 1.3 for every request, uses HTTP-only + Secure
        + SameSite=Lax cookies for the admin session, and stores credentials
        only as environment variables on the hosting provider (never in
        source control). Row-level security is enabled on every Supabase
        table, and admin writes use a server-only service role key.
      </p>
      <p>
        No system is perfectly secure. If a data breach affects you, I will
        notify you by email within 72 hours of discovery, in line with GDPR
        Article 33 and India&apos;s DPDP Act obligations.
      </p>

      <h2 id="your-rights">9. Your rights</h2>
      <p>
        Depending on where you live, you have some or all of these rights
        over the information I hold about you:
      </p>
      <ul>
        <li><strong>Access</strong> — request a copy of your personal data.</li>
        <li><strong>Rectification</strong> — correct inaccurate or incomplete data.</li>
        <li><strong>Erasure</strong> — request deletion, subject to tax and legal retention obligations.</li>
        <li><strong>Portability</strong> — receive your data in a machine-readable format.</li>
        <li><strong>Objection</strong> — object to specific processing on legitimate-interest grounds.</li>
        <li><strong>Withdrawal of consent</strong> — where processing relies on consent.</li>
        <li><strong>Complaint</strong> — lodge a complaint with your local supervisory authority (in India, the Data Protection Board; in the EU, your national DPA).</li>
      </ul>
      <p>
        To exercise any of these rights, email{' '}
        <a href="mailto:sadik5780@gmail.com">sadik5780@gmail.com</a> from the
        address associated with your account or inquiry. I will respond within
        30 days.
      </p>

      <h2 id="transfers">10. International data transfers</h2>
      <p>
        The site and database are hosted on Vercel (United States) and
        Supabase (United States). If you visit from outside the US, your data
        will be transferred to and processed in the US. I rely on the
        applicable Standard Contractual Clauses (SCCs) and each provider&apos;s
        Data Processing Agreement to ensure an adequate level of protection.
      </p>

      <h2 id="children">11. Children</h2>
      <p>
        sadik.dev is a B2B business site. It is not directed at children
        under 13 (or the equivalent minimum age in your country), and I do
        not knowingly collect personal information from children. If you
        believe a child has provided information, please contact me and I
        will delete it promptly.
      </p>

      <h2 id="changes">12. Changes to this policy</h2>
      <p>
        If I update this policy, the &ldquo;Last updated&rdquo; date at the
        top changes. Material changes that affect your rights will be
        communicated by email to active clients and announced at the top of
        this page for at least 30 days.
      </p>

      <h2 id="contact">13. Contact</h2>
      <p>
        Questions, concerns, or requests under this policy go to:
      </p>
      <ul>
        <li>Email: <a href="mailto:sadik5780@gmail.com">sadik5780@gmail.com</a></li>
        <li>Subject line: <strong>&ldquo;Privacy request — [your name]&rdquo;</strong></li>
      </ul>
      <p>
        If your request relates to a specific project, please reference the
        project name or invoice number so I can locate your records quickly.
      </p>
    </>
  );
}
