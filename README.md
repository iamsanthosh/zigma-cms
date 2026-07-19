# Zigma Website Builder — CMS + Public Site

A configuration-driven website builder for the Zigma Technologies template:
a Next.js public site that renders entirely from database content, and a
matching admin CMS to manage every page, section, menu, product, service,
media asset, and site-wide setting without touching code.

> **Status: generated and internally verified, not yet run against a live
> environment.** Every `.js`/`.jsx` file in this repo has been checked with
> a real JSX-aware syntax parser (esbuild) and passes clean; `schema.sql` is
> brace-balanced; every JSON config file is valid JSON. What has **not**
> happened in this environment: `npm install` (no package registry access
> here), a live `next build`, or a connection to a real MySQL instance. Budget
> a first-run debugging session — Section 8 below is a checklist for exactly
> that.

---

## Table of contents

0. [What changed in the last review pass](#0-what-changed-in-the-last-review-pass)
1. [Architecture overview](#1-architecture-overview)
2. [Data model](#2-data-model)
3. [Admin panel structure](#3-admin-panel-structure)
4. [Products/Services modal flow](#4-productsservices-modal-flow)
5. [Repository layout](#5-repository-layout)
6. [Local setup, step by step](#6-local-setup-step-by-step)
7. [Environment variables reference](#7-environment-variables-reference)
8. [First-run checklist / known risk areas](#8-first-run-checklist--known-risk-areas)
9. [Deploying to Hostinger, step by step](#9-deploying-to-hostinger-step-by-step)
10. [Day-to-day admin workflows](#10-day-to-day-admin-workflows)
11. [Extending the system](#11-extending-the-system)
12. [Troubleshooting](#12-troubleshooting)

---

## 0. What changed in the last review pass

1. **Seed data rewritten from the real template.** `lib/defaultContent.js` is
   the single source of truth — every hero slide, stat, why-card, feature,
   timeline entry, project, industry, and testimonial is copied from the
   static HTML, not placeholder text.
2. **`db:migrate` / `db:seed` are Node scripts**, not `mysql` CLI shell-outs
   — `scripts/migrate.js` and `scripts/seed.js` — so they work identically
   on Hostinger, CI, or any machine with just Node installed, no `mysql`
   binary required.
3. **No stray placeholder folders.** A leftover artifact directory from an
   earlier build step was found and removed; confirmed zero empty
   directories remain anywhere in the tree.
4. **Local dev bypasses login.** When `NODE_ENV !== 'production'`, `/admin`
   skips the login screen entirely (`lib/auth.js` → `isDevBypassEnabled()`).
   Hard-disabled in production regardless of any env var, so it can't leak
   into a real deploy.
5. **No-DB / no-data fallback.** Every function in `lib/content.js` tries
   the database first and falls back to `lib/defaultContent.js` if the
   query throws (DB not configured yet) or returns nothing (page not yet
   published) — the public site always renders the real template content,
   never a blank page.
6. **Real Products & Services pages**, not just a homepage anchor:
   `/products-services` (listing) and `/products-services/[type]/[slug]`
   (SEO-friendly detail page per item), alongside the tile-click popup
   modal the original spec calls for.
7. **Structural fidelity fixes** found by diffing against the original
   HTML: the header's `.header-right` was nested inside `<nav>` instead of
   being a flex sibling (broke the layout the CSS expects); the mega-menu
   only supported one column per dropdown instead of the template's real
   multi-column layout; an invented "emergency pill" that never existed in
   the source template was removed; the why-section, stat bar, split-feature
   bands, legacy timeline, projects grid, and industries grid were rebuilt
   to match the template's actual markup and CSS classes.
8. **Admin gaps closed**: per-item hide/show inside repeaters (slides,
   bullets, stats, timeline entries...), SEO fields (meta title/description/
   canonical/OG image), a Reusable Blocks admin screen, and a real gallery
   manager for product/service popup media.

---

## 1. Architecture overview

```
Next.js (App Router)
├── Public site   — app/(site)/**           Server Components, ISR (60s)
├── Admin CMS     — app/admin/**             Client Components + fetch to /api/admin
├── API layer     — app/api/admin/**         Generic CRUD + a few bespoke routes
│                   app/api/public/**        Read-only JSON for client components
├── Data layer    — lib/db.js (mysql2 pool), lib/content.js (fallback-aware reads)
└── MySQL         — schema.sql               Hostinger managed MySQL
```

- **Rendering strategy**: every public page is fetched server-side from
  MySQL (`lib/content.js`) and rendered by `SectionRenderer`, which maps a
  section's `type` column to a React component. `revalidate = 60` gives you
  ISR — publish a change and it's live within a minute, no rebuild/deploy
  needed.
- **Configuration-driven sections**: a page is just an ordered list of rows
  in `sections`, each with a `type` and a JSON `data` blob. `lib/sectionSchemas.js`
  declares the field shape for every type once; the admin's `DynamicForm`
  component reads that same schema to render the right inputs, including
  nested repeaters (slides, bullets, stats, milestones, testimonials,
  industries...) with individual hide/show per item.
- **No-DB fallback**: `lib/defaultContent.js` mirrors the real template
  content in one JS module. `lib/content.js` reads the DB first and falls
  back to this module on any failure or empty result, and `scripts/seed.js`
  loads the exact same module into MySQL — so the "default" content and the
  "seeded" content can never drift apart.
- **Generic CRUD**: `app/api/admin/[resource]/route.js` +
  `[resource]/[id]/route.js` serve every table in `lib/resources.js` (pages,
  menus, menu_items, sections, section_items, products, services, media,
  site_settings, theme_settings, users, inquiries, item_media...) through
  one code path, with a field whitelist per resource so nothing beyond
  what's declared can ever be written.
- **Publish / preview**: `app/api/admin/publish/route.js` snapshots a
  page's current sections into `publish_versions` (on Publish) or
  `preview_versions` behind a random token (on Preview), rendered at
  `/preview/[token]`, so editors can share an unpublished draft link
  without it affecting the live site.

## 2. Data model

See `schema.sql` for the full DDL. Summary:

| Table | Purpose |
|---|---|
| `users` | Admin/editor logins, bcrypt-hashed |
| `site_settings`, `theme_settings` | Key/value global config + CSS-variable design tokens |
| `menus`, `menu_items` | Nav + mega-menu columns + footer link columns |
| `pages` | One row per route; `publish_status`, `visible`, `active`, `order` |
| `sections`, `section_items` | Ordered content blocks per page (+ repeatable child rows) |
| `reusable_blocks` | A section's `data` can be sourced from here to reuse one block on many pages |
| `media_assets`, `item_media` | Media library + per-product/service galleries |
| `products`, `services` | Tile/modal content, specs, tags, CTAs, SEO |
| `inquiries` | Contact/quote form submissions |
| `seo_metadata` | Reusable per-page/per-item SEO fields |
| `publish_versions`, `preview_versions` | Content snapshots for publish/preview |

## 3. Admin panel structure

`/admin` (protected by `middleware.js`, session cookie is a JWT — see
Section 6 for the local dev bypass):

- **Dashboard** — content counts at a glance
- **Pages** — list, create, delete, hide/show → **Page editor**: page
  fields + SEO fields + the section manager (add/edit/delete/reorder/
  hide-show any section type via `DynamicForm`, link a section to a
  Reusable Block) + Preview/Publish
- **Menus & Navigation** — manage nav + true multi-column mega-menu
  columns + footer link columns
- **Reusable Blocks** — build a section once, link it into any page; editing
  the block updates every page it's linked to
- **Products** / **Services** — full CRUD: title, subtitle, description,
  specs table, price, tags, CTA, thumbnail, SEO fields, and a gallery
  manager for the popup's images/videos
- **Media Library** — upload (writes to `/public/uploads` today; see the
  swap-in note in `app/api/admin/upload/route.js` for CDN storage), alt
  text, delete
- **Site & Theme Settings** — logo, contact info, CTAs, footer text, and
  color tokens (writes straight to the CSS custom properties the public
  template already uses)
- **Admin Users** — create/disable editor & admin logins
- **Inquiries** — contact/quote-request form submissions

## 4. Products/Services modal flow

`components/site/sections/ProductsGrid.jsx` fetches the list from
`/api/public/products` and `/api/public/services`. Clicking a tile fetches
the *full* record (including its media gallery) and opens `ItemModal` —
title, subtitle, description, spec table, tag pills, a background hero
image/video, a scrollable gallery of the remaining media, the configured
CTA button, and a permalink to the standalone detail page at
`/products-services/[type]/[slug]` for SEO/direct linking.

## 5. Repository layout

```
zigma-cms/
├── .env.example              Copy to .env and fill in
├── package.json               Scripts + dependencies (see below)
├── next.config.js             Standalone output, image domains
├── jsconfig.json              @/ import alias
├── middleware.js              Protects /admin, dev-mode bypass
├── schema.sql                 Full MySQL DDL
├── scripts/
│   ├── migrate.js              node scripts/migrate.js  — runs schema.sql
│   ├── seed.js                 node scripts/seed.js     — loads defaultContent.js
│   └── create-admin.js         node scripts/create-admin.js "Name" email pass
├── lib/
│   ├── db.js                   mysql2 pool + query()/withTransaction()
│   ├── auth.js                 JWT session, bcrypt, dev bypass
│   ├── content.js               DB-first reads with defaultContent.js fallback
│   ├── defaultContent.js        Real template content (single source of truth)
│   ├── resources.js             Generic-CRUD resource registry
│   ├── sectionSchemas.js        Field schema per section type
│   └── repeater.js              Shared "visibleItems()" filter helper
├── components/
│   ├── site/                    Public-facing components (Header, Footer,
│   │                            SectionRenderer, sections/*)
│   └── admin/                   Admin UI (AdminShell, DynamicForm,
│                                 SectionList, ItemsAdmin, MediaPicker,
│                                 GalleryManager, SeoFields)
├── app/
│   ├── layout.js                 Root layout, loads globals.css
│   ├── globals.css               Template CSS (extracted verbatim) + admin styles
│   ├── (site)/                   Public route group
│   │   ├── layout.js              Header/Footer chrome, theme CSS injection
│   │   ├── page.js                Homepage
│   │   ├── [slug]/page.js         Any other CMS-managed page
│   │   └── products-services/     Listing + [type]/[slug] detail pages
│   ├── admin/                    Admin route group (see Section 3)
│   ├── preview/[token]/page.js   Unpublished-draft preview by token
│   └── api/
│       ├── admin/                 Generic CRUD + auth/upload/publish/reorder
│       └── public/                Read-only JSON for client-side sections
└── public/uploads/               Local media storage (swap for CDN later)
```

## 6. Local setup, step by step

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in your values
cp .env.example .env
# at minimum, set DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME
# and JWT_SECRET to a long random string

# 3. Create the database (if it doesn't exist yet)
#    e.g. via phpMyAdmin, `mysql -u root -p -e "CREATE DATABASE zigma_cms"`,
#    or your MySQL client of choice

# 4. Run the schema migration
npm run db:migrate

# 5. Load the real template content
npm run db:seed

# 6. Create your first login (skip this in local dev — see below)
npm run create-admin -- "Your Name" you@zigma-technologies.com "StrongPass123!"

# 7. Start the dev server
npm run dev
```

Then open:
- **Public site**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin

**About step 6 in local dev**: by default `DEV_BYPASS_AUTH=true` in
`.env.example`, and whenever `NODE_ENV !== 'production'` the admin panel
skips login entirely — you'll land straight on the dashboard without
creating a user or signing in. Run `create-admin` anyway if you want to
test the real login screen (set `DEV_BYPASS_AUTH=false` in `.env` first), or
skip both entirely for pure local iteration.

**About the database being optional at first**: even with an empty or
unreachable database, `npm run dev` will still render the full homepage
with real content, because `lib/content.js` falls back to
`lib/defaultContent.js`. This means you can `npm install && npm run dev`
with zero DB setup just to look at the public site. The moment you want to
*edit* content through `/admin`, you'll need the database connected and
migrated.

## 7. Environment variables reference

All of these live in `.env` (copy from `.env.example`, never commit the
real file):

| Variable | Purpose | Example |
|---|---|---|
| `DB_HOST` | MySQL host | `localhost` or Hostinger's DB host |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL user | `u123_zigma` |
| `DB_PASSWORD` | MySQL password | — |
| `DB_NAME` | MySQL database name | `u123_zigma_cms` |
| `JWT_SECRET` | Signs admin session cookies — long random string | — |
| `JWT_EXPIRES_IN` | Session lifetime | `7d` |
| `COOKIE_NAME` | Session cookie name | `zigma_admin_session` |
| `DEV_BYPASS_AUTH` | Set `false` to force real login even in dev | `true` |
| `MEDIA_BASE_URL` | Base path media URLs are served from | `/uploads` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (metadata, absolute links) | `https://zigma-technologies.com` |

## 8. First-run checklist / known risk areas

This was written and internally verified (syntax-checked, SQL brace-
balanced, JSON validated) but **has not been executed against a live
database or browser**. Work through these in order on first run:

1. `npm install` — confirm it completes without peer-dependency conflicts
   given your Node version (`engines.node >= 18.18.0` in `package.json`).
2. `npm run db:migrate` — confirm `schema.sql` applies cleanly against your
   actual MySQL/MariaDB version. Requires MySQL 5.7+ / MariaDB 10.2+ for
   the JSON column types used.
3. `npm run db:seed` — confirm it completes without foreign-key errors
   (it seeds in dependency order: settings → menus → pages/sections →
   products/services).
4. `npm run dev`, click through every `/admin` screen — Pages, Menus,
   Reusable Blocks, Products, Services, Media, Settings, Users, Inquiries.
5. **Middleware + Edge runtime**: `middleware.js` sets
   `export const runtime = 'nodejs'` to keep `jsonwebtoken` (which needs
   Node's `crypto` module) working. If your Next.js/hosting setup rejects
   that flag, swap `jsonwebtoken` for an Edge-compatible library such as
   `jose`, or move the JWT verification into a route handler instead of
   middleware.
6. **Visual fidelity**: the CSS was extracted verbatim from the original
   template into `app/globals.css`, and the JSX markup was rebuilt to match
   the real DOM structure and class names section-by-section (header,
   hero, why-grid, stat bar, all five split-feature bands, legacy timeline,
   projects, industries, testimonials, partners marquee, cert teaser, CTA
   band, footer). This was checked by re-reading the source HTML, but a
   literal side-by-side rendering diff still needs a browser — do that
   pass before calling this production-ready.
7. `npm run build` — the first real production build will surface anything
   the syntax checker can't catch (type mismatches, missing exports,
   Next.js-specific constraints).

## 9. Deploying to Hostinger, step by step

1. **Provision the database.** In hPanel, create a managed MySQL database.
   Note the host, port, username, password, and database name.
2. **Push to GitHub** (or your Git host of choice) and connect the repo in
   hPanel's Node.js application screen, or deploy directly from your IDE
   per Hostinger's docs.
3. **Configure the app**:
   - Entry point: `npm run build && npm run start`
   - `package.json`'s `start` script runs `next start -p 3000` — adjust the
     port if Hostinger requires binding to a specific `PORT` env var.
4. **Set environment variables** in the Hostinger app config panel — every
   value from `.env.example`, with real production secrets. Never commit
   `.env`. Set `DEV_BYPASS_AUTH` to `false` (or omit it — it only applies
   when `NODE_ENV !== 'production'`, and Hostinger sets
   `NODE_ENV=production` in its Node hosting by default, so the bypass is
   already inert there).
5. **Run migration, seed, and create your admin user once**, against the
   managed MySQL instance, via SSH or a one-off Node run in the Hostinger
   environment:
   ```bash
   npm run db:migrate
   npm run db:seed
   npm run create-admin -- "Your Name" you@zigma-technologies.com "StrongPass123!"
   ```
6. **Point your domain** at the app. Hostinger's included SSL, CDN, and WAF
   apply automatically at the hosting layer — no application changes
   needed.
7. **Backups**: rely on Hostinger's daily managed-MySQL backups; optionally
   add a `mysqldump` cron job (or a manual export before major content
   changes) for an additional restore point.
8. **Media storage**: uploads write to `/public/uploads` on disk by
   default, which works out of the box on Hostinger's 50GB NVMe Node
   hosting. If you outgrow local storage, replace the write call in
   `app/api/admin/upload/route.js` with your storage provider's SDK and
   update `MEDIA_BASE_URL` — nothing else in the app needs to change, since
   every consumer only ever reads `media_assets.url`.

## 10. Day-to-day admin workflows

- **Edit a page**: `/admin/pages` → pick a page → edit page fields/SEO,
  then add/edit/reorder/hide sections in the section list. Each section's
  fields come from `lib/sectionSchemas.js` via `DynamicForm` — repeater
  items (slides, cards, milestones...) each have their own Hide/Show
  toggle without deleting them.
- **Reuse a section across pages**: `/admin/blocks` → create a block →
  back in a page's section editor, set "Content source" to that block.
  Editing the block from then on updates every page using it.
- **Add a product/service**: `/admin/products` or `/admin/services` → New →
  fill in fields → Save → then use the Gallery Manager on the saved item to
  attach images/videos for the popup modal, and the SEO Fields panel for
  meta tags.
- **Change site-wide colors**: `/admin/settings` → Theme colors — these map
  directly to the CSS custom properties the public template already uses,
  so a change is live everywhere within the page's ISR window (60s).
- **Preview before publishing**: in a page editor, click Preview to get a
  shareable `/preview/[token]` link showing the current draft without
  affecting the live site; click Publish to make it live.

## 11. Extending the system

- **New section type**: add a schema entry to `lib/sectionSchemas.js`, add
  a matching component under `components/site/sections/`, register it in
  `components/site/SectionRenderer.jsx`. The admin form appears
  automatically — no new admin screen to build.
- **New admin-editable table**: add one entry to `lib/resources.js`
  (table name, field whitelist, JSON columns) and the generic CRUD API at
  `/api/admin/<resource>` is live immediately.
- **New template**: `pages.template` already exists in the schema for this
  purpose. Add the new template's section types, components, and a second
  stylesheet loaded per-`pages.template` value.

## 12. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `/admin` redirects to login in production unexpectedly | `DEV_BYPASS_AUTH` doesn't apply in production by design | Run `npm run create-admin` and log in normally |
| Public site shows template content but admin edits don't appear | DB query failing silently, falling back to `defaultContent.js` | Check server logs for `[content] DB query failed` and fix the DB connection |
| `npm run db:migrate` fails with a JSON-type error | MySQL/MariaDB version too old | Upgrade to MySQL 5.7.8+ / MariaDB 10.2+ |
| Middleware throws at runtime referencing `crypto` | Edge runtime rejecting `jsonwebtoken` | See Section 8, item 5 |
| Uploaded media 404s after deploy | `/public/uploads` not persisted across deploys | Point `MEDIA_BASE_URL` at persistent/CDN storage per the note in `app/api/admin/upload/route.js` |
