# Retro Clothing — Luxury Made Affordable

A dark-luxury, glassmorphism fashion e-commerce frontend built with **React + Vite + Tailwind CSS + Framer Motion**, implementing the design language, page structure and WhatsApp-ordering flow from the project brief.

## Quick start

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

Admin panel: go to `/admin/login`
Demo credentials: **admin@retroclothing.in / retro2026**

---

## What's implemented

- **Cinematic scroll-controlled Hero** — one continuous scroll-scrubbed sequence (RETRO → LUXURY → MADE AFFORDABLE) built with Framer Motion `useScroll`/`useTransform` and CSS 3D transforms. No heavy 3D engine, so it stays light on mobile, and it respects `prefers-reduced-motion`.
- **Dark luxury glassmorphism design system** — monochrome palette, Fraunces (serif/display) + Inter (sans/body) type pairing, `.glass` / `.glass-strong` utility classes, soft-rounded product cards, film-grain overlay.
- **Full page set**: Home, All Collection, New Arrivals, Offer Products, Shirts / Tees / Pants category pages, Product Detail (gallery + size selector + WhatsApp CTA), Our Story, Contact.
- **Search & filters**: expanding home search, debounced collection search, filter drawer (price band, size, new/offer/featured tags), Clear Filters, empty states.
- **WhatsApp ordering** (`src/lib/whatsapp.js`): builds a pre-filled `wa.me` message with product name, code, size, price and link — no payment checkout, per the brief.
- **AI chatbot widget**: floating glass chatbot on every page, rule-based demo assistant that answers questions about sizes, COD, delivery, offers and location, plus a "chat on WhatsApp" fallback.
- **Admin Panel** (`/admin`): protected routes, dashboard with live stats, product CRUD (images, sizes, pricing, category, new/offer/featured flags), announcement CRUD, contact-message inbox, company-settings editor. All changes reflect on the public site immediately.
- **Reusable components**: ProductCard, CategoryCard, filter drawer, section headings, skeleton/empty states, admin form fields, etc.
- Responsive, mobile-first layout; keyboard-focusable controls; reduced-motion support.

## What's mocked (and why)

This sandbox can't provision a live Supabase project or run a real Node/Express backend for you, so two layers are simulated **using the exact data shape described in the brief**, so swapping them for the real thing is a drop-in change, not a rewrite:

| Layer | File | Real implementation |
|---|---|---|
| Database (products, announcements, reviews, messages, settings) | `src/lib/store.js`, `src/lib/data.js` | Supabase Postgres tables (`products`, `product_images`, `product_sizes`, `announcements`, `company_settings`, `contact_messages`, `reviews`) exactly as named in the brief |
| Admin auth | `auth` object in `src/lib/store.js` | Supabase Authentication |
| Image storage | Image URL fields / picsum placeholders | Supabase Storage buckets (`products/`, `announcements/`, `company/`) |
| Product photography | `picsum.photos` placeholder images | Your real product photos |
| Logo | `src/components/common/RetroMark.jsx` (placeholder monogram) | Your uploaded Retro Clothing logo file |

Everything currently persists to the browser's `localStorage` so the demo is fully interactive without any backend setup.

## Connecting Supabase (migration path)

1. Create a Supabase project and run migrations for the tables listed above (see brief section 62 for exact columns) with the Row Level Security policies from section 64–65 (public read on products/announcements/reviews, admin-only writes).
2. Install the client: `npm install @supabase/supabase-js`.
3. Replace the functions in `src/lib/store.js` (`db.getProducts`, `db.saveProduct`, …) with `supabase.from('products').select()/insert()/update()/delete()` calls — the function names and return shapes are already designed to match, so calling code elsewhere doesn't change.
4. Replace `auth.signIn` / `auth.signOut` / `auth.getSession` with `supabase.auth.signInWithPassword`, `signOut`, `getSession`.
5. Swap the image-URL fields for `supabase.storage.from('products').upload(...)` + `getPublicUrl(...)` in `src/pages/admin/AdminProductForm.jsx`.
6. Move the WhatsApp number and other company fields to `company_settings` reads instead of local state (already isolated in `useSettings()`).

## Project structure

```
src/
├── components/
│   ├── common/       # ProductCard, CategoryCard, shared UI, icons
│   ├── layout/        # Header, Footer, MobileMenu
│   ├── home/          # Hero, Announcement/Reviews/StoryTeaser sections
│   └── chatbot/        # Floating AI chatbot widget
├── pages/
│   ├── Home.jsx, CollectionPage.jsx, ProductDetail.jsx, OurStory.jsx, Contact.jsx
│   └── admin/         # AdminLogin, AdminLayout, Dashboard, Products, Announcements, Messages, Settings
├── hooks/useStore.js   # subscribes components to the local data layer
├── lib/
│   ├── data.js         # seed data, shaped like the Supabase schema
│   ├── store.js         # localStorage CRUD + demo auth (Supabase seam)
│   └── whatsapp.js       # WhatsApp order message builder
└── index.css            # design tokens, fonts, glass utilities
```

## Notes

- Company details (address, phone numbers, WhatsApp number, founder info, story copy) live in **Admin → Company Settings** and flow through the whole site via `useSettings()` — nothing is hardcoded twice.
- SEO basics (meta description, theme color, semantic headings) are in `index.html`; for full sitemap/schema/OG-tag coverage once this moves to a real backend, add `react-helmet-async` or switch the product/category routes to a server-rendered framework (Next.js) so crawlers see per-page metadata.
- The 3D Hero is intentionally CSS/Framer-Motion based rather than Three.js/WebGL, to keep first-load weight low — this can be swapped for a full WebGL scene later if you want heavier depth and lighting.
