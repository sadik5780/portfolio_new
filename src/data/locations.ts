export interface LocationMeta {
  slug: string;               // 'india', 'usa', 'uk', 'australia'
  name: string;               // 'India', 'USA', 'UK', 'Australia'
  country: string;            // 'India', 'United States', 'United Kingdom', 'Australia'
  countryCode: string;        // ISO-3166 alpha-2
  currency: 'inr' | 'usd' | 'gbp';
  symbol: '₹' | '$' | '£';
  timezone: string;
  timezoneOffsetLabel: string;
  /** Short market context used on service+location pages. */
  marketNote: string;
  /** Location-specific FAQs (question/answer pairs). */
  faqs: Array<{ question: string; answer: string }>;
  /** How we work with clients from this region (timezone, billing, comms). */
  workingNote: string;
}

export const locations: LocationMeta[] = [
  {
    slug: 'india',
    name: 'India',
    country: 'India',
    countryCode: 'IN',
    // All quotes are denominated in USD across the site; INR equivalents are
    // available on request at invoice time.
    currency: 'usd',
    symbol: '$',
    timezone: 'Asia/Kolkata',
    timezoneOffsetLabel: 'IST (UTC+5:30)',
    marketNote:
      'Indian startups and agencies get best-in-class engineering with full IST overlap, transparent USD pricing, and tight daily collaboration with a founder-led studio.',
    workingNote:
      'Full IST overlap. Quotes in USD; INR settlement available on request. Daily standups and WhatsApp availability for tight feedback loops — direct with the engineer building your product.',
    faqs: [
      {
        question: 'How are payments handled for Indian clients?',
        answer:
          'Quotes and invoices are issued in USD by default. Indian clients can settle via international wire, Stripe, or Wise. INR settlement via Razorpay (UPI, net banking, cards) is available on request with GST-compliant invoicing.',
      },
      {
        question: 'What is the typical timeline for Indian clients?',
        answer:
          'A production marketing site ships in 2–3 weeks. A Shopify build in 3–4 weeks. A SaaS MVP in 8–12 weeks. Indian clients benefit from full timezone overlap so iteration is fast.',
      },
      {
        question: 'Do you work with Tier-2 and Tier-3 city founders?',
        answer:
          'Yes — most engagements are async-first, so location within India does not matter. Communication is over Slack/WhatsApp/email, and reviews happen over video as needed.',
      },
    ],
  },
  {
    slug: 'usa',
    name: 'USA',
    country: 'United States',
    countryCode: 'US',
    currency: 'usd',
    symbol: '$',
    timezone: 'America/New_York',
    timezoneOffsetLabel: 'EST/PST (UTC-5 / UTC-8)',
    marketNote:
      'US-based product teams and Y-Combinator founders get senior engineering at roughly half the cost of a US senior contractor (US senior React devs run $120–$150/hour). Morning EST / afternoon PST overlap and a single accountable engineer end-to-end.',
    workingNote:
      'Morning EST and early PST overlap (your morning is our evening). Stripe / Wise / wire transfer billing in USD. Async-first via Slack + Linear / Notion. You talk directly to the engineer shipping the code — never an account manager.',
    faqs: [
      {
        question: 'How do you handle US timezone overlap?',
        answer:
          'We overlap with EST mornings and PST early afternoons daily, with clear async updates outside those windows. Standups, code reviews, and planning sessions happen in real-time during overlap.',
      },
      {
        question: 'What currency and payment method do you accept from US clients?',
        answer:
          'USD via Stripe, Wise, or direct bank wire. Standard terms: 30% to start, 40% at milestone, 30% on delivery. Retainers are billed monthly in advance.',
      },
      {
        question: 'Can you sign NDAs / MSAs with US companies?',
        answer:
          'Yes. Standard NDAs and master services agreements are signed before kickoff. IP assigns to the client on final payment. We can sign your paper or use a simple MSA template.',
      },
    ],
  },
  {
    slug: 'uk',
    name: 'UK',
    country: 'United Kingdom',
    countryCode: 'GB',
    currency: 'gbp',
    symbol: '£',
    timezone: 'Europe/London',
    timezoneOffsetLabel: 'GMT/BST (UTC+0 / UTC+1)',
    marketNote:
      'UK founders and London-based scale-ups get senior React, Next.js, Shopify, and SaaS engineering at roughly half the rate of a London senior contractor (London senior devs average £500–£800/day). Full GMT afternoon overlap and a direct line to the engineer building your product.',
    workingNote:
      'GMT/BST afternoon overlap (your afternoon is our evening) for standups, reviews, and planning. Billed in GBP via Wise or USD via Stripe. NDAs / MSAs signed before kickoff. Async-first via Slack + Linear / Notion.',
    faqs: [
      {
        question: 'How does timezone work with UK clients?',
        answer:
          'We overlap with GMT/BST afternoons (your 1pm-6pm is our 6:30pm-11:30pm IST) for live standups, reviews, and pairing. Async work continues outside that window so progress never stalls overnight.',
      },
      {
        question: 'What currency and payment method do you accept from UK clients?',
        answer:
          'GBP via Wise (recommended) or USD via Stripe / direct bank transfer. Standard terms: 30% to start, 40% at milestone, 30% on delivery. UK-compliant invoicing with VAT notes where relevant.',
      },
      {
        question: 'Can you sign NDAs / MSAs with UK companies?',
        answer:
          'Yes. We sign standard UK-jurisdiction NDAs and MSAs before any code is written. IP assigns to the client on final payment.',
      },
      {
        question: 'Do you work with UK e-commerce brands on Shopify?',
        answer:
          'Yes. We build Shopify 2.0 themes and Hydrogen storefronts with multi-currency Shopify Markets (GBP / EUR / USD), Klarna / Clearpay integration, and Klaviyo flows tuned for UK retail.',
      },
    ],
  },
  {
    slug: 'australia',
    name: 'Australia',
    country: 'Australia',
    countryCode: 'AU',
    currency: 'usd',
    symbol: '$',
    timezone: 'Australia/Sydney',
    timezoneOffsetLabel: 'AEST/AEDT (UTC+10 / UTC+11)',
    marketNote:
      'Australian founders get senior React, Shopify, and SaaS engineering with AEST morning overlap and USD-denominated pricing — roughly half the rate of a Sydney senior contractor (Sydney senior devs average A$800–A$1,200/day). One engineer accountable end-to-end.',
    workingNote:
      'AEST morning overlap for standups and reviews. Async updates via Slack outside that window. Billed in USD via Stripe or Wise. Direct communication with the engineer building your product — no agency layer.',
    faqs: [
      {
        question: 'How does timezone work with Australia?',
        answer:
          'We overlap with AEST/AEDT mornings (your 10am-2pm is our 5:30am-9:30am IST) for standups, code reviews, and synchronous planning. Everything else is async.',
      },
      {
        question: 'Do you work with Australian e-commerce brands on Shopify?',
        answer:
          'Yes. Most AU Shopify work is multi-currency with Shopify Markets (AUD / USD / NZD). We handle Stripe / Shopify Payments, GST-compliant invoicing on the merchant side, and Afterpay / Zip / Klarna integrations.',
      },
      {
        question: 'Can you work with Australian early-stage startups?',
        answer:
          'Absolutely. Fractional engineering retainers (10–30 hours/week) are available for funded pre-seed and seed-stage Australian startups — a fraction of the cost of a Sydney-based senior, with direct founder access.',
      },
    ],
  },
];

export function getLocation(slug: string): LocationMeta | undefined {
  return locations.find((l) => l.slug === slug);
}
