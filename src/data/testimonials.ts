export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  country: 'India' | 'USA' | 'Australia' | 'UK' | 'Singapore';
  countryFlag: string;   // emoji
  quote: string;
  rating: number;        // 1-5
  projectType: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Aarav Sharma',
    role: 'Founder',
    company: 'BoltShip Logistics',
    country: 'India',
    countryFlag: '🇮🇳',
    quote:
      'Sadik rebuilt our dispatch dashboard from a 6-second LCP to under 400ms and shipped a new driver mobile web app in four weeks. Most importantly, he understood the business logic — we did not have to explain it twice.',
    rating: 5,
    projectType: 'SaaS Platform',
  },
  {
    id: 't2',
    name: 'Jessica Liu',
    role: 'Head of Engineering',
    company: 'Aperture Analytics',
    country: 'USA',
    countryFlag: '🇺🇸',
    quote:
      'We needed a Next.js 14 App Router specialist for a 12-week retainer. Sadik stepped in on day one, owned the full auth + billing slice, and wrote the cleanest code our team has shipped all year. Fully remote from India with morning EST overlap.',
    rating: 5,
    projectType: 'Next.js Retainer',
  },
  {
    id: 't3',
    name: 'Tom Jenkins',
    role: 'DTC Founder',
    company: 'Northwear Apparel',
    country: 'Australia',
    countryFlag: '🇦🇺',
    quote:
      'Our Shopify store was averaging a 38 mobile PageSpeed score. Sadik rebuilt it as a headless Hydrogen storefront — 94 PageSpeed, 3× faster checkout, and revenue up 22% in the first month. Handled AEST mornings without complaint.',
    rating: 5,
    projectType: 'Headless Shopify',
  },
  {
    id: 't4',
    name: 'Priya Raghavan',
    role: 'COO',
    company: 'LedgerLoop (YC S24)',
    country: 'USA',
    countryFlag: '🇺🇸',
    quote:
      'Hiring senior React talent in SF is either expensive or unavailable. Sadik delivered both speed and quality at a fraction of the cost. He architected our multi-tenant SaaS from scratch — Stripe, RBAC, admin tools, the lot.',
    rating: 5,
    projectType: 'SaaS MVP',
  },
  {
    id: 't5',
    name: 'Rohan Mehta',
    role: 'Product Lead',
    company: 'Kiran Fintech',
    country: 'India',
    countryFlag: '🇮🇳',
    quote:
      'We went from a buggy Django admin to a clean Next.js dashboard serving 20k users in a month. Sadik wrote every line of the frontend and worked alongside our backend team. Communication was sharp — daily standups, clear PRs, no ambiguity.',
    rating: 5,
    projectType: 'Frontend Rebuild',
  },
  {
    id: 't6',
    name: 'Ellie Park',
    role: 'Solo Founder',
    company: 'StudyBuddy',
    country: 'Australia',
    countryFlag: '🇦🇺',
    quote:
      'As a solo founder I needed a fractional tech lead, not just a coder. Sadik helped me scope the MVP, cut 40% of the feature list, and shipped a real product in 10 weeks. The pricing builder on his site gave me a fixed quote upfront — no surprises.',
    rating: 5,
    projectType: 'MVP + Fractional CTO',
  },
];

export function aggregateRating(): { value: number; count: number } {
  const total = testimonials.reduce((s, t) => s + t.rating, 0);
  return {
    value: Number((total / testimonials.length).toFixed(2)),
    count: testimonials.length,
  };
}
