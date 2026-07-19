-- ============================================================
-- Zigma Website Builder — MySQL schema
-- Target: Hostinger managed MySQL (5.7+/8.0)
-- Run:  npm run db:migrate
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------
-- users & roles
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','editor') NOT NULL DEFAULT 'editor',
  active        TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- site_settings — single-row-per-key global config (logo, name, socials...)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  `key`       VARCHAR(120) PRIMARY KEY,
  `value`     LONGTEXT,          -- JSON-encoded value
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- theme_settings — CSS-variable-driven design tokens (colors, fonts, spacing)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS theme_settings (
  `key`       VARCHAR(120) PRIMARY KEY,   -- e.g. "--orange", "--font-display"
  `value`     VARCHAR(255) NOT NULL,
  category    VARCHAR(60)  NOT NULL DEFAULT 'color', -- color | font | spacing | effect
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- menus & menu_items (supports nested mega-menu columns)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menus (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(60) NOT NULL UNIQUE,     -- 'primary-nav', 'footer-company', ...
  label       VARCHAR(120) NOT NULL,
  active      TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS menu_items (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  menu_id       INT NOT NULL,
  parent_id     INT NULL,                      -- self-reference for mega-menu columns/links
  label         VARCHAR(160) NOT NULL,
  url            VARCHAR(500) NOT NULL DEFAULT '#',
  column_heading VARCHAR(120) NULL,             -- mega-menu column title (e.g. "Company")
  `order`       INT NOT NULL DEFAULT 0,
  visible       TINYINT(1) NOT NULL DEFAULT 1,
  active        TINYINT(1) NOT NULL DEFAULT 1,
  open_in_new   TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- pages
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pages (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(160) NOT NULL UNIQUE,   -- '' or 'home' for homepage, 'about', 'products', ...
  title         VARCHAR(200) NOT NULL,
  template      VARCHAR(60)  NOT NULL DEFAULT 'default',
  visible       TINYINT(1) NOT NULL DEFAULT 1,
  active        TINYINT(1) NOT NULL DEFAULT 1,
  `order`       INT NOT NULL DEFAULT 0,
  publish_status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  seo_id        INT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- reusable_blocks — sections that can be dropped onto multiple pages
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reusable_blocks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(160) NOT NULL,
  type        VARCHAR(60)  NOT NULL,      -- matches a key in lib/sectionSchemas.js
  data        LONGTEXT     NOT NULL,      -- JSON payload matching that type's field schema
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- sections — ordered content blocks belonging to a page (or referencing a reusable_block)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sections (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  page_id           INT NOT NULL,
  reusable_block_id INT NULL,                 -- if set, `data` is ignored in favor of the block's data
  type              VARCHAR(60) NOT NULL,     -- hero | splitFeature | legacy | industriesGrid | productsGrid | ctaBand | ...
  name              VARCHAR(160) NULL,        -- admin-facing label, e.g. "Hero — Home"
  data              LONGTEXT NOT NULL,        -- JSON payload matching type's field schema
  background_style  VARCHAR(20) NOT NULL DEFAULT 'light', -- light | dark | gray | iceblue
  `order`           INT NOT NULL DEFAULT 0,
  visible           TINYINT(1) NOT NULL DEFAULT 1,
  active            TINYINT(1) NOT NULL DEFAULT 1,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  FOREIGN KEY (reusable_block_id) REFERENCES reusable_blocks(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- section_items — repeatable child rows inside a section
-- (stat counters, mega-menu links, testimonial slides, industry cards...)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS section_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  section_id  INT NOT NULL,
  data        LONGTEXT NOT NULL,   -- JSON payload, shape depends on parent section type
  `order`     INT NOT NULL DEFAULT 0,
  visible     TINYINT(1) NOT NULL DEFAULT 1,
  active      TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- media_assets
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_assets (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  type          ENUM('image','video') NOT NULL DEFAULT 'image',
  url           VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500) NULL,
  alt_text      VARCHAR(255) NULL,
  caption       VARCHAR(255) NULL,
  width         INT NULL,
  height        INT NULL,
  file_size     INT NULL,          -- bytes
  folder        VARCHAR(160) NULL DEFAULT 'general',
  uploaded_by   INT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- products & services (kept as separate tables — different field emphasis —
-- but share an identical shape so the admin/public code paths are unified)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(160) NOT NULL UNIQUE,
  title         VARCHAR(200) NOT NULL,
  subtitle      VARCHAR(255) NULL,
  description   LONGTEXT NULL,
  specifications LONGTEXT NULL,     -- JSON array of {label, value}
  price_label   VARCHAR(120) NULL, -- free-text pricing model, e.g. "Starting at ₹X / kW"
  tags          VARCHAR(500) NULL, -- comma-separated
  cta_label     VARCHAR(80)  NULL,
  cta_url       VARCHAR(500) NULL,
  thumbnail_id  INT NULL,
  `order`       INT NOT NULL DEFAULT 0,
  visible       TINYINT(1) NOT NULL DEFAULT 1,
  active        TINYINT(1) NOT NULL DEFAULT 1,
  seo_id        INT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (thumbnail_id) REFERENCES media_assets(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS services (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(160) NOT NULL UNIQUE,
  title         VARCHAR(200) NOT NULL,
  subtitle      VARCHAR(255) NULL,
  description   LONGTEXT NULL,
  specifications LONGTEXT NULL,
  price_label   VARCHAR(120) NULL,
  tags          VARCHAR(500) NULL,
  cta_label     VARCHAR(80)  NULL,
  cta_url       VARCHAR(500) NULL,
  thumbnail_id  INT NULL,
  `order`       INT NOT NULL DEFAULT 0,
  visible       TINYINT(1) NOT NULL DEFAULT 1,
  active        TINYINT(1) NOT NULL DEFAULT 1,
  seo_id        INT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (thumbnail_id) REFERENCES media_assets(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Media galleries attached to a product or service (many-to-many via junction)
CREATE TABLE IF NOT EXISTS item_media (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  item_type   ENUM('product','service') NOT NULL,
  item_id     INT NOT NULL,
  media_id    INT NOT NULL,
  role        ENUM('gallery','background') NOT NULL DEFAULT 'gallery',
  `order`     INT NOT NULL DEFAULT 0,
  FOREIGN KEY (media_id) REFERENCES media_assets(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE INDEX idx_item_media_lookup ON item_media(item_type, item_id);

-- ---------------------------------------------------------------
-- inquiries — contact / quote-request form submissions
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiries (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(160) NOT NULL,
  email         VARCHAR(190) NULL,
  phone         VARCHAR(40)  NULL,
  message       LONGTEXT NULL,
  source_page   VARCHAR(160) NULL,
  related_item_type ENUM('product','service') NULL,
  related_item_id   INT NULL,
  status        ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- seo_metadata — reusable per-page / per-item SEO fields
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seo_metadata (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  meta_title      VARCHAR(255) NULL,
  meta_description VARCHAR(500) NULL,
  og_image_id     INT NULL,
  canonical_url   VARCHAR(500) NULL,
  no_index        TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (og_image_id) REFERENCES media_assets(id) ON DELETE SET NULL
) ENGINE=InnoDB;

ALTER TABLE pages    ADD CONSTRAINT fk_pages_seo    FOREIGN KEY (seo_id) REFERENCES seo_metadata(id) ON DELETE SET NULL;
ALTER TABLE products ADD CONSTRAINT fk_products_seo FOREIGN KEY (seo_id) REFERENCES seo_metadata(id) ON DELETE SET NULL;
ALTER TABLE services ADD CONSTRAINT fk_services_seo FOREIGN KEY (seo_id) REFERENCES seo_metadata(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------
-- publish_versions / preview_versions — lightweight content versioning
-- Every time a page (or product/service) is published or previewed, a full
-- JSON snapshot of {page, sections, section_items} is stored here so the
-- admin can preview drafts without touching the live published data, and
-- so publishing is a single atomic "promote snapshot" action.
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS publish_versions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  entity_type VARCHAR(30) NOT NULL,   -- 'page' | 'product' | 'service'
  entity_id   INT NOT NULL,
  snapshot    LONGTEXT NOT NULL,      -- full JSON snapshot
  published_by INT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (published_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
CREATE INDEX idx_publish_versions_lookup ON publish_versions(entity_type, entity_id, created_at);

CREATE TABLE IF NOT EXISTS preview_versions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  entity_type VARCHAR(30) NOT NULL,
  entity_id   INT NOT NULL,
  token       VARCHAR(64) NOT NULL UNIQUE,  -- shareable preview link token
  snapshot    LONGTEXT NOT NULL,
  expires_at  DATETIME NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
