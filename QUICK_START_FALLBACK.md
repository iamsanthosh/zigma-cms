# Quick Start - Database Setup & Fallback Content

## ⚡ 30-Second Setup

```bash
npm run db:setup
npm run dev
```

That's it! Visit `http://localhost:3000` and you'll see the complete Zigma Technologies website with all sections pre-populated.

## 🔑 Default Admin Credentials

- **Email:** `admin@zigma.com`
- **Password:** `StrongPass123!`
- **Configure via:** `.env` file (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD)

## 📋 What Got Seeded

### ✓ 15 Section Types with Complete Content
- Hero Slider (5 professional slides)
- Stat Bars (Key metrics)
- Why Zigma Grid (6 capability cards)
- Split Features (Solar, UPS, Engineering)
- Timeline (20-year company journey)
- Projects Grid (3 case studies)
- Industries Grid (8 sectors served)
- Testimonials (4 client quotes)
- Partners Marquee (6 partners)
- Certifications Teaser
- CTA Band
- And more...

### ✓ Navigation Menus
- Main navigation (6 links)
- Footer navigation (4 links)

### ✓ Site Settings
- Company info, contact details
- Social media links
- All branding information

### ✓ Pages
- Home page (with all sections)
- About, Services pages (with fallback)

## 🛡️ Database Fallback System

**If database connection fails or is unavailable:**
- Website still renders completely ✓
- All content displays perfectly ✓
- No error pages ✓
- Graceful degradation ✓

**Example:**
```bash
# Stop the database
sudo systemctl stop mysql

# Start the app
npm run dev

# Visit http://localhost:3000
# Website works perfectly from fallback content!
```

## 🎨 Customization

### In Admin Panel
1. Login at `/admin`
2. Edit any section
3. Add new sections
4. Customize colors (e.g., hero tag-pill hover color)
5. Upload images

**Database changes take precedence** over fallback content.

### Programmatic
```javascript
import defaultContent from './lib/defaultContent';

// Access any fallback content
defaultContent.sections  // All 15+ sections
defaultContent.settings  // Site settings
defaultContent.menus     // Navigation
defaultContent.pages     // Page templates
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `lib/defaultContent.js` | Complete fallback content (20KB) |
| `lib/content.js` | DB-first, fallback-second logic |
| `scripts/db-setup.js` | One-command full database setup |
| `.env` | Database & admin credentials |

## 🔍 Verify Setup

### Check Database
```bash
mysql -u root -p zigma -e "SELECT COUNT(*) as sections FROM sections;"
# Should show: 15 sections
```

### Check Seeded Data
```bash
mysql -u root -p zigma -e "SELECT * FROM site_settings LIMIT 5;"
# Should show site configuration
```

### Check Admin User
```bash
mysql -u root -p zigma -e "SELECT email, role FROM users WHERE role='admin';"
# Should show: admin@zigma.com | admin
```

## ⚙️ Environment Setup

### .env File (Required)
```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=zigma

# Admin User (used during db:setup)
ADMIN_NAME="Your Name"
ADMIN_EMAIL="you@zigma-technologies.com"
ADMIN_PASSWORD="StrongPass123!"
```

## 🚀 Development Commands

```bash
# Full database reset + seed
npm run db:setup

# Start development server
npm run dev

# Login to admin panel
open http://localhost:3000/admin

# View database logs
npm run db:logs

# Rebuild database (without reset)
npm run db:migrate
```

## 🐛 Troubleshooting

### "Database connection failed"
1. Start MySQL: `sudo systemctl start mysql`
2. Check .env file
3. Verify credentials

### "Admin login fails"
1. Check database: `mysql -u root -p -e "SELECT * FROM users;"`
2. Regenerate admin: `npm run db:setup`
3. Verify password in .env

### "Sections not showing"
1. Check database is running
2. Verify pages have sections: 
   ```bash
   mysql -u root -p zigma -e "SELECT COUNT(*) FROM section_items;"
   ```
3. Check browser console for errors

### "Fallback not working"
1. Stop database (test fallback)
2. Refresh page
3. Verify defaultContent.js is present

## 📊 Seeded Content Overview

### Hero Slides (5)
- 20 Years of Legacy (theme-legacy)
- UPS & Power Continuity (theme-ups)
- Solar & Green Energy (theme-solar)
- Engineering Design (theme-engineering)
- Future-Ready Solutions (theme-future)

### Statistics (8)
- 20+ Years Experience
- 500+ Projects
- 50MW+ Solar
- 2000+ Clients
- 99.9% Uptime
- 500+ Workforce
- ₹50Cr+ Project Value
- 24/7 Support

### Features (6)
- Proven Expertise
- End-to-End Solutions
- 24/7 Support
- Cost Optimization
- Scalable Infrastructure
- Certified & Compliant

### Timeline (6 milestones)
- 2004: Founded
- 2008: First Solar Installation
- 2012: ISO Certification
- 2016: National Expansion
- 2020: IoT Integration
- 2024: AI-Driven Analytics ✨

## 🎯 What's Included

✅ Complete company branding  
✅ All section types defined  
✅ Professional copy & descriptions  
✅ Real statistics & metrics  
✅ Client testimonials  
✅ Case studies  
✅ Industry expertise  
✅ Navigation structure  
✅ Contact information  
✅ Social media links  
✅ Admin user pre-created  
✅ Database fully configured  

## 📝 Notes

- Admin credentials are set from `.env` during `npm run db:setup`
- All HTML template content converted to seed data
- Fallback system ensures zero downtime
- Database changes take precedence over defaults
- Perfect for multi-environment deployment

---

**Ready to go!** Your Zigma Technologies website is now fully set up with comprehensive fallback support.

Need help? See `COMPREHENSIVE_SETUP_GUIDE.md` for detailed information.
