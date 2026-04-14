export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: 'Do you work with clients in India, the USA, and Australia?',
    answer:
      'Yes. I work with clients globally and have served teams across India, the USA, Australia, the UK, and Singapore. Indian clients are billed in INR; international clients are billed in USD (AUD on request).',
  },
  {
    question: 'How do I hire you for a React or Next.js project?',
    answer:
      "The fastest path is the contact form on this page. Send me a short brief with your goals and timeline. I reply within 24 hours with a scope breakdown, a fixed quote, and a proposed start date. Most engagements kick off within 1–2 weeks.",
  },
  {
    question: 'What is your pricing for a Shopify store?',
    answer:
      'A standard custom Shopify theme build starts at ₹50,000 (India) or $2,000 (International). This includes a responsive custom theme, collection and product page customization, speed optimization, and basic SEO. Complex builds (headless, subscriptions, multi-currency) are quoted separately.',
  },
  {
    question: 'How much does a custom SaaS or web app cost?',
    answer:
      'Custom web apps start at ₹1,00,000 / $10,000 for a focused MVP and scale with the feature set you choose on the pricing calculator. Each additional feature (auth, payments, admin dashboard, real-time, etc.) adds ₹5,000 / $100. You get a full fixed quote before any work begins.',
  },
  {
    question: 'Do you offer freelance React developer services in the USA?',
    answer:
      'Yes. I take on fixed-scope freelance engagements and fractional engineering retainers for US-based product teams. Typical retainers run 10–30 hours per week for 3–6 month engagements.',
  },
  {
    question: 'Can you hire React developers for Australia timezone coverage?',
    answer:
      'Yes. I routinely overlap with AEST / AEDT mornings for standups and reviews, and deliver async updates via Linear/Notion outside overlap windows. Australian clients can choose between fixed-scope delivery or a weekly-hours retainer.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Indian clients: Razorpay (UPI, net banking, cards, wallets) or direct bank transfer. International clients: Stripe (cards), wire transfer, or Wise. A 30% deposit is required to start, with the balance milestoned across the project.',
  },
  {
    question: 'Do you provide ongoing maintenance after launch?',
    answer:
      'Yes. I offer maintenance retainers covering bug fixes, dependency updates, performance monitoring, and small feature work. Retainers start at ₹20,000 / $300 per month and scale with scope.',
  },
];
