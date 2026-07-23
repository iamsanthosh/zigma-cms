# Zigma Website Builder

A modern, configuration-driven website builder featuring a Next.js public site that renders entirely from database content, paired with a comprehensive admin CMS for managing pages, sections, menus, products, services, media assets, and site-wide settings—all without touching code.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Database Configuration](#database-configuration)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Admin Panel Guide](#admin-panel-guide)
- [Section Types](#section-types)
- [Enhanced Theme System](#enhanced-theme-system)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

Get up and running in under 5 minutes:

```bash
# 1. Clone and install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 3. One-command database setup (creates DB, runs migrations, seeds content, creates admin)
npm run db:setup

# 4. Start development server
npm run dev
```

**Access your application:**
- Public site: http://localhost:3000
- Admin panel: http://localhost:3000/admin

That's it! Your website is now fully functional with pre-populated content.

---

## 📖 Project Overview

### What is Zigma Website Builder?

Zigma Website Builder is a headless CMS built on Next.js that provides:

- **Database-driven content**: All site content stored in MySQL/MariaDB
- **Admin panel**: Full content management without code changes
- **Fallback system**: Graceful degradation when database is unavailable
- **Section-based architecture**: Modular, reusable content blocks
- **SEO-friendly**: Built-in metadata management
- **Media management**: Upload and organize images/videos
- **Enhanced theme system**: Comprehensive theme customization with page-level overrides

### Key Features

- **15+ Section Types**: Hero sliders, statistics, timelines, grids, testimonials, and more
- **Reusable Blocks**: Create content once, use across multiple pages
- **Publish & Preview**: Share draft content via preview links
- **Products & Services**: Full CRUD with galleries and SEO
- **Navigation Management**: Mega-menus, footer links, hierarchical structure
- **Enhanced Theme System**: Colors, fonts, spacing, animations, components, and page-level overrides
- **Multi-user Support**: Admin and editor roles with JWT authentication

### Who is this for?

**For Developers:**
- Clean, maintainable codebase with clear separation of concerns
- Extensible architecture for adding custom sections and features
- Database-first design with fallback system for reliability
- Comprehensive API for custom integrations

**For Content Managers:**
- Intuitive admin panel with no coding required
- Visual section editor with drag-and-drop reordering
- Real-time preview of changes before publishing
- Centralized media library for asset management

**For Business Owners:**
- Complete control over website content without developer dependency
- Professional templates with pre-built sections
- SEO optimization built-in
- Scalable architecture for growing content needs

---

## 🏗️ Architecture

### Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **MySQL/MariaDB** | Relational database for content storage |
| **mysql2** | MySQL driver with promise support |
| **JWT + bcryptjs** | Authentication and password hashing |
| **Custom CSS** | Styling extracted from original template |
| **Node.js 18+** | Runtime environment |

### Core Architecture Concepts

#### 1. Configuration-Driven Sections
- Pages are ordered lists of section rows from the database
- Each section has a `type` and JSON `data` blob
- `lib/sectionSchemas.js` defines field shapes for all section types
- Admin's `DynamicForm` auto-renders inputs based on schemas
- Supports nested repeaters (slides, cards, stats, milestones) with per-item hide/show

#### 2. Database-First with Fallback
- `lib/defaultContent.js` contains real template content (single source of truth)
- `lib/content.js` reads DB first, falls back to defaultContent on failure
- `scripts/seed.js` loads the same module into MySQL
- Public site always renders real content, never blank pages
- **Zero downtime**: Site works even if database goes down

#### 3. Generic CRUD API
- `app/api/admin/[resource]/route.js` handles all tables
- `lib/resources.js` defines table schemas and field whitelists
- Automatic CRUD for pages, menus, sections, products, services, media, settings, users

#### 4. Publish & Preview System
- Publish snapshots sections to `publish_versions` table
- Preview creates temporary tokens in `preview_versions`
- Shareable preview links at `/preview/[token]`

#### 5. Enhanced Theme System
- Theme settings stored in database with comprehensive categorization
- Support for colors, typography, spacing, animations, components, and sections
- Page-level theme overrides for per-page customization
- CSS generation from database values
- Responsive breakpoint management

---

## 🔧 Prerequisites

Ensure you have the following installed:

- **Node.js**: 18.18.0 or higher ([Download](https://nodejs.org/))
- **MySQL**: 5.7+ or **MariaDB**: 10.2+ ([MySQL Download](https://dev.mysql.com/downloads/mysql/) | [MariaDB Download](https://mariadb.org/download/))
- **npm** or **yarn**: Package manager (comes with Node.js)
- **Git**: For version control (optional but recommended)

### Verify Your Environment

```bash
node --version  # Should be 18.18.0 or higher
mysql --version # Should be 5.7+ or MariaDB 10.2+
npm --version   # Should be 9.x or higher
```

---

## 📦 Installation & Setup

### Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages defined in `package.json`.

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials. See [Environment Variables](#environment-variables) for details.

### Step 3: Database Setup

Choose one of the following methods:

#### Option A: One-Command Setup (Recommended)

```bash
npm run db:setup
```

This command:
1. Drops existing database (if exists)
2. Creates fresh database
3. Runs schema migrations
4. Creates admin user from `.env` variables
5. Seeds comprehensive default content including enhanced theme data

#### Option B: Manual Setup

```bash
# Create database manually via MySQL client or phpMyAdmin
# Run migrations
npm run db:migrate

# Seed content
npm run db:seed

# Run enhanced theme migration
node scripts/migrate-enhanced-theme.js

# Seed enhanced theme data
npm run seed:enhanced-theme

# Create admin user
npm run create-admin -- "Your Name" admin@example.com "password"
```

### Step 4: Start Development Server

```bash
npm run dev
```

The server will start at http://localhost:3000

### Step 5: Access the Application

- **Public site**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin
- **Login page**: http://localhost:3000/admin/login

### Authentication System

The application has two authentication modes: **Development Mode** and **Production Mode**.

#### Development Mode Authentication

By default, development mode bypasses authentication for faster development workflow:

```env
DEV_BYPASS_AUTH=true  # Default in .env.example
```

**With bypass enabled (`DEV_BYPASS_AUTH=true`):**
- Navigate directly to `/admin` - no login required
- You're automatically logged in as "Dev Admin (bypass)"
- Ideal for rapid development and testing
- Session cookie is not used

**To test real authentication in development:**
```env
DEV_BYPASS_AUTH=false
```

**With bypass disabled (`DEV_BYPASS_AUTH=false`):**
- Navigate to `/admin` → redirects to `/login`
- Login with credentials from `.env`:
  - Email: `ADMIN_EMAIL` (default: `admin@example.com`)
  - Password: `ADMIN_PASSWORD` (default: `StrongPassword123!`)
- Session cookie is set and used for authentication
- Mimics production authentication flow

#### Production Mode Authentication

In production (`NODE_ENV=production`), authentication is **always required** regardless of `DEV_BYPASS_AUTH` setting:

**Production authentication behavior:**
- `DEV_BYPASS_AUTH` is ignored when `NODE_ENV=production`
- All admin routes require valid login
- Navigate to `/admin` → redirects to `/login`
- Must use real admin credentials
- JWT session cookie with secure settings
- Session expires after `JWT_EXPIRES_IN` (default: 7 days)

**Production login flow:**
1. Navigate to `/admin` or any admin route
2. Redirected to `/login` (standalone page without admin chrome)
3. Enter admin email and password
4. On success, redirected to `/admin` with session cookie
5. Session persists for configured duration
6. Logout clears session and redirects to `/login`

#### Security Notes

- **Never commit `.env` file** - contains sensitive credentials
- **Use strong `JWT_SECRET`** in production (minimum 32 characters)
- **Change default admin password** immediately after first login
- **Development bypass never works in production** - enforced by code
- **Session cookies are httpOnly and secure in production**

---

## 🗄️ Database Configuration

### Database Schema Overview

The application uses the following key tables:

| Table | Purpose |
|-------|---------|
| `users` | Admin/editor accounts with bcrypt hashed passwords |
| `site_settings` | Global configuration (logo, name, social links) |
| `themes` | Theme definitions with status and metadata |
| `theme_settings` | Enhanced CSS variables for colors, fonts, spacing, animations |
| `theme_typography` | Font configurations with usage contexts |
| `theme_components` | Component-level customization |
| `theme_sections` | Section-level theme customization |
| `theme_animations` | Animation keyframes and settings |
| `theme_svg_icons` | SVG icon customization |
| `theme_breakpoints` | Responsive breakpoint settings |
| `page_theme_overrides` | Page-specific theme overrides |
| `menus` | Navigation menu definitions |
| `menu_items` | Menu items with hierarchy support (mega-menus) |
| `pages` | Page routes with publish status and templates |
| `sections` | Ordered content blocks belonging to pages |
| `section_items` | Items within sections (slides, cards, stats) |
| `reusable_blocks` | Shareable section content |
| `media_assets` | Media library (images, videos) |
| `item_media` | Gallery associations for products/services |
| `products` | Product catalog with specifications |
| `services` | Service offerings with details |
| `inquiries` | Contact form submissions |
| `seo_metadata` | SEO fields per page/item |
| `publish_versions` | Published content snapshots |
| `preview_versions` | Temporary preview tokens |

### Database Commands

```bash
# Complete database reset with seed data
npm run db:setup

# Apply schema migrations only
npm run db:migrate

# Seed default content
npm run db:seed

# Run enhanced theme migration
node scripts/migrate-enhanced-theme.js

# Seed enhanced theme data
npm run seed:enhanced-theme

# Create admin user manually
npm run create-admin -- "Full Name" email@example.com "password"
```

### Seeded Content

The `npm run db:seed` command populates your database with:

- **15+ section types** with complete content
- **Hero slider** with 5 professional slides
- **Statistics** (8 key metrics)
- **Feature cards** (6 capability items)
- **Timeline** (20-year company journey with 6 milestones)
- **Projects** (3 featured case studies)
- **Industries** (8 sectors served)
- **Testimonials** (4 client quotes)
- **Partners** (6 technology partners)
- **Navigation menus** (Main nav + Footer nav)
- **Site settings** (Company info, contact, social links)

The enhanced theme system seeds:

- **21 color variables** (primary, secondary, accent, neutral colors)
- **4 spacing values** (section padding, margins)
- **3 typography settings** (display, body, mono fonts)
- **4 breakpoints** (mobile, tablet, desktop, large desktop)
- **8 animations** (pulse, fade, slide, spin, etc.)
- **8 component styles** (buttons, cards, inputs)
- **15 section styles** (hero, features, testimonials, etc.)
- **37 SVG icons** (navigation, social, UI icons)

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL host address | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `zigma_cms` |
| `JWT_SECRET` | JWT signing secret (use strong random string) | `your-long-random-secret-key-here` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_EXPIRES_IN` | Session lifetime | `7d` |
| `COOKIE_NAME` | Session cookie name | `zigma_admin_session` |
| `DEV_BYPASS_AUTH` | Skip authentication in development | `true` |
| `MEDIA_BASE_URL` | Media URL base path | `/uploads` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for SEO | `https://example.com` |
| `ADMIN_NAME` | Default admin name for setup | `Admin User` |
| `ADMIN_EMAIL` | Default admin email for setup | `admin@example.com` |
| `ADMIN_PASSWORD` | Default admin password for setup | `StrongPassword123!` |

### Example `.env` File

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=zigma_cms

# Authentication
JWT_SECRET=your-very-long-random-secret-string-change-this-in-production
JWT_EXPIRES_IN=7d
COOKIE_NAME=zigma_admin_session
DEV_BYPASS_AUTH=true

# Media
MEDIA_BASE_URL=/uploads

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin User (used during db:setup)
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=StrongPassword123!
```

---

## 📁 Project Structure

```
zigma-cms/
├── app/                              # Next.js App Router
│   ├── (site)/                       # Public site routes
│   │   ├── layout.js                 # Header/Footer chrome with theme CSS
│   │   ├── page.js                   # Homepage
│   │   ├── [slug]/page.js            # Dynamic CMS pages
│   │   └── products-services/        # Products/Services listing & details
│   │       ├── page.js               # Products/Services listing
│   │       └── [type]/               # Product/Service detail pages
│   │           └── [slug]/page.js
│   ├── admin/                        # Admin panel routes
│   │   ├── layout.js                 # Admin layout with navigation
│   │   ├── page.js                   # Admin dashboard
│   │   ├── pages/                    # Page management
│   │   │   ├── page.js               # Pages list
│   │   │   └── [id]/page.js          # Page editor
│   │   ├── menus/                    # Navigation management
│   │   ├── blocks/                   # Reusable blocks
│   │   ├── products/                 # Products CRUD
│   │   ├── services/                 # Services CRUD
│   │   ├── media/                    # Media library
│   │   ├── enhanced-theme/           # Enhanced theme settings
│   │   ├── settings/                 # Site settings
│   │   ├── users/                    # Admin users
│   │   └── inquiries/                # Contact form submissions
│   ├── preview/[token]/              # Preview pages
│   ├── api/                          # API routes
│   │   ├── admin/                    # Admin API endpoints
│   │   │   ├── [resource]/           # Generic CRUD API
│   │   │   ├── auth/                 # Authentication
│   │   │   ├── upload/               # File uploads
│   │   │   ├── publish/              # Publishing
│   │   │   ├── reorder/              # Reordering
│   │   │   ├── sections/[id]/        # Section-specific
│   │   │   ├── site-settings/        # Site settings
│   │   │   ├── themes/               # Theme management
│   │   │   └── pages/[id]/          # Page-specific APIs
│   │   └── public/                   # Public read-only API
│   │       ├── products/             # Products API
│   │       ├── services/             # Services API
│   │       ├── theme/                # Theme API
│   │       └── inquiries/            # Contact form API
│   ├── globals.css                   # Template CSS + admin styles
│   └── layout.js                     # Root layout with fonts
├── components/                       # React components
│   ├── site/                         # Public site components
│   │   ├── sections/                 # Section components
│   │   │   ├── Hero.jsx              # Hero slider
│   │   │   ├── StatBar.jsx           # Statistics bar
│   │   │   ├── WhyGrid.jsx           # Feature grid
│   │   │   ├── SplitFeature.jsx      # Split feature section
│   │   │   ├── LegacyBand.jsx        # Legacy timeline
│   │   │   ├── ProjectsGrid.jsx      # Projects showcase
│   │   │   ├── IndustriesGrid.jsx    # Industries served
│   │   │   ├── Testimonials.jsx      # Testimonial carousel
│   │   │   ├── PartnersMarquee.jsx   # Partner logos
│   │   │   ├── CertTeaser.jsx        # Certification teaser
│   │   │   ├── CtaBand.jsx           # Call-to-action
│   │   │   ├── ProductsGrid.jsx      # Products listing
│   │   │   ├── RichText.jsx          # Rich text content
│   │   │   ├── Timeline.jsx          # Timeline section
│   │   │   └── HeaderSection.jsx     # Header section
│   │   ├── Header.jsx                # Site header with navigation
│   │   ├── Footer.jsx                # Site footer with links
│   │   ├── SectionRenderer.jsx       # Maps section types to components
│   │   └── ThemeProvider.jsx         # Theme context provider
│   └── admin/                        # Admin panel components
│       ├── AdminShell.jsx            # Admin layout wrapper
│       ├── DynamicForm.jsx           # Auto-form from schemas
│       ├── SectionList.jsx           # Section manager
│       ├── MediaPicker.jsx           # Image/video picker
│       ├── GalleryManager.jsx        # Product/service galleries
│       ├── SeoFields.jsx             # SEO metadata fields
│       ├── ItemsAdmin.jsx            # Generic items admin
│       └── PageThemeOverrides.jsx    # Page theme override editor
├── lib/                              # Core library files
│   ├── db.js                         # MySQL pool + query helpers
│   ├── auth.js                       # JWT session, bcrypt, dev bypass
│   ├── content.js                    # DB reads with fallback logic
│   ├── defaultContent.js             # Real template content (fallback)
│   ├── resources.js                  # CRUD resource registry
│   ├── sectionSchemas.js            # Section field definitions
│   ├── themeRenderer.js              # Theme CSS generation
│   └── repeater.js                   # Repeater item helpers
├── scripts/                          # Utility scripts
│   ├── migrate.js                    # Run schema.sql
│   ├── seed.js                       # Load defaultContent.js
│   ├── db-setup.js                   # Complete DB setup orchestration
│   ├── migrate-enhanced-theme.js     # Enhanced theme migration
│   ├── seed-enhanced-theme.js        # Enhanced theme seed data
│   ├── create-admin.js               # Create admin user
│   ├── setup-menus.js                # Setup menus via API
│   ├── create-footer-menus.js        # Create footer menus
│   └── check-sections.js             # Verify sections in DB
├── public/                           # Static assets
│   ├── assets/                       # Images, SVGs, etc.
│   └── uploads/                      # Local media storage
├── .env.example                      # Environment variables template
├── .env                              # Your environment (don't commit)
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependencies & scripts
├── next.config.js                    # Next.js configuration
├── middleware.js                     # Authentication middleware
├── schema.sql                        # Full MySQL DDL
└── jsconfig.json                     # JavaScript configuration
```

---

## 🎛️ Admin Panel Guide

### Accessing the Admin Panel

Navigate to http://localhost:3000/admin

**Default credentials** (from `.env`):
- Email: `ADMIN_EMAIL` (default: `admin@example.com`)
- Password: `ADMIN_PASSWORD` (default: `StrongPassword123!`)

### Admin Features

#### Dashboard
- Content counts (pages, sections, products, services)
- Quick stats overview
- Recent activity

#### Pages Management
- **List View**: All pages with status, template, and actions
- **Page Editor**: 
  - Basic fields (title, slug, template, visibility)
  - SEO metadata (title, description, keywords)
  - Section management (add, edit, reorder, delete)
  - Preview and publish functionality
  - Theme overrides for page-specific customization

#### Menus Management
- Create and manage navigation menus
- Support for mega-menus with columns
- Hierarchical menu items (parent-child relationships)
- Footer navigation management

#### Reusable Blocks
- Create sections once, reuse across multiple pages
- Block types match section schemas
- Easy content synchronization

#### Products & Services
- Full CRUD operations
- Gallery management for images
- Specifications and pricing
- SEO metadata per item
- Category and tagging support

#### Media Library
- Upload images and videos
- Organize media assets
- Reuse across pages and products
- File size and type validation

#### Settings
- **Site Settings**: Company info, contact details, social links, header/footer configuration

#### Enhanced Theme
- **Colors**: Comprehensive color palette management
- **Typography**: Font configurations for different contexts
- **Spacing**: Global spacing and layout settings
- **Animations**: Animation keyframes and timing
- **Components**: Component-level styling
- **Sections**: Section-specific theme customization
- **Breakpoints**: Responsive design settings

#### Users
- Create admin and editor accounts
- Role-based permissions (admin/editor)
- Password management

#### Inquiries
- View contact form submissions
- Export inquiry data
- Status tracking

### Common Workflows

#### Editing a Page
1. Navigate to `/admin/pages`
2. Click on the page you want to edit
3. Edit page fields (title, slug, template)
4. Configure SEO metadata
5. Add/edit/reorder sections
6. Configure theme overrides (optional)
7. Click "Preview" to see changes
8. Click "Publish" to make live

#### Creating a Reusable Block
1. Go to `/admin/blocks`
2. Click "New Block"
3. Select block type
4. Configure content
5. Save
6. In page editor, set section's "Content source" to the block

#### Adding a Product/Service
1. Go to `/admin/products` or `/admin/services`
2. Click "New"
3. Fill in basic information (title, slug, description)
4. Add specifications and pricing
5. Use Gallery Manager to upload images
6. Configure SEO fields
7. Save

#### Managing Theme Settings
1. Go to `/admin/enhanced-theme`
2. Navigate to the desired tab (Colors, Typography, Spacing, Animations, Components, Sections)
3. Edit theme variables and settings
4. Changes apply globally within 60 seconds (ISR)
5. For page-specific overrides, use the Theme Overrides section in page editor

#### Managing Navigation
1. Go to `/admin/menus`
2. Select menu to edit (main-nav, footer-company, etc.)
3. Add/edit/delete menu items
4. Set up hierarchical structure for mega-menus
5. Configure column headings for mega-menu columns
6. Set visibility and order

---

## 🎨 Section Types

The system supports 15+ section types defined in `lib/sectionSchemas.js`:

### Available Sections

| Section Type | Description | Key Features |
|--------------|-------------|--------------|
| **Hero Slider** | Full-screen slider | Multiple slides, images/videos, CTAs, tag pills |
| **Stat Counter Bar** | Animated statistics | Key metrics with icons and animations |
| **Why Us Grid** | Feature card grid | Icon cards with descriptions |
| **Split Feature** | Text + image section | Asymmetric layout with feature cards |
| **Legacy Timeline** | Milestone timeline | Company journey with dates |
| **Projects Grid** | Featured projects | Case study cards with images |
| **Industries Grid** | Industries served | Icon grid with descriptions |
| **Testimonials** | Carousel | Client quotes and testimonials |
| **Partners Marquee** | Logo marquee | Scrolling partner logos |
| **Certification Teaser** | Cert band | Certification badges |
| **Call-to-Action** | CTA band | Action-oriented section |
| **Products Grid** | Products listing | Dynamic product cards |
| **Services Grid** | Services listing | Service feature cards |
| **Rich Text** | Freeform content | WYSIWYG text editor |
| **Timeline** | Timeline section | Vertical timeline with items |

### Adding Custom Section Types

1. **Define Schema**: Add section definition to `lib/sectionSchemas.js`
2. **Create Component**: Build React component in `components/site/sections/`
3. **Register**: Add to registry in `components/site/SectionRenderer.jsx`
4. **Test**: Admin form auto-generates from schema

---

## 🎨 Enhanced Theme System

### Overview

The Enhanced Theme System provides comprehensive theme customization capabilities through a database-driven approach. Unlike traditional theme systems that require code changes, this system allows complete visual customization through the admin panel.

### Key Features

- **Color Management**: 21+ color variables with semantic naming
- **Typography Control**: Font families, sizes, weights for different contexts
- **Spacing System**: Global spacing and layout configurations
- **Animation Library**: Pre-built animations with customizable timing
- **Component Styling**: Button, card, input component styles
- **Section Themes**: Per-section theme customization
- **Page Overrides**: Page-specific theme variations
- **Responsive Design**: Breakpoint-specific settings

### Theme Categories

#### Colors
- Primary colors (brand colors)
- Secondary colors (supporting palette)
- Accent colors (highlights, CTAs)
- Neutral colors (grays, whites)
- Semantic colors (success, warning, error)

#### Typography
- Display fonts (headings, titles)
- Body fonts (paragraphs, content)
- Mono fonts (code, technical)
- Usage contexts (heading, subheading, body, caption, button, navigation)

#### Spacing
- Section padding
- Component margins
- Grid gaps
- Container widths

#### Animations
- Fade effects
- Slide transitions
- Scale transformations
- Rotations
- Custom keyframes

#### Components
- Buttons (primary, secondary, ghost)
- Cards (hover states, shadows)
- Inputs (focus states, borders)
- Modals (backdrops, animations)

#### Sections
- Hero sections
- Feature grids
- Testimonials
- Call-to-actions
- And more...

### Page-Level Overrides

Each page can have its own theme overrides that:
- Override global theme settings
- Apply specific color schemes
- Customize typography per page
- Adjust spacing for specific layouts
- Enable/disable animations

### CSS Generation

The system automatically generates CSS from database values:
- CSS variables for dynamic values
- Compiled stylesheets for performance
- Automatic minification in production
- Cache busting for updates

### Theme API Endpoints

- `GET /api/admin/themes` - List all themes
- `POST /api/admin/themes` - Create new theme
- `PUT /api/admin/themes/[id]` - Update theme
- `DELETE /api/admin/themes/[id]` - Delete theme
- `GET /api/admin/themes/[id]/settings` - Get theme settings
- `POST /api/admin/themes/[id]/settings` - Save theme settings
- `POST /api/admin/themes/[id]/set-default` - Set as default
- `GET /api/public/theme/css` - Get generated CSS
- `GET /api/admin/pages/[id]/theme-overrides` - Get page overrides
- `POST /api/admin/pages/[id]/theme-overrides` - Save page overrides

---

## 💻 Development Guide

### Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run db:migrate   # Run database migrations (apply schema.sql)
npm run db:seed      # Seed database with default content
npm run db:setup     # Complete database setup (migrate + seed + admin)
npm run seed:enhanced-theme  # Seed enhanced theme data
npm run create-admin # Create admin user manually
npm run setup:menus  # Setup menus via API
```

### Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit components in `components/`
   - Update schemas in `lib/sectionSchemas.js`
   - Modify API routes in `app/api/`

3. **Test Changes**
   - Visit http://localhost:3000 for public site
   - Visit http://localhost:3000/admin for admin panel

4. **Database Changes**
   - Modify `schema.sql` for schema changes
   - Run `npm run db:migrate` to apply
   - Update `lib/defaultContent.js` for content changes
   - Run `npm run db:seed` to reseed

### Adding New Section Types

1. **Add Schema** (`lib/sectionSchemas.js`):
   ```javascript
   export const sectionSchemas = {
     // ... existing sections
     yourSection: {
       label: 'Your Section',
       fields: [
         { name: 'title', label: 'Title', type: 'text' },
         { name: 'description', label: 'Description', type: 'textarea' },
         // ... more fields
       ]
     }
   };
   ```

2. **Create Component** (`components/site/sections/YourSection.jsx`):
   ```javascript
   export default function YourSection({ data }) {
     return (
       <section>
         <h2>{data.title}</h2>
         <p>{data.description}</p>
       </section>
     );
   }
   ```

3. **Register** (`components/site/SectionRenderer.jsx`):
   ```javascript
   import YourSection from './sections/YourSection';

   const registry = {
     // ... existing sections
     yourSection: YourSection,
   };
   ```

### Adding New Admin Resources

1. **Add to Resources** (`lib/resources.js`):
   ```javascript
   export const resources = {
     // ... existing
     yourResource: {
       table: 'your_table',
       fields: ['field1', 'field2', 'field3'],
       // ... configuration
     }
   };
   ```

2. **API Auto-Generated**: CRUD endpoints available at `/api/admin/yourResource`

### Extending Templates

- Pages support different templates via `template` field
- Add custom templates in schema
- Load different stylesheets per template
- Configure section sets per template

### Code Style Guidelines

- Use functional React components with hooks
- Follow existing naming conventions
- Keep components small and focused
- Use TypeScript-style JSDoc comments
- Maintain consistent formatting

---

## 🚀 Deployment

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set strong `JWT_SECRET` in environment
- [ ] Set `DEV_BYPASS_AUTH=false` or omit
- [ ] Configure production database credentials
- [ ] Run database migrations
- [ ] Seed initial content
- [ ] Run enhanced theme migration and seed
- [ ] Create admin user
- [ ] Configure media storage (CDN for production)
- [ ] Set up automated backups
- [ ] Configure domain and SSL
- [ ] Test all functionality

### Hostinger Deployment

#### 1. Provision Database
- Create MySQL database in hPanel
- Note credentials for `.env` configuration

#### 2. Deploy Code
- Push code to GitHub
- Connect repository in hPanel Node.js app
- Or deploy directly via IDE/FTP

#### 3. Configure Application
- **Entry point**: `npm run build && npm run start`
- **Node version**: 18.18.0 or higher
- **Environment variables**: Set in hPanel
- **Build command**: `npm run build`
- **Start command**: `npm run start`

#### 4. Run Database Setup
```bash
npm run db:migrate
npm run db:seed
node scripts/migrate-enhanced-theme.js
npm run seed:enhanced-theme
npm run create-admin -- "Admin Name" admin@example.com "password"
```

#### 5. Configure Domain
- Point domain to Hostinger
- SSL automatically configured
- CDN and WAF included

### Vercel Deployment

#### 1. Environment Variables
Set in Vercel dashboard:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`
- `NEXT_PUBLIC_SITE_URL`

#### 2. Build Configuration
- **Build command**: `npm run build`
- **Output directory**: `.next`
- **Install command**: `npm install`

#### 3. Database Setup
Run setup commands via Vercel CLI or SSH:
```bash
npm run db:migrate
npm run db:seed
node scripts/migrate-enhanced-theme.js
npm run seed:enhanced-theme
npm run create-admin -- "Admin Name" admin@example.com "password"
```

### General Production Considerations

- **Media Storage**: Use CDN (AWS S3, Cloudinary) for production
- **Backups**: Set up automated database backups
- **Monitoring**: Implement error tracking (Sentry, LogRocket)
- **Performance**: Enable caching and CDN
- **Security**: Use strong passwords, enable HTTPS, implement rate limiting

---

## 🔍 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `/admin` redirects to login in dev | `DEV_BYPASS_AUTH=false` | Set `DEV_BYPASS_AUTH=true` in `.env` |
| Public shows default content but edits don't appear | DB query failing | Check DB connection in logs, verify credentials |
| `db:migrate` fails with JSON error | MySQL version too old | Upgrade to MySQL 5.7+ / MariaDB 10.2+ |
| Middleware throws crypto error | Edge runtime issue | Check `middleware.js` runtime setting |
| Uploaded media 404s | `/public/uploads` not persisted | Configure CDN or persistent storage |
| Build fails | Missing dependencies or type errors | Run `npm install` and check logs |
| Sections not showing on homepage | Database query issue | Check `lib/content.js` enrichment logic |
| Theme changes not appearing | Cache not invalidated | Wait for ISR (60s) or clear cache |
| Page theme overrides not working | Override config not saved | Check API response for errors |

### Database Issues

#### Connection Refused
```bash
# Verify MySQL is running
sudo systemctl status mysql  # Linux
brew services list mysql     # macOS

# Check .env credentials
cat .env | grep DB_

# Test connection
mysql -h DB_HOST -u DB_USER -p DB_NAME
```

#### Access Denied
```bash
# Verify user permissions
mysql -u root -p
GRANT ALL PRIVILEGES ON zigma_cms.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Table Already Exists
```bash
# Use db:setup to drop and recreate
npm run db:setup

# Or manually drop tables
mysql -u root -p zigua_cms -e "DROP TABLE sections;"
```

### Development Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Hot Reload Not Working
```bash
# Restart dev server
# Check next.config.js for proper configuration
```

### Content Issues

#### Fallback Content Not Loading
```bash
# Verify defaultContent.js exists
ls -la lib/defaultContent.js

# Check for syntax errors
node -c lib/defaultContent.js
```

#### Hero Section Not Displaying
```bash
# Check database for hero sections
mysql -u root -p zigma_cms -e "SELECT * FROM sections WHERE type='hero';"

# Verify data structure
mysql -u root -p zigma_cms -e "SELECT data FROM sections WHERE type='hero' LIMIT 1\G"
```

### Theme Issues

#### Theme CSS Not Loading
```bash
# Check theme tables exist
mysql -u root -p zigma_cms -e "SHOW TABLES LIKE 'theme_%';"

# Verify theme data
mysql -u root -p zigma_cms -e "SELECT COUNT(*) FROM theme_settings;"
```

#### Page Overrides Not Working
```bash
# Check override table
mysql -u root -p zigma_cms -e "SELECT * FROM page_theme_overrides WHERE page_id = 1;"

# Verify API endpoint
curl http://localhost:3000/api/admin/pages/1/theme-overrides
```

### Getting Help

1. **Check logs**: View terminal output for error messages
2. **Verify environment**: Ensure `.env` is correctly configured
3. **Database check**: Verify database is accessible and has data
4. **Browser console**: Check for client-side errors
5. **Network tab**: Verify API calls are succeeding

---

## 📚 Additional Resources

### Key Files Reference

- **`lib/sectionSchemas.js`**: All section type definitions
- **`lib/defaultContent.js`**: Fallback content (single source of truth)
- **`lib/content.js`**: Database fetching with fallback logic
- **`lib/themeRenderer.js`**: Theme CSS generation logic
- **`schema.sql`**: Complete database schema
- **`middleware.js`**: Authentication middleware
- **`scripts/migrate-enhanced-theme.js`**: Enhanced theme migration
- **`scripts/seed-enhanced-theme.js`**: Enhanced theme seed data

### Architecture Diagrams

```
┌─────────────────────────────────────────────────────────────┐
│                        Public Site                           │
├─────────────────────────────────────────────────────────────┤
│  Next.js App Router                                         │
│  ├─ (site)/layout.js (Header/Footer + Theme CSS)           │
│  ├─ page.js (Homepage)                                      │
│  ├─ [slug]/page.js (Dynamic pages)                          │
│  └─ SectionRenderer (Maps sections to components)          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Admin Panel                             │
├─────────────────────────────────────────────────────────────┤
│  Admin Layout (Navigation + Chrome)                         │
│  ├─ Dashboard                                               │
│  ├─ Pages Management                                        │
│  ├─ Enhanced Theme System                                  │
│  ├─ Products/Services                                       │
│  ├─ Media Library                                          │
│  └─ Settings                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
├─────────────────────────────────────────────────────────────┤
│  Generic CRUD API ([resource]/route.js)                     │
│  Theme Management API (themes/[id]/)                        │
│  Page Override API (pages/[id]/theme-overrides)             │
│  Authentication API (auth/)                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
├─────────────────────────────────────────────────────────────┤
│  MySQL/MariaDB                                               │
│  ├─ Content Tables (pages, sections, menus)                 │
│  ├─ Theme Tables (theme_settings, theme_typography, etc.)   │
│  ├─ Media Tables (media_assets, item_media)                  │
│  └─ System Tables (users, site_settings)                    │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Request → Next.js → API Route → Database Query
     ↓
Database Response → Content Processing → Component Rendering
     ↓
Fallback System (if DB fails) → Default Content → Render
```

### Theme System Flow

```
Admin Panel → Theme Settings → Database (theme_settings)
     ↓
Theme Renderer → CSS Generation → Public API (/api/public/theme/css)
     ↓
Public Site → CSS Link → Theme Application
     ↓
Page Overrides → Merge with Global Theme → Final CSS
```

---

## 🤝 Contributing

When contributing to this project:

1. Follow existing code style and conventions
2. Test thoroughly before submitting changes
3. Update documentation as needed
4. Ensure database migrations are included
5. Test fallback system functionality
6. Verify theme system compatibility

---

## 📄 License

This project is proprietary software for Zigma Technologies. All rights reserved.

---

## 🎉 Summary

You now have a complete understanding of the Zigma Website Builder:

- **For Developers**: Extensible architecture with clear separation of concerns
- **For Content Managers**: Intuitive admin panel with no coding required
- **For Business Owners**: Complete control over website content

The system is designed to be:
- **Reliable**: Database-first with fallback system
- **Flexible**: Section-based architecture for easy customization
- **Scalable**: Enhanced theme system for comprehensive branding
- **User-Friendly**: Intuitive admin panel for non-technical users
- **Professional**: Pre-built templates with production-ready code

Start building your website today with `npm run db:setup && npm run dev`!
