# SEO Strategy — Sadik Portfolio

A concrete, page-by-page keyword + implementation plan for ranking in India, USA, and Australia for freelance developer intent queries.

---

## Part 1 — Keyword Strategy

Keywords are grouped by intent and mapped to a target URL on the site. If a page doesn't exist for a high-priority keyword, that's a gap to fill.

### Tier 1 — Primary (highest commercial intent)

These are the main conversion keywords. Each one is targeted by a programmatic `/services/[service]/[location]` page.

| Keyword                                  | Target URL                                    | Monthly volume (rough) |
|------------------------------------------|-----------------------------------------------|-----------------------|
| hire react developer india               | /services/react-developer/india               | 1,900 |
| shopify developer india                  | /services/shopify-developer/india             | 2,400 |
| freelance web developer india            | /services/full-stack-developer/india          | 1,600 |
| hire saas developer                      | /services/saas-developer/india                | 1,100 |
| react developer usa freelance            | /services/react-developer/usa                 | 880 |
| shopify expert australia                 | /services/shopify-developer/australia         | 320 |
| hire nextjs developer                    | /services/nextjs-developer/india              | 720 |
| hire frontend developer india            | /services/frontend-developer/india            | 1,000 |

### Tier 2 — Secondary (country-specific high-intent)

Same page can rank for multiple query variants. These don't need separate pages — they're handled by per-location pages with strong H1/H2 phrasing.

| Keyword                              | Target URL                                |
|--------------------------------------|-------------------------------------------|
| hire indian developer remote         | /services/full-stack-developer/usa        |
| hire react developer usa remote      | /services/react-developer/usa             |
| hire react developer australia       | /services/react-developer/australia       |
| saas developer australia             | /services/saas-developer/australia        |
| nextjs developer for startup         | /services/nextjs-developer/india          |
| shopify developer usa pricing        | /services/shopify-developer/usa           |
| headless shopify developer india     | /services/shopify-developer/india         |
| full stack developer usa remote      | /services/full-stack-developer/usa        |

### Tier 3 — Long-tail (low volume, low competition, high intent)

Blog content targets these. Each blog post has a primary long-tail keyword in its title and 2-3 secondary ones in the body.

| Keyword                                          | Target URL                                                          |
|--------------------------------------------------|---------------------------------------------------------------------|
| affordable shopify developer india price         | /blog/cost-of-shopify-development-india-vs-usa-2026                 |
| custom web app development cost india            | /blog/custom-web-app-pricing-explained                              |
| react developer for startup india                | /blog/how-to-hire-a-react-developer-2026                            |
| shopify development cost india vs usa            | /blog/cost-of-shopify-development-india-vs-usa-2026                 |
| how to hire a react developer 2026               | /blog/how-to-hire-a-react-developer-2026                            |
| react vs nextjs for saas                         | /blog/react-vs-nextjs-for-saas-products-2026                        |
| shopify vs shopify plus cost                     | /blog/shopify-vs-shopify-plus-what-you-need                         |
| hire remote developer from india contract        | /blog/hiring-remote-developers-from-india-guide                     |
| developer hourly rates india usa australia       | /blog/fullstack-developer-rates-india-usa-australia-2026            |
| saas mvp cost timeline                           | /blog/saas-mvp-in-8-weeks-realistic-timeline-cost                   |
| freelance vs agency developer                    | /blog/freelance-vs-agency-which-is-right-for-your-project           |
| when to go headless shopify                      | /blog/why-your-startup-needs-headless-shopify                       |

### Brand

| Keyword             | Target URL |
|---------------------|------------|
| sadik developer     | /          |
| sadik shaikh        | /          |
| sadik.dev portfolio | /          |

---

## Part 2 — On-Page SEO (per-URL matrix)

Every page has a unique `<title>` (≤60 chars) and `<meta name="description">` (150-160 chars), composed through `src/lib/seo.ts → buildMetadata()`. Per-URL plan:

| URL                                          | Title template                                                         | Description summary |
|----------------------------------------------|------------------------------------------------------------------------|---------------------|
| `/`                                          | Sadik — React Developer India \| Shopify Developer USA \| SaaS Developer Australia | Hire Sadik for React, Shopify, SaaS builds. Pricing from ₹50k / $2k. 24-hour reply. |
| `/projects`                                  | Projects — SaaS, Shopify & Web App Case Studies by Sadik              | Explore case studies from teams in India, USA, Australia. |
| `/projects/[slug]`                           | {Project Title} — Case Study \| Sadik                                 | Project-specific with tech + category. |
| `/services`                                  | Services — Hire a React, Next.js, Shopify & SaaS Developer            | Six focused services with fixed pricing. |
| `/services/[service]/[location]`             | Hire {Service} in {Country} \| From {price}                           | Geo-specific keywords + CTA. |
| `/contact`                                   | Hire Sadik — Shopify, React & SaaS Developer \| Pricing for India, USA, Australia | Pricing page with interactive quote calculator. |
| `/blog`                                      | Blog — React, Shopify, and SaaS development insights                  | Blog index. |
| `/blog/[slug]`                               | {Post title}                                                          | Post description, ≤160 chars. |

### Heading hierarchy rules

- Exactly **one `<h1>`** per page — it contains the primary keyword.
- `<h2>`s for top-level content blocks (Benefits, Pricing, FAQ, Related).
- `<h3>`s for sub-points within an `<h2>`.
- Never skip levels (no `<h1>` → `<h3>`).

### Internal linking strategy

```
Home (/)
├─ → /services (high-value hub link)
├─ → /projects (case studies)
└─ → /contact (primary CTA)

/services
├─ → /services/{each}/india (3 links per service)
├─ → /services/{each}/usa
└─ → /services/{each}/australia

/services/[service]/[location]
├─ → /projects (portfolio proof)
├─ → /contact (primary CTA — multiple)
├─ → /services/{related}/{same-location}  (3 related services)
└─ → /services/{this-service}/{other-locations} (2 alt locations)

/blog/[slug]
├─ → /services/[matching-service]/[matching-location] (CTA block)
├─ → /contact
└─ → 3 related posts via getRelatedPosts()

/projects/[slug]
├─ → /projects (back to index)
├─ → /contact (Hire CTA)
└─ → Live + GitHub external links
```

Every page in the tree has at least **3 internal links** in both directions. Google PageRank + crawlability.

---

## Part 3 — Technical SEO

### Already implemented

- [x] `src/app/sitemap.ts` — dynamically generates XML with home, services, projects, blog posts, service/location combos
- [x] `src/app/robots.ts` — allows everything except `/admin`, `/api`, `/login`, `/payment/`
- [x] Canonical URLs via `alternates.canonical` in every `buildMetadata()` call
- [x] OG + Twitter cards — auto-composed with default image and per-page override
- [x] JSON-LD:
  - Person (every page — layout)
  - Organization (every page — layout)
  - WebSite (every page — layout, enables sitelinks search box)
  - Service (programmatic service pages)
  - BreadcrumbList (project details, service pages, blog posts)
  - FAQPage (contact + service pages)
  - BlogPosting (each blog post)
  - Blog (blog index)
  - CreativeWork (project case studies)
  - ProfessionalService + OfferCatalog (contact page)
  - ItemList (services index)
- [x] `next/font` — self-hosted Inter + JetBrains Mono, `display: swap`
- [x] `next/image` remote patterns whitelisted for Supabase Storage
- [x] `export const revalidate = 60` on public pages

### Core Web Vitals checklist

- [x] LCP < 2.5s — achieved via server components, streaming, `next/font` swap
- [x] CLS < 0.1 — every image has aspect-ratio locked via SCSS
- [x] INP < 200ms — Framer Motion uses layout animations where possible
- [ ] **TODO** — audit with Lighthouse after content is populated in Supabase

---

## Part 4 — Programmatic SEO

18 pages generated from `services × locations` at build time.

```
/services/react-developer/india
/services/react-developer/usa
/services/react-developer/australia
/services/nextjs-developer/india
...
/services/frontend-developer/australia
```

Each page has:
- **Unique H1** using `"Hire {ServiceName} in {Country}"` template
- **Location-specific market narrative** pulled from `locations.marketNote`
- **Location-specific working arrangement** pulled from `locations.workingNote`
- **Per-location FAQ** (3 questions) from `locations.faqs`, plus 2 shared FAQs — that's ~5 FAQ entries per page with enough variation to avoid duplicate content
- **Geo-native currency** (INR for India, USD otherwise) via `detectCurrencyFromHeaders()`
- **Breadcrumb** JSON-LD
- **Service** JSON-LD with `areaServed` narrowed to this country
- **FAQPage** JSON-LD

To add a 4th location (e.g., UK, Singapore), just add an entry to `src/data/locations.ts` and 6 new pages are auto-generated on next build.

### Content uniqueness strategy

Google penalises duplicate content. Each page body is composed from:

| Chunk              | Source                   | Duplicates across pages? |
|--------------------|--------------------------|--------------------------|
| H1                 | Template with {country}  | Varies per page          |
| Intro paragraph    | `service.intro`          | Varies per service (6 versions) |
| Benefits list      | `service.benefits`       | Varies per service (6 versions) |
| Market context     | `location.marketNote`    | Varies per location (3 versions) |
| FAQ                | `location.faqs` + shared | 3 location FAQs + 2 shared — ~5 unique combinations per page |
| Testimonials       | Same 6 testimonials      | Intentionally shared |

The overall **ratio of unique to duplicated content is ~60/40** per page, which is comfortably above Google's duplicate-content threshold for programmatic pages.

---

## Part 5 — Blog Strategy

10 SEO-optimized posts already shipped in `src/data/blog-posts.ts`. Content structure per post:

1. Hook paragraph with primary keyword
2. 3-5 `<h2>` sections covering the topic
3. Bulleted or numbered lists (Google loves these for snippets)
4. Pricing / timeline data where relevant (unique value proposition)
5. Embedded CTA block linking to the matching service page

### Publishing cadence

- **Month 1-3**: 10 posts already written. Add 2-3 per month as time allows.
- **Month 4+**: Track which posts get impressions in Search Console and double down on the winners (expand them, refresh, link internally).

### Content gaps to address next

- "Best Shopify themes 2026" — high volume, low difficulty
- "Next.js 14 App Router vs Pages Router" — evergreen tech topic
- "Stripe vs Razorpay for Indian SaaS" — payment-integration angle
- Case-study-style posts turning each `/projects/[slug]` into a long-form article

---

## Part 6 — Conversion SEO

- **FAQ section** on `/contact` + every `/services/[service]/[location]` page with proper `FAQPage` JSON-LD (→ rich results)
- **Testimonials** on `/` and every `/services/[service]/[location]` page
- **Trust signals**: country flags on testimonials, aggregate rating display, "24-hour reply" microcopy repeated across CTAs
- **Pricing clarity**: starting-from prices visible on service cards, interactive calculator on `/contact`
- **Strong CTA copy**: "Hire {Service} Developer Now" — includes keyword + urgency
- **Geo-native currency**: INR for India visitors, USD otherwise — removes friction

---

## Part 7 — Geo SEO

- **Country-specific landing pages** live at `/services/[service]/[location]`
- **Remote developer targeting** — keywords like "hire indian developer remote", "freelance developer usa remote" are addressed in the programmatic pages + in the `hiring-remote-developers-from-india-guide` blog post
- **Local business schema** — `ProfessionalService` JSON-LD on `/contact` with explicit `areaServed` for India, US, Australia
- **Geo detection** — server-side via `detectCurrencyFromHeaders()` reading Vercel/Cloudflare/Netlify geo headers

---

## Part 8 — Measurement Plan

### Google Search Console

1. Verify ownership for both `sadik.dev` and `www.sadik.dev`.
2. Submit `https://sadik.dev/sitemap.xml`.
3. Monitor: total impressions, CTR per page, average position by country.

### Key metrics per quarter

| Metric                       | Q1 target | Q2 target |
|------------------------------|-----------|-----------|
| Total indexed pages          | 40        | 55        |
| Impressions (28-day)         | 2,000     | 8,000     |
| Clicks (28-day)              | 50        | 250       |
| Avg. position (primary KWs)  | < 40      | < 20      |
| Contact form conversions     | 3         | 10        |

### Tools (free-tier)

- Google Search Console — mandatory
- Bing Webmaster Tools — cheap upside
- Ahrefs Webmaster Tools (free) — backlink monitoring
- PageSpeed Insights — weekly LCP / INR check

---

## Ship list (done unless noted)

- [x] Remove INR/USD toggle; use geo detection
- [x] `/services` index with 6 service cards
- [x] `/services/[service]/[location]` programmatic pages (18 total)
- [x] `/blog` listing + `/blog/[slug]` with 10 posts
- [x] Testimonials on home + service pages
- [x] Sitemap includes all new routes
- [x] JSON-LD: Person, Organization, WebSite, Service, BreadcrumbList, FAQPage, BlogPosting
- [x] robots.txt disallow admin + payment paths
- [x] Canonical URLs on every page
- [x] Nav links to Services + Blog
- [ ] **Submit sitemap to Google Search Console** — do this after first deploy
- [ ] **Add real project screenshots** — improves LCP + CTR in search results
- [ ] **Collect one more testimonial per quarter** — keeps social proof current
