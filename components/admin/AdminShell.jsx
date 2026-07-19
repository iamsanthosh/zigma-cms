'use client';
import { useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/pages', label: 'Pages' },
  { href: '/admin/menus', label: 'Menus & Navigation' },
  { href: '/admin/blocks', label: 'Reusable Blocks' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/media', label: 'Media Library' },
  { href: '/admin/settings', label: 'Site & Theme Settings' },
  { href: '/admin/users', label: 'Admin Users' }
];

export default function AdminShell({ user, children }) {
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: '1.5rem', color: '#fff' }}>
          Zigma CMS
        </div>
        {NAV.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.8rem', color: '#8FA3C2', marginBottom: '0.5rem' }}>
            {user.name} · {user.role}
          </div>
          <button className="admin-btn admin-btn-ghost" onClick={logout} style={{ width: '100%', justifyContent: 'center' }}>
            Log out
          </button>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <a href="/" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem' }}>
            View live site ↗
          </a>
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
