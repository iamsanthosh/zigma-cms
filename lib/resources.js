// Central map of every admin-editable resource. Adding a new configurable
// content type (a new table) means adding one entry here — the generic
// CRUD route handlers in app/api/admin/[resource]/ do the rest.
//
// `fields`   — whitelist of columns the admin UI may write. Anything not
//              listed here is stripped from incoming request bodies, so a
//              resource can never be used to overwrite id/timestamps/etc.
// `json`     — subset of `fields` that must be JSON.stringify'd on write and
//              JSON.parse'd on read (data blobs, specifications, tags arrays).
// `orderBy`  — default sort for list endpoints.
// `searchable` — columns the admin search box matches against.

export const resources = {
  pages: {
    table: 'pages',
    fields: ['slug', 'title', 'template', 'visible', 'active', 'order', 'publish_status', 'seo_id'],
    json: [],
    orderBy: '`order` ASC, id ASC',
    searchable: ['slug', 'title']
  },
  menus: {
    table: 'menus',
    fields: ['slug', 'label', 'active'],
    json: [],
    orderBy: 'id ASC',
    searchable: ['slug', 'label']
  },
  'menu-items': {
    table: 'menu_items',
    fields: ['menu_id', 'parent_id', 'label', 'url', 'column_heading', 'order', 'visible', 'active', 'open_in_new'],
    json: [],
    orderBy: '`order` ASC, id ASC',
    searchable: ['label']
  },
  sections: {
    table: 'sections',
    fields: ['page_id', 'reusable_block_id', 'type', 'name', 'data', 'background_style', 'order', 'visible', 'active'],
    json: ['data'],
    orderBy: '`order` ASC, id ASC',
    searchable: ['name', 'type']
  },
  'section-items': {
    table: 'section_items',
    fields: ['section_id', 'data', 'order', 'visible', 'active'],
    json: ['data'],
    orderBy: '`order` ASC, id ASC',
    searchable: []
  },
  'reusable-blocks': {
    table: 'reusable_blocks',
    fields: ['name', 'type', 'data'],
    json: ['data'],
    orderBy: 'name ASC',
    searchable: ['name', 'type']
  },
  media: {
    table: 'media_assets',
    fields: ['type', 'url', 'thumbnail_url', 'alt_text', 'caption', 'width', 'height', 'file_size', 'folder', 'uploaded_by'],
    json: [],
    orderBy: 'created_at DESC',
    searchable: ['alt_text', 'caption', 'folder']
  },
  products: {
    table: 'products',
    fields: ['slug', 'title', 'subtitle', 'description', 'specifications', 'price_label', 'tags', 'cta_label', 'cta_url', 'thumbnail_id', 'order', 'visible', 'active', 'seo_id'],
    json: ['specifications'],
    orderBy: '`order` ASC, id ASC',
    searchable: ['title', 'subtitle', 'tags']
  },
  services: {
    table: 'services',
    fields: ['slug', 'title', 'subtitle', 'description', 'specifications', 'price_label', 'tags', 'cta_label', 'cta_url', 'thumbnail_id', 'order', 'visible', 'active', 'seo_id'],
    json: ['specifications'],
    orderBy: '`order` ASC, id ASC',
    searchable: ['title', 'subtitle', 'tags']
  },
  inquiries: {
    table: 'inquiries',
    fields: ['name', 'email', 'phone', 'message', 'source_page', 'related_item_type', 'related_item_id', 'status'],
    json: [],
    orderBy: 'created_at DESC',
    searchable: ['name', 'email', 'phone']
  },
  'item-media': {
    table: 'item_media',
    fields: ['item_type', 'item_id', 'media_id', 'role', 'order'],
    json: [],
    orderBy: '`order` ASC, id ASC',
    searchable: []
  },
  'seo-metadata': {
    table: 'seo_metadata',
    fields: ['meta_title', 'meta_description', 'og_image_id', 'canonical_url', 'no_index'],
    json: [],
    orderBy: 'id DESC',
    searchable: ['meta_title']
  },
  users: {
    table: 'users',
    fields: ['name', 'email', 'role', 'active'], // password handled by its own endpoint, never here
    json: [],
    orderBy: 'name ASC',
    searchable: ['name', 'email']
  },
  'site-settings': {
    table: 'site_settings',
    fields: ['key', 'value'],
    json: ['value'],
    orderBy: '`key` ASC',
    searchable: ['key'],
    primaryKey: 'key' // this table is keyed by string, not an auto-increment id
  },
  'theme-settings': {
    table: 'theme_settings',
    fields: ['key', 'value', 'category'],
    json: [],
    orderBy: 'category ASC, `key` ASC',
    searchable: ['key', 'category'],
    primaryKey: 'key'
  }
};

export function getResource(name) {
  return resources[name] || null;
}
