import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [[pages], [products], [services], [inquiries], [media]] = await Promise.all([
    query(`SELECT COUNT(*) as c FROM pages`),
    query(`SELECT COUNT(*) as c FROM products`),
    query(`SELECT COUNT(*) as c FROM services`),
    query(`SELECT COUNT(*) as c FROM inquiries WHERE status = 'new'`),
    query(`SELECT COUNT(*) as c FROM media_assets`)
  ]);

  const cards = [
    { label: 'Pages', value: pages.c, href: '/admin/pages' },
    { label: 'Products', value: products.c, href: '/admin/products' },
    { label: 'Services', value: services.c, href: '/admin/services' },
    { label: 'New Inquiries', value: inquiries.c, href: '/admin/inquiries' },
    { label: 'Media Assets', value: media.c, href: '/admin/media' }
  ];

  return (
    <div>
      <h1 className="admin-h1">Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '1rem' }}>
        {cards.map((c) => (
          <a key={c.label} href={c.href} className="admin-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{c.value}</div>
            <div style={{ color: '#5B6472', fontSize: '0.9rem' }}>{c.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
