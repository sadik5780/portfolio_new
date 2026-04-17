# DESIGN.md — Sadik Studio

## 1. Visual theme and atmosphere

Dark-first, developer-premium aesthetic. The look borrows from SaaS dashboards and developer tooling — tight spacing, monospaced accents, muted surfaces with indigo highlights. Every element earns its place through information density, not decoration. Glassmorphism appears only on overlays (navbar, modals), never on content cards. Gradients are reserved for accents (headlines, CTAs, avatars) — never on backgrounds or large surfaces. The site should feel like a product, not a portfolio template. Confidence through restraint.

## 2. Color palette and roles

| Role | Token | Value | Usage |
|---|---|---|---|
| Background primary | `$bg-primary` | `#09090b` | Page background, body |
| Background secondary | `$bg-secondary` | `#111113` | Alternating sections (testimonials) |
| Background tertiary | `$bg-tertiary` | `#1a1a1f` | Inset surfaces, avatars, scrollbar |
| Card background | `$bg-card` | `#141417` | All card surfaces at rest |
| Card hover | `$bg-card-hover` | `#1c1c21` | Card surfaces on hover |
| Text primary | `$text-primary` | `#fafafa` | Headings, names, strong labels |
| Text secondary | `$text-secondary` | `#a1a1aa` | Body text, descriptions |
| Text tertiary | `$text-tertiary` | `#71717a` | Captions, hints, timestamps |
| Accent primary | `$accent-primary` | `#6366f1` | Links, active states, icon tints |
| Accent secondary | `$accent-secondary` | `#8b5cf6` | Gradient endpoint only |
| Accent gradient | `$accent-gradient` | `linear-gradient(135deg, #6366f1, #8b5cf6)` | CTA buttons, gradient text, avatar rings |
| Accent glow | `$accent-glow` | `rgba(#6366f1, 0.15)` | Ambient radial blurs behind sections |
| Border subtle | `$border-subtle` | `rgba(255,255,255, 0.06)` | Card borders, dividers at rest |
| Border hover | `$border-hover` | `rgba(255,255,255, 0.1)` | Card borders on hover, input focus ring |
| Success | — | `#34d399` | Trust checkmarks, status dots |
| Star rating | — | `#f5c518` | Testimonial star fill |
| Error | — | `#ef4444` / `#fca5a5` | Form error alerts |

## 3. Typography

| Level | Font family | Size | Weight | Line-height | Letter-spacing | Usage |
|---|---|---|---|---|---|---|
| Display | `$font-display` (Space Grotesk) | `$fs-5xl` 3rem | 700 | 1.1 | -0.02em | Section headlines (h2) |
| Heading 1 | `$font-display` | `$fs-4xl` 2.25rem | 700 | 1.15 | -0.025em | Page titles, hero h1 |
| Heading 2 | `$font-display` | `$fs-2xl` 1.5rem | 600 | 1.15 | -0.025em | Card titles |
| Heading 3 | `$font-display` | `$fs-lg` 1.125rem | 600 | 1.3 | -0.01em | Service card titles |
| Body | `$font-sans` (Inter) | `$fs-base` 1rem | 400 | 1.6 | 0 | Paragraphs, descriptions |
| Body small | `$font-sans` | `$fs-sm` 0.875rem | 400 | 1.6 | 0 | Card descriptions, metrics |
| Caption | `$font-sans` | `$fs-xs` 0.75rem | 500 | 1.4 | 0.12em | Eyebrow labels, tech pills, uppercase tags |
| Mono | `$font-mono` (JetBrains Mono) | `$fs-xs` | 500 | 1.4 | 0.05em | Testimonial roles, badges |
| Hero metric | `$font-display` | `$fs-4xl` | 700 | 1.0 | -0.03em | Large stat numbers inside cards |

Font stacks use CSS variable-first approach: `var(--font-sans), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`. Next.js `next/font/google` loads Inter, Space Grotesk, and JetBrains Mono with `display: swap`.

## 4. Component styles

### Button — Primary (inverted)
- Background: `$text-primary` (#fafafa)
- Color: `$bg-primary` (#09090b)
- Padding: 14px 28px
- Border-radius: `$radius-full` (9999px)
- Font-size: `$fs-base`, weight 500
- Box-shadow: `0 0 30px -5px rgba(255,255,255, 0.25)`
- Hover: translateY(-2px), shadow intensifies to 0.4 alpha
- Used for: final CTA ("Start your build")

### Button — Accent (gradient)
- Background: `$accent-gradient`
- Color: white
- Padding: 14px 28px (hero), 10px 20px (navbar)
- Border-radius: `$radius-full`
- Hover: opacity 0.9, translateY(-1px), box-shadow `0 4px 20px rgba($accent-primary, 0.4)`
- Used for: "Let's Talk", form submit

### Button — Ghost (outline)
- Background: transparent
- Border: 1px solid `$border-hover`
- Color: `$text-primary`
- Hover: background rgba(255,255,255, 0.05), border lightens, translateY(-2px)
- Used for: secondary actions ("View all projects")

### Card
- Background: `$bg-card`
- Border: 1px solid `$border-subtle`
- Border-radius: `$radius-lg` (16px)
- Padding: `$spacing-xl` (2rem), md+ `$spacing-2xl` (3rem) minus 0.5rem
- Hover: border → `$border-hover`, background → `$bg-card-hover`, translateY(-4px), box-shadow `0 20px 50px -20px rgba($accent-primary, 0.18)`
- Transition: `$transition-base` (250ms cubic-bezier(0.4, 0, 0.2, 1))
- No shadows at rest — depth comes from borders only

### Input / Textarea
- Background: rgba(255,255,255, 0.03)
- Border: 1px solid `$border-subtle`
- Border-radius: `$radius-md` (10px)
- Padding: 12px 16px
- Color: `$text-primary`
- Placeholder: `$text-tertiary`
- Hover: border → `$border-hover`
- Focus: border → `$accent-primary`, background → rgba($accent-primary, 0.03), box-shadow `0 0 0 3px rgba($accent-primary, 0.1)`

### Tech pill / Badge
- Background: rgba(255,255,255, 0.04)
- Border: 1px solid `$border-subtle`
- Border-radius: `$radius-full`
- Padding: 4px 10px
- Font: `$fs-xs`, weight 500
- Color: `$text-secondary`

### Eyebrow label
- Display: inline-flex with items-center
- Border: 1px solid `$border-hover`
- Border-radius: `$radius-full`
- Padding: 6px 14px
- Font: `$fs-xs`, weight 500, uppercase, letter-spacing 0.12em
- Color: `$text-secondary`
- Often includes a static green dot (6px, #34d399)

### Trust check item
- Green circle: 20x20px, background rgba(#34d399, 0.15), color #34d399
- Checkmark SVG inside: 12x12px
- Text: `$fs-sm`, `$text-secondary` (first item gets `$fs-base`, `$fw-semibold`, `$text-primary`)

### USP badge (above CTA)
- Background: rgba($accent-primary, 0.1)
- Border: 1px solid rgba($accent-primary, 0.25)
- Border-radius: `$radius-full`
- Padding: 10px 24px
- Font: `$fs-base` mobile / `$fs-lg` desktop, weight 600
- Color: `$text-primary`

## 5. Layout principles

- Base unit: 4px (all spacing derives from `$spacing-*` scale)
- Spacing scale: xs 0.25rem, sm 0.5rem, md 1rem, lg 1.5rem, xl 2rem, 2xl 3rem, 3xl 4rem, 4xl 6rem, 5xl 8rem
- Max content width: `$max-width` 1200px
- Container padding: `$spacing-lg` (1.5rem) mobile, `$spacing-2xl` (3rem) md+
- Section padding: `$spacing-4xl` (6rem) vertical mobile, `$spacing-5xl` (8rem) md+
- Navbar height: `$navbar-height` 72px
- Grid gaps: `$spacing-lg` (1.5rem) between cards
- Grids: 1 column mobile → 2 columns md (768px) → 3 or 4 columns lg (1024px)
- Border-radius scale: sm 6px (link underlines), md 10px (inputs), lg 16px (cards, sections), xl 24px (modals), full 9999px (buttons, pills, badges)

## 6. Depth and elevation

Depth is achieved through borders, not shadows. Shadows appear only on hover and CTAs.

| Level | Usage | Shadow |
|---|---|---|
| 0 | Page background | none |
| 1 | Cards at rest | none — 1px border `$border-subtle` provides separation |
| 1 hover | Cards on hover | `0 20px 50px -20px rgba($accent-primary, 0.18)` |
| 2 | Primary CTA button | `0 0 30px -5px rgba(255,255,255, 0.25)` |
| 2 hover | CTA hover | `0 0 40px -5px rgba(255,255,255, 0.4)` |
| 3 | Accent buttons hover | `0 4px 20px rgba($accent-primary, 0.4)` |
| Ambient | Section backgrounds | Radial gradient blurs (`rgba($accent-primary, 0.12)`), `filter: blur(60px)`, pointer-events none |

Glass effect (navbar, mobile menu): `backdrop-filter: blur(20-30px)`, `background: rgba($bg-primary, 0.75-0.97)`.

## 7. Do's and don'ts

Do:
- Use borders for card separation, never box-shadow at rest
- Keep letter-spacing negative on all headings (-0.01em to -0.03em)
- Use `$accent-gradient` only for: CTA backgrounds, gradient-text headings, avatar circles
- Use framer-motion `whileInView` with `once: true` for scroll reveals
- Use SCSS modules for all component styling — one `.module.scss` per component
- Prefix all form IDs to avoid collisions (e.g., `contact-name`, `contact-email`)
- Use `$transition-base` (250ms) for most hover effects
- Use `position: absolute` (not `fixed`) for overlays inside framer-motion transformed parents

Don't:
- Don't use Tailwind — this project uses SCSS modules exclusively
- Don't use external UI libraries (shadcn, Radix, Chakra, MUI)
- Don't use `animate-pulse` or continuous animations — they steal attention from content
- Don't use gradients on card backgrounds or large surfaces
- Don't use emojis in UI components — use SVG icons or plain text
- Don't use carousels — show all items in a static grid instead
- Don't add shadows to cards at rest — only on hover
- Don't mix warm and cool grays — all grays are zinc-based (cool)
- Don't use more than 2 font weights on a single card (typically medium + semibold)
- Don't use `position: fixed` inside a framer-motion `<motion.*>` parent — transforms break it

## 8. Responsive behavior

| Breakpoint | Token | Width | Behavior |
|---|---|---|---|
| Base | — | < 640px | Single column, stacked cards, hamburger menu |
| sm | `$bp-sm` | 640px | 2-column form rows |
| md | `$bp-md` | 768px | 2-column card grids, increased section padding |
| lg | `$bp-lg` | 1024px | 3-4 column grids, desktop nav visible, hamburger hidden |
| xl | `$bp-xl` | 1280px | Max content width reached |

- Mobile menu: `position: absolute` inside fixed navbar, `height: calc(100dvh - 72px)`, glass blur 0.97
- Touch targets: all buttons minimum 44px tap area
- Font sizes: headings step down one size tier on mobile (e.g., `$fs-5xl` → `$fs-4xl`)
- Body text never drops below `$fs-sm` (0.875rem / 14px)
- `body` overflow hidden when mobile menu is open

## 9. Agent prompt guide

### Quick palette
```
bg=#09090b  surface=#141417  card-hover=#1c1c21
accent=#6366f1  accent2=#8b5cf6  text=#fafafa
text-muted=#a1a1aa  text-dim=#71717a  border=rgba(255,255,255,0.06)
success=#34d399  star=#f5c518  error=#ef4444
```

### File structure
```
src/components/[Name]/[Name].tsx       — 'use client' if interactive
src/components/[Name]/[Name].module.scss — styles
src/styles/_variables.scss             — all design tokens
src/styles/_mixins.scss                — glass, gradient-text, card, button-base, section-padding, container
```

### Every new section needs
1. `@include section-padding` on the section element
2. `@include container` on the inner wrapper
3. `SectionHeading` component (label, title, optional description)
4. `ScrollReveal` wrapper for staggered entrance
5. `id` attribute for anchor linking from navbar

### Ready-to-use patterns

**"Add a new section"** → dark bg, section-padding top/bottom, container max-width 1200px, SectionHeading at top, ScrollReveal wrappers, cards in a 3-column grid at lg

**"Add a card grid"** → `display: grid`, 1fr mobile, `repeat(2, 1fr)` at md, `repeat(3, 1fr)` at lg, gap `$spacing-lg`, each card uses `@include card` mixin

**"Add a CTA block"** → centered flex column, USP badge pill above, primary inverted button (white bg, dark text, full-radius), sub-note below in `$fs-sm $text-tertiary`

**"Add a form"** → `@include card` wrapper, fields in 2-column grid at sm, inputs with subtle bg + border + focus ring, gradient submit button, reply-note caption, success/error alerts with motion fade-in

**"Add a trust bar"** → `@include glass` background, `@include card`-style border, 3-column grid at md, green checkmark circles + text, first item visually weighted heavier
