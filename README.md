# Zigma Website Builder

A configuration-driven website builder for Zigma Technologies template. Features a Next.js public site that renders entirely from database content, and a matching admin CMS to manage pages, sections, menus, products, services, media assets, and site-wide settings without touching code.

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Local Setup](#local-setup)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Admin Panel](#admin-panel)
- [Deployment](#deployment)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# One-command database setup (creates DB, runs migrations, seeds content, creates admin)
npm run db:setup

# Start development server
npm run dev
```

Visit http://localhost:3000 for the public site and http://localhost:3000/admin for the admin panel.

---

## Architecture

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MySQL/MariaDB with mysql2
- **Authentication**: JWT with bcryptjs
- **Styling**: Custom CSS extracted from original template
- **Runtime**: Node.js 18+

### Key Concepts

**Configuration-Driven Sections**
- Pages are ordered lists of section rows from the database
- Each section has a `type` and JSON `data` blob
- `lib/sectionSchemas.js` defines field shapes for all section types
- Admin's `DynamicForm` auto-renders inputs based on schemas
- Supports nested repeaters (slides, cards, stats, milestones) with per-item hide/show

**No-DB Fallback**
- `lib/defaultContent.js` contains real template content (single source of truth)
- `lib/content.js` reads DB first, falls back to defaultContent on failure
- `scripts/seed.js` loads the same module into MySQL
- Public site always renders real content, never blank pages

**Generic CRUD API**
- `app/api/admin/[resource]/route.js` handles all tables
- `lib/resources.js` defines table schemas and field whitelists
- Automatic CRUD for pages, menus, sections, products, services, media, settings, users

**Publish & Preview**
- Publish snapshots sections to `publish_versions` table
- Preview creates temporary tokens in `preview_versions`
- Shareable preview links at `/preview/[token]`

---

## Folder Structure

```
zigma-cms/
├── app/                          # Next.js App Router
│   ├── (site)/                   # Public site routes
│   │   ├── layout.js             # Header/Footer chrome
│   │   ├── page.js               # Homepage
│   │   ├── [slug]/page.js        # CMS pages
│   │   └── products-services/     # Products/Services listing & details
│   ├── admin/                    # Admin panel routes
│   │   ├── dashboard/           # Dashboard
│   │   ├── pages/                # Page management
│   │   ├── menus/                # Navigation management
│   │   ├── blocks/               # Reusable blocks
│   │   ├── products/             # Products CRUD
│   │   ├── services/             # Services CRUD
│   │   ├── media/                # Media library
│   │   ├── settings/             # Site & theme settings
│   │   ├── users/                # Admin users
│   │   └── inquiries/            # Contact form submissions
│   ├── preview/[token]/          # Preview pages
│   ├── api/
│   │   ├── admin/                # Admin API (CRUD, auth, upload, publish)
│   │   └── public/               # Public read-only API
│   ├── globals.css               # Template CSS + admin styles
│   └── layout.js                 # Root layout
├── components/
│   ├── site/                     # Public components
│   │   ├── sections/             # Section components (Hero, WhyGrid, etc.)
│   │   ├── Header.jsx            # Site header
│   │   ├── Footer.jsx            # Site footer
│   │   └── SectionRenderer.jsx   # Maps section types to components
│   └── admin/                    # Admin components
│       ├── AdminShell.jsx        # Admin layout wrapper
│       ├── DynamicForm.jsx       # Auto-form from schemas
│       ├── SectionList.jsx       # Section manager
│       ├── MediaPicker.jsx       # Image/video picker
│       ├── GalleryManager.jsx    # Product/service galleries
│       └── SeoFields.jsx         # SEO metadata fields
├── lib/
│   ├── db.js                     # MySQL pool + query helpers
│   ├── auth.js                   # JWT session, bcrypt, dev bypass
│   ├── content.js                # DB reads with fallback
│   ├── defaultContent.js         # Real template content
│   ├── resources.js              # CRUD resource registry
│   ├── sectionSchemas.js         # Section field definitions
│   └── repeater.js               # Repeater item helpers
├── scripts/
│   ├── migrate.js                # Run schema.sql
│   ├── seed.js                   # Load defaultContent.js
│   ├── db-setup.js               # Complete DB setup
│   └── create-admin.js           # Create admin user
├── public/
│   └── uploads/                  # Local media storage
├── .env.example                  # Environment template
├── .env                          # Your environment (don't commit)
├── package.json                  # Dependencies & scripts
├── next.config.js                # Next.js config
├── middleware.js                 # Auth middleware
└── schema.sql                    # Full MySQL DDL
```

---

## Local Setup

### Prerequisites

- Node.js 18.18.0 or higher
- MySQL 5.7+ or MariaDB 10.2+
- npm or yarn

### Step-by-Step

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=zigma_cms
   JWT_SECRET=your_long_random_secret_string
   ADMIN_NAME=Admin User
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=StrongPassword123!
   ```

3. **Database setup** (choose one)

   **Option A: One-command setup (recommended)**
   ```bash
   npm run db:setup
   ```
   This drops existing DB, creates fresh DB, runs migrations, seeds content, and creates admin user.

   **Option B: Manual steps**
   ```bash
   # Create database manually via MySQL client or phpMyAdmin
   # Run migrations
   npm run db:migrate
   # Seed content
   npm run db:seed
   # Create admin user
   npm run create-admin -- "Your Name" admin@example.com "password"
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

### Dev Mode Bypass

By default, `DEV_BYPASS_AUTH=true` in `.env` allows skipping login in development. The admin panel bypasses authentication when `NODE_ENV !== 'production'`. To test real login, set `DEV_BYPASS_AUTH=false` in `.env`.

---

## Database Setup

### One-Command Setup

```bash
npm run db:setup
```

This command:
1. Drops existing database (if exists)
2. Creates fresh database
3. Runs schema migrations
4. Creates admin user from `.env` variables
5. Seeds default content

### Individual Commands

```bash
npm run db:migrate          # Apply schema.sql
npm run db:seed             # Load default content
npm run create-admin NAME EMAIL PASSWORD  # Create admin user
```

### Database Schema

Key tables:

| Table | Purpose |
|-------|---------|
| `users` | Admin/editor logins (bcrypt hashed) |
| `site_settings`, `theme_settings` | Global config + CSS variables |
| `menus`, `menu_items` | Navigation + mega-menu + footer links |
| `pages` | Page routes with publish status |
| `sections`, `section_items` | Ordered content blocks |
| `reusable_blocks` | Shareable section content |
| `media_assets`, `item_media` | Media library + galleries |
| `products`, `services` | Product/service data |
| `inquiries` | Contact form submissions |
| `seo_metadata` | SEO fields per page/item |
| `publish_versions`, `preview_versions` | Content snapshots |

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DB_HOST` | Yes | MySQL host | `localhost` |
| `DB_PORT` | Yes | MySQL port | `3306` |
| `DB_USER` | Yes | MySQL username | `root` |
| `DB_PASSWORD` | Yes | MySQL password | `password` |
| `DB_NAME` | Yes | Database name | `zigma_cms` |
| `JWT_SECRET` | Yes | JWT signing secret | `long-random-string` |
| `JWT_EXPIRES_IN` | No | Session lifetime | `7d` |
| `COOKIE_NAME` | No | Session cookie name | `zigma_admin_session` |
| `DEV_BYPASS_AUTH` | No | Skip auth in dev | `true` |
| `MEDIA_BASE_URL` | No | Media URL base | `/uploads` |
| `NEXT_PUBLIC_SITE_URL` | No | Public site URL | `https://example.com` |
| `ADMIN_NAME` | No | Default admin name | `Admin User` |
| `ADMIN_EMAIL` | No | Default admin email | `admin@example.com` |
| `ADMIN_PASSWORD` | No | Default admin password | `StrongPass123!` |

---

## Admin Panel

### Features

- **Dashboard**: Content counts and quick stats
- **Pages**: Create, edit, delete, reorder pages with section management
- **Menus**: Manage navigation, mega-menus, and footer links
- **Reusable Blocks**: Create sections once, reuse across pages
- **Products & Services**: Full CRUD with galleries and SEO
- **Media Library**: Upload and manage images/videos
- **Settings**: Site settings and theme colors
- **Users**: Manage admin accounts
- **Inquiries**: View contact form submissions

### Section Types

Available section types (defined in `lib/sectionSchemas.js`):

- **Hero Slider**: Slides with images, videos, CTAs, and tag pills
- **Stat Counter Bar**: Animated statistics
- **Why Us Grid**: Icon card grid
- **Split Feature**: Image + feature cards band
- **Legacy Timeline**: Milestone timeline
- **Projects Grid**: Featured projects
- **Industries Grid**: Industries served
- **Testimonials**: Carousel
- **Partners Marquee**: Logo marquee
- **Certification Teaser**: Cert band
- **Call-to-Action**: CTA band
- **Products/Services Grid**: Dynamic product/service listing
- **Footer**: Site footer
- **Rich Text**: Freeform content

### Common Workflows

**Edit a page**
1. Go to `/admin/pages`
2. Select a page
3. Edit page fields and SEO
4. Add/edit/reorder sections
5. Preview or Publish

**Create reusable block**
1. Go to `/admin/blocks`
2. Create new block
3. In page editor, set section's "Content source" to the block

**Add product/service**
1. Go to `/admin/products` or `/admin/services`
2. Click "New"
3. Fill in fields
4. Save
5. Use Gallery Manager for images
6. Configure SEO fields

**Change theme colors**
1. Go to `/admin/settings`
2. Edit "Theme colors"
3. Changes apply globally within 60s (ISR)

---

## Deployment

### Hostinger (Node.js Hosting)

1. **Provision database**
   - Create MySQL database in hPanel
   - Note credentials

2. **Deploy code**
   - Push to GitHub
   - Connect repo in hPanel Node.js app
   - Or deploy via IDE

3. **Configure app**
   - Entry point: `npm run build && npm run start`
   - Set environment variables in hPanel
   - Set `DEV_BYPASS_AUTH=false` or omit

4. **Run setup**
   ```bash
   npm run db:migrate
   npm run db:seed
   npm run create-admin -- "Name" email "password"
   ```

5. **Point domain**
   - Configure domain in hPanel
   - SSL, CDN, WAF included

### General Deployment Checklist

- Set `NODE_ENV=production`
- Set strong `JWT_SECRET`
- Set `DEV_BYPASS_AUTH=false`
- Run database migrations
- Seed initial content
- Create admin user
- Configure media storage (CDN for production)
- Set up backups

---

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with content
npm run db:setup     # Complete database setup
npm run create-admin # Create admin user
```

### Adding New Section Types

1. Add schema to `lib/sectionSchemas.js`
2. Create component in `components/site/sections/`
3. Register in `components/site/SectionRenderer.jsx`
4. Admin form auto-generates from schema

### Adding New Admin Resources

1. Add entry to `lib/resources.js`
2. Generic CRUD API auto-available at `/api/admin/[resource]`

### Extending Templates

- `pages.template` field exists in schema
- Add new template types with custom section sets
- Load different stylesheets per template

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| `/admin` redirects to login in dev | `DEV_BYPASS_AUTH=false` | Set `DEV_BYPASS_AUTH=true` in `.env` |
| Public shows default content but edits don't appear | DB query failing | Check DB connection in logs |
| `db:migrate` fails with JSON error | MySQL version too old | Upgrade to MySQL 5.7+ / MariaDB 10.2+ |
| Middleware throws crypto error | Edge runtime issue | Check `middleware.js` runtime setting |
| Uploaded media 404s | `/public/uploads` not persisted | Configure CDN or persistent storage |
| Build fails | Missing dependencies or type errors | Run `npm install` and check logs |

### Common Database Issues

**Connection refused**
- Verify MySQL is running
- Check `DB_HOST`, `DB_PORT` in `.env`

**Access denied**
- Verify user has CREATE DATABASE permission
- Check `DB_USER`, `DB_PASSWORD` in `.env`

**Table already exists**
- `db:setup` drops DB first
- Use `db:migrate` + `db:seed` separately to preserve data
