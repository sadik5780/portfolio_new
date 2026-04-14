export interface LocationMeta {
  slug: string;               // 'india', 'usa', 'australia'
  name: string;               // 'India', 'USA', 'Australia'
  country: string;            // 'India', 'United States', 'Australia'
  countryCode: string;        // ISO-3166 alpha-2
  currency: 'inr' | 'usd';
  symbol: '₹' | '$';
  timezone: string;
  timezoneOffsetLabel: string;
  /** Short market context used on service+location pages. */
  marketNote: string;
  /** Location-specific FAQs (question/answer pairs). */
  faqs: Array<{ question: string; answer: string }>;
  /** How I work with clients from this region (timezone, billing, comms). */
  workingNote: string;
}

export const locations: LocationMeta[] = [
  {
    slug: 'india',
    name: 'India',
    country: 'India',
    countryCode: 'IN',
    currency: 'inr',
    symbol: '₹',
    timezone: 'Asia/Kolkata',
    timezoneOffsetLabel: 'IST (UTC+5:30)',
    marketNote:
      'Indian startups and agencies get best-in-class engineering at rupee-denominated pricing, with full IST overlap and GST-compliant invoicing.',
    workingNote:
      'Full IST overlap. GST-compliant invoicing via Razorpay. INR pricing throughout. Daily standups and WhatsApp availability for tight feedback loops.',
    faqs: [
      {
        question: 'Do you accept payments via Razorpay / UPI?',
        answer:
          'Yes. Indian clients pay via Razorpay — UPI, net banking, and cards all supported. GST-compliant invoices issued for every milestone.',
      },
      {
        question: 'What is the typical timeline for Indian clients?',
        answer:
          'A production marketing site ships in 2-3 weeks. A Shopify build in 3-4 weeks. A SaaS MVP in 8-12 weeks. Indian clients benefit from full timezone overlap so iteration is fast.',
      },
      {
        question: 'Do you work with Tier-2 and Tier-3 city founders?',
        answer:
          'Yes — most engagements are async-first, so location within India does not matter. Payments are in INR, communication is over Slack/WhatsApp/email, and reviews happen over video as needed.',
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
      'US-based product teams and Y-Combinator founders get senior engineering at 30-50% the cost of US-based freelancers, with morning EST / afternoon PST overlap.',
    workingNote:
      'Morning EST and early PST overlap (your morning is my evening). Stripe / Wise / wire transfer billing in USD. Async-first via Slack + Linear / Notion.',
    faqs: [
      {
        question: 'How do you handle US timezone overlap?',
        answer:
          'I overlap with EST mornings and PST early afternoons daily, with clear async updates outside those windows. Standups, code reviews, and planning sessions happen in real-time during overlap.',
      },
      {
        question: 'What currency and payment method do you accept from US clients?',
        answer:
          'USD via Stripe, Wise, or direct bank wire. Standard terms: 30% to start, 40% at milestone, 30% on delivery. Retainers are billed monthly in advance.',
      },
      {
        question: 'Can you sign NDAs / MSAs with US companies?',
        answer:
          'Yes. Standard NDAs and master services agreements are signed before kickoff. IP assigns to the client on final payment. I can sign your paper or use a simple MSA template.',
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
      'Australian founders get senior React, Shopify, and SaaS engineering with AEST morning overlap and USD-denominated pricing — 40-60% less than Sydney freelance rates.',
    workingNote:
      'AEST morning overlap for standups and reviews. Async updates via Slack outside that window. Billed in USD via Stripe or Wise.',
    faqs: [
      {
        question: 'How does timezone work with Australia?',
        answer:
          'I overlap with AEST/AEDT mornings (your 10am-2pm is my 5:30am-9:30am IST) for standups, code reviews, and synchronous planning. Everything else is async.',
      },
      {
        question: 'Do you work with Australian e-commerce brands on Shopify?',
        answer:
          'Yes. Most AU Shopify work is multi-currency with Shopify Markets (AUD / USD / NZD). I handle Stripe / Shopify Payments, GST-compliant invoicing on the merchant side, and Afterpay / Zip / Klarna integrations.',
      },
      {
        question: 'Can you work with Australian early-stage startups?',
        answer:
          'Absolutely. Fractional engineering retainers (10-30 hours/week) are available for funded pre-seed and seed-stage Australian startups — a fraction of the cost of a Sydney-based senior.',
      },
    ],
  },
];

export function getLocation(slug: string): LocationMeta | undefined {
  return locations.find((l) => l.slug === slug);
}
